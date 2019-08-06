package no.nav.data.catalog.backend.test.integration.codelist;

import static no.nav.data.catalog.backend.app.codelist.CodelistService.codelists;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThat;

import no.nav.data.catalog.backend.app.AppStarter;
import no.nav.data.catalog.backend.app.codelist.Codelist;
import no.nav.data.catalog.backend.app.codelist.CodelistRepository;
import no.nav.data.catalog.backend.app.codelist.CodelistRequest;
import no.nav.data.catalog.backend.app.codelist.CodelistService;
import no.nav.data.catalog.backend.app.codelist.ListName;
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
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
		classes = {IntegrationTestConfig.class, AppStarter.class})
@ActiveProfiles("itest")
@ContextConfiguration(initializers = {CodelistControllerIT.Initializer.class})
public class CodelistControllerIT {

	@Autowired
	protected TestRestTemplate restTemplate;

	@Autowired
	private CodelistService service;

	@Autowired
	private CodelistRepository repository;

	@ClassRule
	public static PostgreSQLContainer postgreSQLContainer =
			(PostgreSQLContainer) new PostgreSQLContainer("postgres:10.4")
					.withDatabaseName("sampledb")
					.withUsername("sampleuser")
					.withPassword("samplepwd")
					.withStartupTimeout(Duration.ofSeconds(600));

	@Before
	public void setUp() {
		service.refreshCache();
		codelists.get(ListName.PRODUCER).put("TEST_CODE", "Test description");
	}

	@After
	public void cleanUp() {
		codelists.clear();
		repository.deleteAll();
	}

	@Test
	public void findAll_shouldReturnOneCodelists() {
		ResponseEntity<Map> responseEntity = restTemplate.exchange(
				"/backend/codelist", HttpMethod.GET, HttpEntity.EMPTY, Map.class);

		assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
		assertThat(responseEntity.getBody().size(), is(4));

		Arrays.stream(ListName.values())
				.forEach(listName -> assertThat(responseEntity.getBody()
						.get(listName.toString()), is(codelists.get(listName))));
	}

	@Test
	public void getCodelistByListName_shouldReturnCodesAndDescriptionForListName() {
		String url = "/backend/codelist/PRODUCER";

		ResponseEntity<Map> responseEntity = restTemplate.exchange(
				url, HttpMethod.GET, HttpEntity.EMPTY, Map.class);

		assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
		assertThat(responseEntity.getBody(), is(codelists.get(ListName.PRODUCER)));
	}

	@Test
	public void getDescriptionByListNameAndCode_shouldReturnDescriptionForCodeAndListName() {
		String url = "/backend/codelist/PRODUCER/TEST_CODE";

		ResponseEntity<String> responseEntity = restTemplate.exchange(
				url, HttpMethod.GET, HttpEntity.EMPTY, String.class);

		assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
		assertThat(responseEntity.getBody(), is(codelists.get(ListName.PRODUCER).get("TEST_CODE")));
	}

	@Test
	public void save_shouldSaveNewCodelist() {
		String code = "SAVE_CODE";
		List<CodelistRequest> requests = createRequest(ListName.PRODUCER, code, "Test description");
		assertNull(codelists.get(ListName.PRODUCER).get(code));

		ResponseEntity<List<Codelist>> responseEntity = restTemplate.exchange(
				"/backend/codelist", HttpMethod.POST, new HttpEntity<>(requests), new ParameterizedTypeReference<List<Codelist>>() {
				});

		assertThat(responseEntity.getStatusCode(), is(HttpStatus.CREATED));
		assertFalse(codelists.get(ListName.PRODUCER).get(code).isEmpty());
		assertThat(responseEntity.getBody().get(0).getDescription(), is(codelists.get(ListName.PRODUCER).get(code)));
	}

	@Test
	public void save_shouldSave20Codelist() {
		List<CodelistRequest> requests = createNrOfRequests("shouldSave20Codelists", 20);

		ResponseEntity<List<Codelist>> responseEntity = restTemplate.exchange(
				"/backend/codelist", HttpMethod.POST, new HttpEntity<>(requests), new ParameterizedTypeReference<List<Codelist>>() {
				});

		assertThat(responseEntity.getStatusCode(), is(HttpStatus.CREATED));
		assertThat(codelists.get(ListName.SYSTEM).size(), is(20));
	}

	@Test
	public void update_shouldUpdateOneCodelist() {
		String code = "UPDATE_CODE";
		service.save(createRequest(ListName.PRODUCER, code, "Test description"));

		List<CodelistRequest> updatedCodelists = createRequest(ListName.PRODUCER, code, "Updated codelists");

		ResponseEntity<String> responseEntity = restTemplate.exchange(
				"/backend/codelist", HttpMethod.PUT, new HttpEntity<>(updatedCodelists), String.class);

		assertThat(responseEntity.getStatusCode(), is(HttpStatus.ACCEPTED));
		assertThat(codelists.get(ListName.PRODUCER).get(code), is(updatedCodelists.get(0).getDescription()));
	}

	@Test
	public void update_shouldUpdate20Codelists() {
		List<CodelistRequest> requests = createNrOfRequests("shouldUpdate20Codelists", 20);
		restTemplate.exchange(
				"/backend/codelist", HttpMethod.POST, new HttpEntity<>(requests), new ParameterizedTypeReference<List<Codelist>>() {
				});

		requests.forEach(request -> request.setDescription("  Updated codelists  "));
		ResponseEntity<List<Codelist>> responseEntity = restTemplate.exchange(
				"/backend/codelist", HttpMethod.PUT, new HttpEntity<>(requests), new ParameterizedTypeReference<List<Codelist>>() {
				});

		assertThat(responseEntity.getStatusCode(), is(HttpStatus.ACCEPTED));
		assertThat(codelists.get(ListName.SYSTEM).size(), is(20));
		codelists.get(ListName.SYSTEM);
		Collection<String> descriptionList = codelists.get(ListName.SYSTEM).values();
		descriptionList.forEach(description -> assertThat(description, is("Updated codelists")));
	}


	@Test
	public void delete_shouldDeleteCodelist() {
		String code = "DELETE_CODE";
		List<CodelistRequest> requests = createRequest(ListName.PRODUCER, code, "Test description");
		service.save(requests);
		assertNotNull(codelists.get(ListName.PRODUCER).get(code));

		String url = "/backend/codelist/PRODUCER/DELETE_CODE";

		ResponseEntity<String> responseEntity = restTemplate.exchange(url, HttpMethod.DELETE, HttpEntity.EMPTY, String.class);

		assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
		assertNull(codelists.get(ListName.PRODUCER).get(code));
	}

	private List<CodelistRequest> createNrOfRequests(String code, int nrOfRequests) {
		return IntStream.rangeClosed(1, nrOfRequests)
				.mapToObj(i -> createOneRequest(ListName.SYSTEM, code + "_nr_" + i, "Test description"))
				.collect(Collectors.toList());

	}

	private CodelistRequest createOneRequest(ListName listName, String code, String description) {
		return CodelistRequest.builder()
				.list(listName)
				.code(code)
				.description(description)
				.build();
	}

	private List<CodelistRequest> createRequest(ListName listName, String code, String description) {
		return List.of(createOneRequest(listName, code, description));
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
