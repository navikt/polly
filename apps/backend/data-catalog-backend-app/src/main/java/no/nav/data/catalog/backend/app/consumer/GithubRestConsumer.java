package no.nav.data.catalog.backend.app.consumer;

import no.nav.data.catalog.backend.app.common.exceptions.DataCatalogBackendTechnicalException;
import no.nav.data.catalog.backend.app.domain.GithubFileInfo;
import no.nav.data.catalog.backend.app.domain.GithubInstallation;
import no.nav.data.catalog.backend.app.domain.GithubInstallationToken;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import static no.nav.data.catalog.backend.app.common.utils.ConverterUtils.convertJsonStringToJsonObject;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;

@Component
public class GithubRestConsumer {
    private RestTemplate restTemplate;

    public GithubRestConsumer(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String getInstallationToken(String installationId, String jwtToken) {
        try {
            ResponseEntity responseEntity = restTemplate.exchange("https://api.github.com/app/installations/" + installationId + "/access_tokens", HttpMethod.POST, new HttpEntity<>(createBearerHeader(jwtToken)), GithubInstallationToken.class);
            GithubInstallationToken token = (GithubInstallationToken) responseEntity.getBody();
            return token.getToken();
        } catch (
                HttpClientErrorException e) {
            throw new DataCatalogBackendTechnicalException(String.format("Calling Github to get installation token failed with status=%s message=%s", e.getStatusCode(), convertJsonStringToJsonObject(e.getResponseBodyAsString())), e, e.getStatusCode());
        } catch (
                HttpServerErrorException e) {
            throw new DataCatalogBackendTechnicalException(String.format("Service getting Github installation token failed with status=%s message=%s", e.getStatusCode(), convertJsonStringToJsonObject(e.getResponseBodyAsString())), e, e.getStatusCode());
        }
    }

    public String getInstallationId(String jwtToken) {
        try {
            ResponseEntity responseEntity = restTemplate.exchange("https://api.github.com/app/installations", HttpMethod.GET, new HttpEntity<>(createBearerHeader(jwtToken)), GithubInstallation[].class);
            GithubInstallation[] installations = (GithubInstallation[]) responseEntity.getBody();
            String installationId = "";
            for (GithubInstallation installation : installations) {
                if ("navikt".equals(installation.getAccount().getLogin())) {
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

    public GithubFileInfo getFileInfo(String filename, String token) {
        try {
            ResponseEntity responseEntity = restTemplate.exchange("https://api.github.com/repos/navikt/pol-datasett/contents/" + filename, HttpMethod.GET, new HttpEntity<>(new HttpHeaders()), GithubFileInfo.class);
            GithubFileInfo fileInfo = (GithubFileInfo) responseEntity.getBody();
            return fileInfo;
        } catch (
                HttpClientErrorException e) {
            throw new DataCatalogBackendTechnicalException(String.format("Calling Github to download file failed with status=%s message=%s", e.getStatusCode(), convertJsonStringToJsonObject(e.getResponseBodyAsString())), e, e.getStatusCode());
        } catch (
                HttpServerErrorException e) {
            throw new DataCatalogBackendTechnicalException(String.format("Service getting file from Github failed with status=%s message=%s", e.getStatusCode(), convertJsonStringToJsonObject(e.getResponseBodyAsString())), e, e.getStatusCode());
        }
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
