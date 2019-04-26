package no.nav.data.catalog.backend.test.integration;

import no.nav.data.catalog.backend.app.AppStarter;
import no.nav.data.catalog.backend.app.github.domain.GithubCommitInfo;
import no.nav.data.catalog.backend.app.github.domain.GithubPushEventPayloadRequest;
import no.nav.data.catalog.backend.app.informationtype.InformationTypeRepository;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.cloud.contract.wiremock.AutoConfigureWireMock;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Arrays;

import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;


@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        classes = {IntegrationTestConfig.class, AppStarter.class})
@ActiveProfiles("test")
@AutoConfigureWireMock(port = 0)
public class GithubWebhooksControllerIT {

    @Autowired
    protected TestRestTemplate restTemplate;

    @Autowired
    protected InformationTypeRepository repository;

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    @Before
    public void setUp() {
        repository.deleteAll();
    }

    @Test
    public void retriveAndSaveSingleDataset() throws Exception {
        assertThat(repository.findAll().size(), is(0));

        GithubCommitInfo commitInfo = new GithubCommitInfo(Arrays.asList("testdataIkkeSlett/singleRow.json"), null, null);
        GithubPushEventPayloadRequest request = new GithubPushEventPayloadRequest(Arrays.asList(commitInfo));
        ResponseEntity<String> responseEntity = restTemplate.exchange(
                "/backend/webhooks", HttpMethod.POST, new HttpEntity<>(request), String.class);

        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(repository.findAll().size(), is(1));
    }

    @Test
    public void retriveAndSaveMultipleDataset() {
        assertThat(repository.findAll().size(), is(0));

        GithubCommitInfo commitInfo = new GithubCommitInfo(Arrays.asList("testdataIkkeSlett/multipleRows.json"), null, null);
        GithubPushEventPayloadRequest request = new GithubPushEventPayloadRequest(Arrays.asList(commitInfo));
        ResponseEntity<String> responseEntity = restTemplate.exchange(
                "/backend/webhooks", HttpMethod.POST, new HttpEntity<>(request), String.class);

        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(repository.findAll().size(), is(6));
    }

    @Test
    public void retriveInvalidFile() {
        GithubCommitInfo commitInfo = new GithubCommitInfo(Arrays.asList("testdataIkkeSlett/invalidFile.json"), null, null);
        GithubPushEventPayloadRequest request = new GithubPushEventPayloadRequest(Arrays.asList(commitInfo));
        ResponseEntity<String> responseEntity = restTemplate.exchange(
                "/backend/webhooks", HttpMethod.POST, new HttpEntity<>(request), String.class);
        assertThat(responseEntity.getStatusCode(), is (HttpStatus.INTERNAL_SERVER_ERROR));
        assertThat(responseEntity.getBody(), containsString ("Validation errors occured when validating input file from Github"));
    }

    @Test
    public void retriveNotExistingFile() {
        GithubCommitInfo commitInfo = new GithubCommitInfo(Arrays.asList("testdataIkkeSlett/notExisting.json"), null, null);
        GithubPushEventPayloadRequest request = new GithubPushEventPayloadRequest(Arrays.asList(commitInfo));
        ResponseEntity<String> responseEntity = restTemplate.exchange(
                "/backend/webhooks", HttpMethod.POST, new HttpEntity<>(request), String.class);
        assertThat(responseEntity.getStatusCode(), is (HttpStatus.NOT_FOUND));
        assertThat(responseEntity.getBody(), containsString ("Calling Github to download file failed with status=404 NOT_FOUND. The file does not exist"));
    }
}
