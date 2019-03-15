package no.nav.data.catalog.backend.test.component;

import no.nav.data.catalog.backend.app.common.tokensupport.JwtTokenGenerator;
import no.nav.data.catalog.backend.app.consumer.GithubRestConsumer;
import no.nav.data.catalog.backend.app.domain.GithubAccount;
import no.nav.data.catalog.backend.app.domain.GithubFileInfo;
import no.nav.data.catalog.backend.app.domain.GithubInstallation;
import no.nav.data.catalog.backend.app.domain.GithubInstallationToken;
import org.hamcrest.MatcherAssert;
import org.hamcrest.Matchers;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class GithubRestConsumerTest {

    private RestTemplate restTemplate = mock(RestTemplate.class);

    private GithubRestConsumer githubRestConsumer = new GithubRestConsumer(restTemplate);

    @Test
    public void getFileInfo() {
        GithubFileInfo inputFileInfo = new GithubFileInfo("filename.json", "filpath", "sha", 1L, "url", "html_url", "git_url", "download_url", "file", "content", "encoding");

        when(restTemplate.exchange(anyString(), any(HttpMethod.class), any(HttpEntity.class), eq(GithubFileInfo.class))).thenReturn(new ResponseEntity<>(inputFileInfo, HttpStatus.OK));
        GithubFileInfo fileInfo = githubRestConsumer.getFileInfo("filename.json", "dummy token");
        MatcherAssert.assertThat(fileInfo.getName(), Matchers.is("filename.json"));
    }

    @Test
    public void getInstallationId() {
        GithubAccount account = new GithubAccount("navikt");
        GithubInstallation installation = new GithubInstallation("MyInstallationId", account);
        GithubInstallation[] installationArray = new GithubInstallation[1];
        installationArray[0] = installation;
        when(restTemplate.exchange(anyString(), any(HttpMethod.class), any(HttpEntity.class), eq(GithubInstallation[].class))).thenReturn(new ResponseEntity<>(installationArray, HttpStatus.OK));
        String installationId = githubRestConsumer.getInstallationId("my token");
        MatcherAssert.assertThat(installationId, Matchers.is("MyInstallationId"));
    }

    @Test
    public void getInstallationToken() {
        GithubInstallationToken token = new GithubInstallationToken("MyInstallatonToken");
        when(restTemplate.exchange(anyString(), any(HttpMethod.class), any(HttpEntity.class), eq(GithubInstallationToken.class))).thenReturn(new ResponseEntity<>(token, HttpStatus.OK));
        String installationToken = githubRestConsumer.getInstallationToken("installationId", "JwtToken");
        MatcherAssert.assertThat(installationToken, Matchers.is("MyInstallatonToken"));
    }

}