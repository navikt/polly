package no.nav.data.catalog.backend.app.github;

import com.google.common.base.Joiner;
import no.nav.data.catalog.backend.app.common.exceptions.DataCatalogBackendTechnicalException;
import no.nav.data.catalog.backend.app.common.tokensupport.JwtTokenGenerator;
import no.nav.data.catalog.backend.app.common.validator.ValidationError;
import no.nav.data.catalog.backend.app.github.domain.GithubInstallation;
import no.nav.data.catalog.backend.app.github.domain.GithubInstallationToken;
import no.nav.data.catalog.backend.app.github.domain.RepoModification;
import org.eclipse.egit.github.core.CommitFile;
import org.eclipse.egit.github.core.CommitStatus;
import org.eclipse.egit.github.core.RepositoryCommitCompare;
import org.eclipse.egit.github.core.RepositoryContents;
import org.eclipse.egit.github.core.RepositoryId;
import org.eclipse.egit.github.core.service.CommitService;
import org.eclipse.egit.github.core.service.ContentsService;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static java.time.LocalDateTime.now;
import static no.nav.data.catalog.backend.app.common.utils.StreamUtils.safeStream;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;

@Component
public class GithubConsumer {

    public static final String REFS_HEADS_MASTER = "refs/heads/master";
    private static final String ERROR_COMMUNICATING_WITH_GITHUB = "Error communicating with github";

    private final RestTemplate restTemplate;
    private final JwtTokenGenerator tokenGenerator;

    private final RepositoryId repositoryId;
    private final GitHubClient gitHubClient;
    private final CommitService commitService;
    private final ContentsService contentsService;
    private final String installationsUri;

    private LocalDateTime lastToken = LocalDateTime.MIN;

    public GithubConsumer(RestTemplate restTemplate, JwtTokenGenerator tokenGenerator,
                          GitHubClient gitHubClient, RepositoryId repositoryId) {
        this.restTemplate = restTemplate;
        this.tokenGenerator = tokenGenerator;
        this.repositoryId = repositoryId;
        this.gitHubClient = gitHubClient;
        commitService = new CommitService(this.gitHubClient);
        contentsService = new ContentsService(this.gitHubClient);
        installationsUri = gitHubClient.getBaseUri() + "/app/installations";
    }

    public void updateStatus(String sha, List<ValidationError> validationErrors) {
        updateToken();
        boolean isOk = validationErrors.isEmpty();
        try {
            CommitStatus status = new CommitStatus();
            status.setState(isOk ? CommitStatus.STATE_SUCCESS : CommitStatus.STATE_FAILURE);
            status.setDescription(isOk ? "ok" : Joiner.on(", ").join(validationErrors));
            status.setContext("data-catalog-validation");
            commitService.createStatus(repositoryId, sha, status);
        } catch (Exception e) {
            throw new DataCatalogBackendTechnicalException(ERROR_COMMUNICATING_WITH_GITHUB, e);
        }
    }

    public String getShaOfMaser() {
        updateToken();
        try {
            return commitService.getCommit(repositoryId, REFS_HEADS_MASTER).getSha();
        } catch (IOException e) {
            throw new DataCatalogBackendTechnicalException(ERROR_COMMUNICATING_WITH_GITHUB, e);
        }
    }

    public RepoModification compare(String shaStart, String shaEnd) {
        updateToken();
        try {
            if (shaStart == null) {
                // start from scratch, only loading files from root
                List<RepositoryContents> contents = contentsService.getContents(repositoryId);
                return RepoModification.builder()
                        .head(shaEnd)
                        .added(contents.stream()
                                .filter(content -> content.getName().endsWith("json"))
                                .flatMap(content -> getContents(shaEnd, content.getPath()).stream())
                                .collect(Collectors.toList()))
                        .build();
            }
            RepositoryCommitCompare commitCompare = commitService.compare(repositoryId, shaStart, shaEnd);
            Map<String, List<CommitFile>> files = commitCompare.getFiles().stream()
                    .collect(Collectors.groupingBy(CommitFile::getStatus));

            List<RepositoryContents> added = safeStream(files.get("added"))
                    .flatMap(file -> getContents(shaEnd, file.getFilename()).stream())
                    .collect(Collectors.toList());
            List<RepositoryContents> modifiedBefore = safeStream(files.get("modified"))
                    .flatMap(file -> getContents(shaStart, file.getFilename()).stream())
                    .collect(Collectors.toList());
            List<RepositoryContents> modifiedAfter = safeStream(files.get("modified"))
                    .flatMap(file -> getContents(shaEnd, file.getFilename()).stream())
                    .collect(Collectors.toList());
            List<RepositoryContents> deleted = safeStream(files.get("removed"))
                    .flatMap(file -> getContents(shaStart, file.getFilename()).stream())
                    .collect(Collectors.toList());

            return RepoModification.builder()
                    .head(shaEnd)
                    .added(added)
                    .modifiedBefore(modifiedBefore)
                    .modifiedAfter(modifiedAfter)
                    .deleted(deleted)
                    .build();
        } catch (IOException e) {
            throw new DataCatalogBackendTechnicalException(ERROR_COMMUNICATING_WITH_GITHUB, e);
        }
    }

    public List<RepositoryContents> getContents(String ref, String filename) {
        updateToken();
        try {
            return contentsService.getContents(repositoryId, filename, ref);
        } catch (IOException e) {
            throw new DataCatalogBackendTechnicalException(ERROR_COMMUNICATING_WITH_GITHUB, e);
        }
    }

    private String getInstallationId() {
        try {
            ResponseEntity<GithubInstallation[]> responseEntity = restTemplate
                    .exchange(installationsUri, HttpMethod.GET, new HttpEntity<>(createBearerHeader()), GithubInstallation[].class);
            return Optional.of(responseEntity)
                    .map(ResponseEntity::getBody)
                    .map(Stream::of)
                    .flatMap(installations -> installations
                            .filter(installation -> repositoryId.getOwner().equals(installation.getAccount().getLogin()))
                            .map(GithubInstallation::getId)
                            .findFirst())
                    .orElseThrow(() -> new DataCatalogBackendTechnicalException("GitHub returned null for installationId value!"));
        } catch (
                HttpClientErrorException e) {
            throw new DataCatalogBackendTechnicalException(
                    String.format("Calling Github to get installation id failed with status=%s message=%s", e.getStatusCode(), e
                            .getResponseBodyAsString()), e, e.getStatusCode());
        } catch (
                HttpServerErrorException e) {
            throw new DataCatalogBackendTechnicalException(
                    String.format("Service getting Github installation id failed with status=%s message=%s", e.getStatusCode(), e
                            .getResponseBodyAsString()), e, e.getStatusCode());
        }
    }

    private String getInstallationToken(String installationId) {
        try {
            var responseEntity = restTemplate
                    .exchange(String.format("%s/%s/access_tokens", installationsUri, installationId), HttpMethod.POST, new HttpEntity<>(createBearerHeader()),
                            GithubInstallationToken.class);
            return Optional.of(responseEntity)
                    .map(ResponseEntity::getBody)
                    .map(GithubInstallationToken::getToken)
                    .orElseThrow(() -> new DataCatalogBackendTechnicalException("GitHub returned null for installation token value!"));
        } catch (HttpClientErrorException e) {
            throw new DataCatalogBackendTechnicalException(
                    String.format("Calling Github to get installation token failed with status=%s message=%s", e.getStatusCode(), e
                            .getResponseBodyAsString()), e,
                    e.getStatusCode());
        } catch (
                HttpServerErrorException e) {
            throw new DataCatalogBackendTechnicalException(
                    String.format("Service getting Github installation token failed with status=%s message=%s", e.getStatusCode(), e
                            .getResponseBodyAsString()), e,
                    e.getStatusCode());
        }
    }

    private HttpHeaders createBearerHeader() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("accept", "application/vnd.github.machine-man-preview+json");
        headers.add(AUTHORIZATION, "Bearer " + tokenGenerator.generateToken());
        return headers;
    }

    private void updateToken() {
        if (lastToken.isAfter(now().minusMinutes(JwtTokenGenerator.TOKEN_MAX_AGE_MINUTES - 1))) {
            return;
        }
        String token = getInstallationToken(getInstallationId());
        gitHubClient.setOAuth2Token(token);
        lastToken = now();
    }
}
