package no.nav.data.catalog.backend.test.integration.github;

import no.nav.data.catalog.backend.app.AppStarter;
import no.nav.data.catalog.backend.app.codelist.CodelistService;
import no.nav.data.catalog.backend.app.codelist.ListName;
import no.nav.data.catalog.backend.app.github.domain.GithubCommitInfo;
import no.nav.data.catalog.backend.app.github.domain.GithubPushEventPayloadRequest;
import no.nav.data.catalog.backend.app.informationtype.InformationTypeRepository;
import no.nav.data.catalog.backend.test.integration.IntegrationTestConfig;
import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Ignore;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.util.TestPropertyValues;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.cloud.contract.wiremock.AutoConfigureWireMock;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.testcontainers.containers.PostgreSQLContainer;

import java.time.Duration;
import java.util.Arrays;
import java.util.HashMap;

import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;


@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        classes = {IntegrationTestConfig.class, AppStarter.class})
@ActiveProfiles("itest")
@ContextConfiguration(initializers = {GithubWebhooksControllerIT.Initializer.class})
public class GithubWebhooksControllerIT {

    @Autowired
    protected TestRestTemplate restTemplate;

    @Autowired
    protected InformationTypeRepository repository;

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    @Autowired
    protected CodelistService codelistService;

    private static HashMap<ListName, HashMap<String, String>> codelists;

    @ClassRule
    public static PostgreSQLContainer postgreSQLContainer =
            (PostgreSQLContainer) new PostgreSQLContainer("postgres:10.4")
                    .withDatabaseName("sampledb")
                    .withUsername("sampleuser")
                    .withPassword("samplepwd")
                    .withStartupTimeout(Duration.ofSeconds(600));

    @Before
    public void setUp() {
        repository.deleteAll();
        intializeCodelists();
    }

    private void intializeCodelists() {
		codelists = CodelistService.codelists;
        codelists.get(ListName.CATEGORY).put("PERSONALIA", "Personalia");
        codelists.get(ListName.CATEGORY).put("INNTEKT_YTELSER", "Inntekt, trygde- og pensjonsytelser");
        codelists.get(ListName.PRODUCER).put("SKATTEETATEN", "Skatteetaten");
		codelists.get(ListName.PRODUCER).put("BRUKER", "Bruker");
        codelists.get(ListName.PRODUCER).put("UTLENDINGSDIREKTORATET", "Utlendingsdirektoratet");
        codelists.get(ListName.SYSTEM).put("TPS", "Tjenestebasert PersondataSystem");
        codelists.get(ListName.SYSTEM).put("PESYS", "Pensjonssystem");
        codelists.get(ListName.SYSTEM).put("INFOTRYGD", "System for saksbehandling av ytelser og trygd");
        codelists.get(ListName.SYSTEM).put("INST", "Institusjonsopphold");
        codelists.get(ListName.SYSTEM).put("ARENA", "Arbeidsrelatert saksbehandlingsystem");
    }

	@Test
	public void retriveAndSaveSingleDataset() {
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
		assertThat(responseEntity.getStatusCode(), is(HttpStatus.BAD_REQUEST));
		assertThat(responseEntity.getBody(), containsString(
				"The request was not accepted. The following errors occurred during validation:  " +
						"{Request:1={systemCode=The systemCode was null or empty, personalData=PersonalData cannot be null, producerCode=The list of producerCodes was null or empty}}"));
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

    static class Initializer
            implements ApplicationContextInitializer<ConfigurableApplicationContext> {
        public void initialize(ConfigurableApplicationContext configurableApplicationContext) {
            TestPropertyValues.of(
                    "spring.datasource.url=" + postgreSQLContainer.getJdbcUrl(),
                    "spring.datasource.username=" + postgreSQLContainer.getUsername(),
                    "spring.datasource.password=" + postgreSQLContainer.getPassword()
            ).applyTo(configurableApplicationContext.getEnvironment());
        }
    }
}
