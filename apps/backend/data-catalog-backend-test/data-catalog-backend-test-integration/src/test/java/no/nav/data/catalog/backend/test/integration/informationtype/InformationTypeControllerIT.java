package no.nav.data.catalog.backend.test.integration.informationtype;

import static no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus.TO_BE_DELETED;
import static no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus.TO_BE_UPDATED;
import static no.nav.data.catalog.backend.test.integration.informationtype.TestdataInformationTypes.CATEGORY;
import static no.nav.data.catalog.backend.test.integration.informationtype.TestdataInformationTypes.CATEGORY_DESCRIPTION;
import static no.nav.data.catalog.backend.test.integration.informationtype.TestdataInformationTypes.DESCRIPTION;
import static no.nav.data.catalog.backend.test.integration.informationtype.TestdataInformationTypes.NAME;
import static no.nav.data.catalog.backend.test.integration.informationtype.TestdataInformationTypes.PRODUCER;
import static no.nav.data.catalog.backend.test.integration.informationtype.TestdataInformationTypes.PRODUCER_DESCRIPTION;
import static no.nav.data.catalog.backend.test.integration.informationtype.TestdataInformationTypes.SYSTEM;
import static no.nav.data.catalog.backend.test.integration.informationtype.TestdataInformationTypes.SYSTEM_DESCRIPTION;
import static no.nav.data.catalog.backend.test.integration.informationtype.TestdataInformationTypes.URL;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

import no.nav.data.catalog.backend.app.AppStarter;
import no.nav.data.catalog.backend.app.codelist.CodelistService;
import no.nav.data.catalog.backend.app.codelist.ListName;
import no.nav.data.catalog.backend.app.informationtype.InformationType;
import no.nav.data.catalog.backend.app.informationtype.InformationTypeRepository;
import no.nav.data.catalog.backend.app.informationtype.InformationTypeRequest;
import no.nav.data.catalog.backend.app.informationtype.InformationTypeResponse;
import no.nav.data.catalog.backend.app.informationtype.InformationTypeResponseEntity;
import no.nav.data.catalog.backend.test.component.elasticsearch.FixedElasticsearchContainer;
import no.nav.data.catalog.backend.test.integration.IntegrationTestConfig;
import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Test;
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
import java.util.HashMap;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
		classes = {IntegrationTestConfig.class, AppStarter.class})
@ActiveProfiles("itest")
@AutoConfigureWireMock(port = 0)
@ContextConfiguration(initializers = {InformationTypeControllerIT.Initializer.class})
public class InformationTypeControllerIT {

	@Autowired
	protected TestRestTemplate restTemplate;

	@Autowired
	protected InformationTypeRepository repository;

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

	@ClassRule
	public static FixedElasticsearchContainer container = new FixedElasticsearchContainer("docker.elastic.co/elasticsearch/elasticsearch-oss:6.4.1");

	@Before
	public void init() {
		repository.deleteAll();
		initializeCodelists();
	}

	private void initializeCodelists() {
		codelists = codelistService.codelists;
		codelists.get(ListName.CATEGORY).put(CATEGORY, CATEGORY_DESCRIPTION);
		codelists.get(ListName.PRODUCER).put(PRODUCER, PRODUCER_DESCRIPTION);
		codelists.get(ListName.SYSTEM).put(SYSTEM, SYSTEM_DESCRIPTION);
	}

	@Test
	public void getInformationTypeById() {
//		String name = "getInformationTypeById";
		InformationType informationType = saveAnInformationType(createRequest());

		ResponseEntity<InformationTypeResponse> responseEntity = restTemplate.exchange(
				URL + "/" + informationType.getId(), HttpMethod.GET, HttpEntity.EMPTY, InformationTypeResponse.class);

		assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
		assertInformationTypeResponse(responseEntity.getBody());
	}

	private InformationType saveAnInformationType(InformationTypeRequest request) {
		return repository.save(new InformationType().convertFromRequest(request, false));
	}

	@Test
	public void getAllInformationTypes() {
		saveAnInformationType(createRequest("First InformationTypeName"));
		saveAnInformationType(createRequest("Second InformationTypeName"));

		ResponseEntity<InformationTypeResponseEntity> responseEntity = restTemplate.exchange(
				URL, HttpMethod.GET, HttpEntity.EMPTY, InformationTypeResponseEntity.class);

		assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
		assertThat(responseEntity.getBody().getContent().size(), is(repository.findAll().size()));
	}


	@Test
	public void createInformationType() {
		InformationTypeRequest request = createRequest();
		ResponseEntity<String> responseEntity = restTemplate.exchange(
				URL, HttpMethod.POST, new HttpEntity<>(request), String.class);
		assertThat(responseEntity.getStatusCode(), is(HttpStatus.ACCEPTED));
		assertThat(repository.findAll().size(), is(1));
		assertInformationType(repository.findByName(NAME).get());
	}

	@Test
	public void updateInformationType() {
		InformationTypeRequest request = createRequest();
		ResponseEntity<String> responseEntity = restTemplate.exchange(
				URL, HttpMethod.POST, new HttpEntity<>(request), String.class);
		assertThat(responseEntity.getStatusCode(), is(HttpStatus.ACCEPTED));
		assertThat(repository.findAll().size(), is(1));

		InformationType storedInformationType = repository.findByName(NAME).get();
		request.setDescription(DESCRIPTION + "UPDATED");
		responseEntity = restTemplate.exchange(
				URL + "/" + storedInformationType.getId(), HttpMethod.PUT, new HttpEntity<>(request), String.class);
		assertThat(responseEntity.getStatusCode(), is(HttpStatus.ACCEPTED));
		assertThat(repository.findAll().size(), is(1));
		storedInformationType = repository.findByName(NAME).get();
		assertThat(storedInformationType.getDescription(), is(DESCRIPTION + "UPDATED"));
		assertThat(storedInformationType.getElasticsearchStatus(), is(TO_BE_UPDATED));
	}

	@Test
	public void deleteInformationType() {
		InformationTypeRequest request = createRequest();
		ResponseEntity<String> responseEntity = restTemplate.exchange(
				URL, HttpMethod.POST, new HttpEntity<>(request), String.class);
		assertThat(responseEntity.getStatusCode(), is(HttpStatus.ACCEPTED));
		assertThat(repository.findAll().size(), is(1));

		InformationType storedInformationType = repository.findByName(NAME).get();
		responseEntity = restTemplate.exchange(
				URL + "/" + storedInformationType.getId(), HttpMethod.DELETE, new HttpEntity<>(request), String.class);
		assertThat(repository.findAll().size(), is(1));
		assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
		storedInformationType = repository.findByName(NAME).get();
		assertThat(storedInformationType.getElasticsearchStatus(), is(TO_BE_DELETED));
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

	private void assertInformationType(InformationType informationType) {
		assertThat(informationType.getProducer(), is(PRODUCER));
		assertThat(informationType.getSystem(), is(SYSTEM));
		assertThat(informationType.isPersonalData(), is(true));
		assertThat(informationType.getName(), is(NAME));
		assertThat(informationType.getDescription(), is(DESCRIPTION));
		assertThat(informationType.getCategory(), is(CATEGORY));
	}

	private void assertInformationTypeResponse(InformationTypeResponse response) {
		assertThat(response.getName(), equalTo(NAME));
		assertThat(response.getDescription(), equalTo(DESCRIPTION));
		assertThat(response.getCategory().get("code"), equalTo(CATEGORY));
		assertThat(response.getCategory().get("description"), equalTo(CATEGORY_DESCRIPTION));
		assertThat(response.getProducer().get("code"), equalTo(PRODUCER));
		assertThat(response.getProducer().get("description"), equalTo(PRODUCER_DESCRIPTION));
		assertThat(response.getSystem().get("code"), equalTo(SYSTEM));
		assertThat(response.getSystem().get("description"), equalTo(SYSTEM_DESCRIPTION));
	}

	private InformationTypeRequest createRequest(String name) {
		return InformationTypeRequest.builder()
				.name(name)
				.description(DESCRIPTION)
				.category(CATEGORY)
				.producer(PRODUCER)
				.system(SYSTEM)
				.personalData(true)
				.build();
	}

	private InformationTypeRequest createRequest() {
		return createRequest(NAME);
	}
}
