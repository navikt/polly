package no.nav.data.catalog.backend.app.consumer;

import no.nav.data.catalog.backend.app.domain.GithubFileInfo;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;

@Component
public class GithubRestConsumer {
    private RestTemplate restTemplate;

    public GithubRestConsumer (RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public GithubFileInfo getFileInfo (String filename) {
        String username = "kfenne";
        String password = "Må erstattes med appliacationToken";
        ResponseEntity responseEntity = restTemplate.exchange("https://api.github.com/repos/navikt/pol-datasett/contents/" + filename, HttpMethod.GET, new HttpEntity<>(createHttpHeaders(username, password)), GithubFileInfo.class);
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
}
