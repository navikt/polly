package no.nav.data.catalog.backend.test.component;

import no.nav.data.catalog.backend.app.common.exceptions.DataCatalogBackendTechnicalException;
import no.nav.data.catalog.backend.app.common.exceptions.InformationTypeNotFoundException;
import no.nav.data.catalog.backend.app.common.tokensupport.JwtTokenGenerator;
import no.nav.data.catalog.backend.app.github.GithubConsumer;
import no.nav.data.catalog.backend.app.github.domain.GithubAccount;
import no.nav.data.catalog.backend.app.github.domain.GithubFile;
import no.nav.data.catalog.backend.app.github.domain.GithubInstallation;
import no.nav.data.catalog.backend.app.github.domain.GithubInstallationToken;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
@ActiveProfiles("test")
public class GithubConsumerTest {

    @MockBean
    private RestTemplate restTemplate = mock(RestTemplate.class);

    @MockBean
    private JwtTokenGenerator jwtTokenGenerator = mock(JwtTokenGenerator.class);

    @InjectMocks
    private GithubConsumer githubConsumer;

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    @Test
    public void getFileInfo() {
        GithubFile inputFileInfo = new GithubFile("filename.json", "filpath", "sha", 1L, "url", "html_url", "git_url", "download_url", "file", "content", "encoding");
        GithubInstallation installation = new GithubInstallation("1", new GithubAccount("navikt"));
        GithubInstallation[] installations = {installation};
        GithubInstallationToken token = new GithubInstallationToken("token");
        //FileInformation
        when(restTemplate.exchange(anyString(), any(HttpMethod.class), any(HttpEntity.class), eq(GithubFile.class))).thenReturn(new ResponseEntity<>(inputFileInfo, HttpStatus.OK));
        //Installation
        when(restTemplate.exchange(anyString(), any(HttpMethod.class), any(HttpEntity.class), eq(GithubInstallation[].class))).thenReturn(new ResponseEntity<>(installations, HttpStatus.OK));
        //Token
        when(restTemplate.exchange(anyString(), any(HttpMethod.class), any(HttpEntity.class), eq(GithubInstallationToken.class))).thenReturn(new ResponseEntity<>(token, HttpStatus.OK));

        GithubFile fileInfo = githubConsumer.getFile("filename.json");
        assertThat(fileInfo.getContent(), is("content"));
        assertThat(fileInfo.getName(), is("filename.json"));
    }

    @Test
    public void getNotExistingFile() {
        expectedException.expect(InformationTypeNotFoundException.class);
        expectedException.expectMessage("The file does not exist");

        GithubInstallation installation = new GithubInstallation("1", new GithubAccount("navikt"));
        GithubInstallation[] installations = {installation};
        GithubInstallationToken token = new GithubInstallationToken("token");
        when(restTemplate.exchange(anyString(), any(HttpMethod.class), any(HttpEntity.class), eq(GithubFile.class))).thenThrow(new HttpClientErrorException(HttpStatus.NOT_FOUND));
        //Installation
        when(restTemplate.exchange(anyString(), any(HttpMethod.class), any(HttpEntity.class), eq(GithubInstallation[].class))).thenReturn(new ResponseEntity<>(installations, HttpStatus.OK));
        //Token
        when(restTemplate.exchange(anyString(), any(HttpMethod.class), any(HttpEntity.class), eq(GithubInstallationToken.class))).thenReturn(new ResponseEntity<>(token, HttpStatus.OK));

        githubConsumer.getFile("notExisting.json");
    }

    @Test
    public void throwClientError() {
        expectedException.expect(DataCatalogBackendTechnicalException.class);
        expectedException.expectMessage("Calling Github to download file failed with status=" + HttpStatus.INTERNAL_SERVER_ERROR);

        GithubInstallation installation = new GithubInstallation("1", new GithubAccount("navikt"));
        GithubInstallation[] installations = {installation};
        GithubInstallationToken token = new GithubInstallationToken("token");
        when(restTemplate.exchange(anyString(), any(HttpMethod.class), any(HttpEntity.class), eq(GithubFile.class))).thenThrow(new HttpClientErrorException(HttpStatus.INTERNAL_SERVER_ERROR));
        //Installation
        when(restTemplate.exchange(anyString(), any(HttpMethod.class), any(HttpEntity.class), eq(GithubInstallation[].class))).thenReturn(new ResponseEntity<>(installations, HttpStatus.OK));
        //Token
        when(restTemplate.exchange(anyString(), any(HttpMethod.class), any(HttpEntity.class), eq(GithubInstallationToken.class))).thenReturn(new ResponseEntity<>(token, HttpStatus.OK));

        githubConsumer.getFile("notExisting.json");
    }


    @Test
    public void throwServerError() {
        expectedException.expect(DataCatalogBackendTechnicalException.class);
        expectedException.expectMessage("Service getting file from Github failed with status=" + HttpStatus.INTERNAL_SERVER_ERROR);

        GithubInstallation installation = new GithubInstallation("1", new GithubAccount("navikt"));
        GithubInstallation[] installations = {installation};
        GithubInstallationToken token = new GithubInstallationToken("token");
        when(restTemplate.exchange(anyString(), any(HttpMethod.class), any(HttpEntity.class), eq(GithubFile.class))).thenThrow(new HttpServerErrorException(HttpStatus.INTERNAL_SERVER_ERROR));
        //Installation
        when(restTemplate.exchange(anyString(), any(HttpMethod.class), any(HttpEntity.class), eq(GithubInstallation[].class))).thenReturn(new ResponseEntity<>(installations, HttpStatus.OK));
        //Token
        when(restTemplate.exchange(anyString(), any(HttpMethod.class), any(HttpEntity.class), eq(GithubInstallationToken.class))).thenReturn(new ResponseEntity<>(token, HttpStatus.OK));

        githubConsumer.getFile("notExisting.json");
    }
}