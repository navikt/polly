package no.nav.polly.github;

import no.nav.polly.common.tokensupport.JwtTokenGenerator;
import no.nav.polly.common.validator.ValidationError;
import no.nav.polly.github.domain.GithubAccount;
import no.nav.polly.github.domain.GithubInstallation;
import no.nav.polly.github.domain.GithubInstallationToken;
import no.nav.polly.github.domain.RepoModification;
import org.eclipse.egit.github.core.CommitFile;
import org.eclipse.egit.github.core.CommitStatus;
import org.eclipse.egit.github.core.RepositoryCommit;
import org.eclipse.egit.github.core.RepositoryCommitCompare;
import org.eclipse.egit.github.core.RepositoryContents;
import org.eclipse.egit.github.core.RepositoryId;
import org.eclipse.egit.github.core.client.GitHubRequest;
import org.eclipse.egit.github.core.client.GitHubResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import static java.util.Arrays.asList;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
public class GithubConsumerTest {

    @Mock
    private RestTemplate restTemplate;
    @Mock
    private JwtTokenGenerator jwtTokenGenerator;
    @Mock
    private GitHubClient gitHubClient;
    @Spy
    private RepositoryId repositoryId = new RepositoryId("owner", "name");

    @InjectMocks
    private GithubConsumer githubConsumer;

    @Captor
    private ArgumentCaptor<Map<String, String>> mapCaptor;

    @Test
    void getContents() throws IOException {
        RepositoryContents repositoryContents = new RepositoryContents();
        when(gitHubClient.get(any(GitHubRequest.class))).thenReturn(new GitHubResponse(null, repositoryContents));
        List<RepositoryContents> fileInfo = githubConsumer.getContents("master", "filename.json");
        assertThat(fileInfo.get(0)).isEqualTo(repositoryContents);
    }

    @Test
    void getMaster() throws IOException {
        String master = "12512";
        when(gitHubClient.get(any(GitHubRequest.class))).thenReturn(new GitHubResponse(null, new RepositoryCommit().setSha(master)));
        assertThat(githubConsumer.getShaOfMaser()).isEqualTo(master);
    }

    @Test
    void updateStatusOk() throws IOException {
        String sha = "12512";
        when(gitHubClient.post(anyString(), mapCaptor.capture(), any())).thenReturn(new CommitStatus());
        githubConsumer.updateStatus(sha, Collections.emptyList());

        Map<String, String> value = mapCaptor.getValue();
        assertThat(value.get("state")).isEqualTo(CommitStatus.STATE_SUCCESS);
        assertThat(value.get("description")).isEqualTo("ok");
        assertThat(value.get("context")).isEqualTo("polly-validation");
    }

    @Test
    void updateStatusFailure() throws IOException {
        String sha = "12512";
        when(gitHubClient.post(anyString(), mapCaptor.capture(), any())).thenReturn(new CommitStatus());
        List<ValidationError> validationErrors = asList(new ValidationError("ref1", "type1", "feilmessage1"),
                new ValidationError("ref2", "type2", "feilmessage2"));
        githubConsumer.updateStatus(sha, validationErrors);

        Map<String, String> value = mapCaptor.getValue();
        assertThat(value.get("state")).isEqualTo(CommitStatus.STATE_FAILURE);
        assertThat(value.get("description")).isEqualTo("ref1 -- type1 -- feilmessage1, ref2 -- type2 -- feilmessage2");
        assertThat(value.get("context")).isEqualTo("polly-validation");
    }

    @Test
    void compare() throws IOException {
        RepositoryCommitCompare compare = new RepositoryCommitCompare().setFiles(asList(
                new CommitFile().setStatus("added").setFilename("addedfilename"),
                new CommitFile().setStatus("modified").setFilename("modifiedfilename"),
                new CommitFile().setStatus("removed").setFilename("removedfilename"))
        );
        lenient().when(gitHubClient.get(argThat(r -> r != null && r.getUri().contains("compare")))).thenReturn(new GitHubResponse(null, compare));
        lenient().when(gitHubClient.get(argThat(r -> r != null && r.getUri().contains("contents"))))
                .then(i -> new GitHubResponse(null, new RepositoryContents().setName(i.<GitHubRequest>getArgument(0).generateUri())));

        RepoModification modification = githubConsumer.compare("start", "end");

        assertThat(modification.size()).isEqualTo(4);
        assertThat(modification.getHead()).isEqualTo("end");
        assertThat(modification.getAdded().get(0).getName()).isEqualTo("/repos/owner/name/contents/addedfilename?ref=end");
        assertThat(modification.getModifiedAfter().get(0).getName()).isEqualTo("/repos/owner/name/contents/modifiedfilename?ref=end");
        assertThat(modification.getModifiedBefore().get(0).getName()).isEqualTo("/repos/owner/name/contents/modifiedfilename?ref=start");
        assertThat(modification.getDeleted().get(0).getName()).isEqualTo("/repos/owner/name/contents/removedfilename?ref=start");
    }

    @BeforeEach
    void mockToken() {
        GithubInstallation installation = new GithubInstallation("1", new GithubAccount(repositoryId.getOwner()));
        GithubInstallation[] installations = {installation};
        GithubInstallationToken token = new GithubInstallationToken("token");
        //Installation
        lenient().when(restTemplate.exchange(anyString(), any(HttpMethod.class), any(HttpEntity.class), eq(GithubInstallation[].class)))
                .thenReturn(new ResponseEntity<>(installations, HttpStatus.OK));
        //Token
        lenient().when(restTemplate.exchange(anyString(), any(HttpMethod.class), any(HttpEntity.class), eq(GithubInstallationToken.class)))
                .thenReturn(new ResponseEntity<>(token, HttpStatus.OK));
    }
}