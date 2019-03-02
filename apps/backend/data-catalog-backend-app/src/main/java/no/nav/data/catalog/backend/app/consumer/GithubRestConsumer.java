package no.nav.data.catalog.backend.app.consumer;

import no.nav.data.catalog.backend.app.domain.GithubFileInfo;
import no.nav.data.catalog.backend.app.domain.GithubInstallation;
import no.nav.data.catalog.backend.app.domain.GithubInstallationToken;
import no.nav.data.catalog.backend.app.domain.InstallationList;
import org.springframework.boot.autoconfigure.info.ProjectInfoProperties;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
import java.util.List;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;

@Component
public class GithubRestConsumer {
    private RestTemplate restTemplate;

    public GithubRestConsumer (RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

        public String getInstallationToken(String installationId, String jwtToken) {
        ResponseEntity responseEntity = restTemplate.exchange("https://api.github.com/app/installations/" + installationId + "/access_tokens", HttpMethod.POST, new HttpEntity<>(createBearerHeader(jwtToken)), GithubInstallationToken.class);
        GithubInstallationToken token = (GithubInstallationToken) responseEntity.getBody();
        return token.getToken();
    }

    public String getInstallationId (String jwtToken) {
        ResponseEntity responseEntity = restTemplate.exchange("https://api.github.com/app/installations", HttpMethod.GET, new HttpEntity<>(createBearerHeader(jwtToken)), GithubInstallation[].class);
        GithubInstallation[] installations = (GithubInstallation[]) responseEntity.getBody();
        String installationId = "";
        for (GithubInstallation installation:installations) {
            if ("navikt".equals(installation.getAccount().getLogin())) {
                installationId = installation.getId();
            }
        }
        return installationId;
    }

    public GithubFileInfo getFileInfo (String filename, String token) {
        ResponseEntity responseEntity = restTemplate.exchange("https://api.github.com/repos/navikt/pol-datasett/contents/" + filename, HttpMethod.GET, new HttpEntity<>(createTokenHeaders(token)), GithubFileInfo.class);
        GithubFileInfo fileInfo = (GithubFileInfo) responseEntity.getBody();
        return fileInfo;
    }

    private HttpHeaders createHttpHeaders(String user, String password)
    {
        String notEncoded = user + ":" + password;
        String encodedAuth = Base64.getEncoder().encodeToString(notEncoded.getBytes());
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.add(HttpHeaders.AUTHORIZATION, "Basic " + encodedAuth);
        return headers;
    }

    private HttpHeaders createTokenHeaders(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.AUTHORIZATION, "Token " + token);
        return headers;
    }

    private static HttpHeaders createBearerHeader(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.add ("accept", "application/vnd.github.machine-man-preview+json");
        headers.add(AUTHORIZATION, "Bearer " + token);
        return headers;
    }

}
