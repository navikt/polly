package no.nav.data.catalog.backend.app.github;

import no.nav.data.catalog.backend.app.common.exceptions.DataCatalogBackendTechnicalException;
import no.nav.data.catalog.backend.app.common.tokensupport.JwtTokenGenerator;
import no.nav.data.catalog.backend.app.github.domain.GithubFile;
import no.nav.data.catalog.backend.app.github.domain.GithubInstallation;
import no.nav.data.catalog.backend.app.github.domain.GithubInstallationToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import static no.nav.data.catalog.backend.app.common.utils.ConverterUtils.convertJsonStringToJsonObject;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;

@Component
public class GithubConsumer {

    // TODO: Make configurable URLs.

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private JwtTokenGenerator tokenGenerator;

    private static String jwtToken = null;

    public GithubFile getFile(String filename) {
        try {
            ResponseEntity responseEntity = restTemplate.exchange("https://api.github.com/repos/navikt/pol-datasett/contents/" + filename, HttpMethod.GET, new HttpEntity<>(createTokenHeaders(getInstallationToken(getInstallationId()))), GithubFile.class);
            return (GithubFile) responseEntity.getBody();
        } catch (
                HttpClientErrorException e) {
            if (HttpStatus.NOT_FOUND.equals(e.getStatusCode())) {
                throw new IllegalArgumentException(String.format("Calling Github to download file failed with status=%s. The file does not exist", HttpStatus.NOT_FOUND));
            } else {
                throw new DataCatalogBackendTechnicalException(String.format("Calling Github to download file failed with status=%s message=%s", e.getStatusCode(), convertJsonStringToJsonObject(e.getResponseBodyAsString())), e, e.getStatusCode());
            }
        } catch (
                HttpServerErrorException e) {
            throw new DataCatalogBackendTechnicalException(String.format("Service getting file from Github failed with status=%s message=%s", e.getStatusCode(), convertJsonStringToJsonObject(e.getResponseBodyAsString())), e, e.getStatusCode());
        }
    }

    private String getInstallationId() {
        try {
            ResponseEntity responseEntity = restTemplate.exchange("https://api.github.com/app/installations", HttpMethod.GET, new HttpEntity<>(createBearerHeader(getJwtToken())), GithubInstallation[].class);
            GithubInstallation[] installations = (GithubInstallation[]) responseEntity.getBody();
            String installationId = "";
            for (GithubInstallation installation : installations) {
                if ("navikt".equals(installation.getAccount().getLogin())) { // TODO: Make navikt configurable.
                    installationId = installation.getId();
                }
            }
            return installationId;
        } catch (
                HttpClientErrorException e) {
            throw new DataCatalogBackendTechnicalException(String.format("Calling Github to get installation id failed with status=%s message=%s", e.getStatusCode(), convertJsonStringToJsonObject(e.getResponseBodyAsString())), e, e.getStatusCode());
        } catch (
                HttpServerErrorException e) {
            throw new DataCatalogBackendTechnicalException(String.format("Service getting Github installation id failed with status=%s message=%s", e.getStatusCode(), convertJsonStringToJsonObject(e.getResponseBodyAsString())), e, e.getStatusCode());
        }
    }

    private String getInstallationToken(String installationId) {
        try {
            ResponseEntity responseEntity = restTemplate.exchange("https://api.github.com/app/installations/" + installationId + "/access_tokens", HttpMethod.POST, new HttpEntity<>(createBearerHeader(getJwtToken())), GithubInstallationToken.class);
            GithubInstallationToken token = (GithubInstallationToken) responseEntity.getBody();
            if (token.getToken() != null) {
                return token.getToken();
            } else {
                throw new DataCatalogBackendTechnicalException("GitHub returned null for installation token value!");
            }
        } catch (HttpClientErrorException e) {
            throw new DataCatalogBackendTechnicalException(String.format("Calling Github to get installation token failed with status=%s message=%s", e.getStatusCode(), convertJsonStringToJsonObject(e.getResponseBodyAsString())), e, e.getStatusCode());
        } catch (
                HttpServerErrorException e) {
            throw new DataCatalogBackendTechnicalException(String.format("Service getting Github installation token failed with status=%s message=%s", e.getStatusCode(), convertJsonStringToJsonObject(e.getResponseBodyAsString())), e, e.getStatusCode());
        }
    }

    private String getJwtToken() {
        if (jwtToken == null) {
            jwtToken = tokenGenerator.generateToken();
        }

        return jwtToken;
    }

    private HttpHeaders createTokenHeaders(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.AUTHORIZATION, "Token " + token);
        return headers;
    }

    private static HttpHeaders createBearerHeader(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("accept", "application/vnd.github.machine-man-preview+json");
        headers.add(AUTHORIZATION, "Bearer " + token);
        return headers;
    }

}
