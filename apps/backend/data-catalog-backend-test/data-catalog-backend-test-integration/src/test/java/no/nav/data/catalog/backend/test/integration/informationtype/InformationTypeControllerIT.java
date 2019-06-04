package no.nav.data.catalog.backend.test.integration.informationtype;

import static no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus.TO_BE_DELETED;
import static no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus.TO_BE_UPDATED;
import static no.nav.data.catalog.backend.test.integration.informationtype.TestdataInformationTypes.CATEGORY_CODE;
import static no.nav.data.catalog.backend.test.integration.informationtype.TestdataInformationTypes.CATEGORY_DESCRIPTION;
import static no.nav.data.catalog.backend.test.integration.informationtype.TestdataInformationTypes.DESCRIPTION;
import static no.nav.data.catalog.backend.test.integration.informationtype.TestdataInformationTypes.NAME;
import static no.nav.data.catalog.backend.test.integration.informationtype.TestdataInformationTypes.PRODUCER_CODE;
import static no.nav.data.catalog.backend.test.integration.informationtype.TestdataInformationTypes.PRODUCER_DESCRIPTION;
import static no.nav.data.catalog.backend.test.integration.informationtype.TestdataInformationTypes.SYSTEM_CODE;
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
import no.nav.data.catalog.backend.test.component.elasticsearch.FixedElasticsearchContainer;
import no.nav.data.catalog.backend.test.integration.IntegrationTestConfig;
import org.junit.After;
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
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.hateoas.PagedResources;
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
	private ParameterizedTypeReference<PagedResources<InformationTypeResponse>> responseType = new ParameterizedTypeReference<PagedResources<InformationTypeResponse>>() {
	};

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
	public void setUp() {
		repository.deleteAll();
		initializeCodelists();
	}

	@After
	public void cleanUp() {
		repository.deleteAll();
	}

	private void initializeCodelists() {
		codelists = CodelistService.codelists;
		codelists.get(ListName.CATEGORY).put(CATEGORY_CODE, CATEGORY_DESCRIPTION);
		codelists.get(ListName.PRODUCER).put(PRODUCER_CODE, PRODUCER_DESCRIPTION);
		codelists.get(ListName.SYSTEM).put(SYSTEM_CODE, SYSTEM_DESCRIPTION);
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

		ResponseEntity<PagedResources<InformationTypeResponse>> responseEntity = restTemplate.exchange(
				URL, HttpMethod.GET, HttpEntity.EMPTY, new ParameterizedTypeReference<>() {
				});

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
		assertThat(responseEntity.getStatusCode(), is(HttpStatus.ACCEPTED));
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
		assertThat(informationType.getProducerCode(), is(PRODUCER_CODE));
		assertThat(informationType.getSystemCode(), is(SYSTEM_CODE));
		assertThat(informationType.isPersonalData(), is(true));
		assertThat(informationType.getName(), is(NAME));
		assertThat(informationType.getDescription(), is(DESCRIPTION));
		assertThat(informationType.getCategoryCode(), is(CATEGORY_CODE));
	}

	private void assertInformationTypeResponse(InformationTypeResponse response) {
		assertThat(response.getName(), equalTo(NAME));
		assertThat(response.getDescription(), equalTo(DESCRIPTION));
		assertThat(response.getCategory().get("code"), equalTo(CATEGORY_CODE));
		assertThat(response.getCategory().get("description"), equalTo(CATEGORY_DESCRIPTION));
		assertThat(response.getProducer().get("code"), equalTo(PRODUCER_CODE));
		assertThat(response.getProducer().get("description"), equalTo(PRODUCER_DESCRIPTION));
		assertThat(response.getSystem().get("code"), equalTo(SYSTEM_CODE));
		assertThat(response.getSystem().get("description"), equalTo(SYSTEM_DESCRIPTION));
	}

	private InformationTypeRequest createRequest(String name) {
		return InformationTypeRequest.builder()
				.name(name)
				.description(DESCRIPTION)
				.categoryCode(CATEGORY_CODE)
				.producerCode(PRODUCER_CODE)
				.systemCode(SYSTEM_CODE)
				.personalData(true)
				.build();
	}

	private InformationTypeRequest createRequest() {
		return createRequest(NAME);
	}
}
