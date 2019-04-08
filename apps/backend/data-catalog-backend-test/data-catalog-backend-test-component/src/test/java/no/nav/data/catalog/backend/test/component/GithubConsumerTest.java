package no.nav.data.catalog.backend.test.component;

import no.nav.data.catalog.backend.app.github.GithubConsumer;
import no.nav.data.catalog.backend.app.github.domain.GithubAccount;
import no.nav.data.catalog.backend.app.github.domain.GithubFile;
import no.nav.data.catalog.backend.app.github.domain.GithubInstallation;
import no.nav.data.catalog.backend.app.github.domain.GithubInstallationToken;
import org.hamcrest.MatcherAssert;
import org.hamcrest.Matchers;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class GithubConsumerTest {

    @MockBean
    private RestTemplate restTemplate = mock(RestTemplate.class);

    @InjectMocks
    private GithubConsumer githubConsumer;

    @Test
    public void getFileInfo() {
        GithubFile inputFileInfo = new GithubFile("filename.json", "filpath", "sha", 1L, "url", "html_url", "git_url", "download_url", "file", "content", "encoding");

        when(restTemplate.exchange(anyString(), any(HttpMethod.class), any(HttpEntity.class), eq(GithubFile.class))).thenReturn(new ResponseEntity<>(inputFileInfo, HttpStatus.OK));
        GithubFile fileInfo = githubConsumer.getFile("filename.json");
        MatcherAssert.assertThat(fileInfo.getName(), Matchers.is("filename.json"));
    }

}