package no.nav.data.catalog.backend.test.integration.codelist;

import static no.nav.data.catalog.backend.app.codelist.CodelistService.codelists;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;

import no.nav.data.catalog.backend.app.AppStarter;
import no.nav.data.catalog.backend.app.codelist.CodelistRequest;
import no.nav.data.catalog.backend.app.codelist.CodelistService;
import no.nav.data.catalog.backend.app.codelist.ListName;
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
import java.util.Arrays;
import java.util.Map;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
		classes = {IntegrationTestConfig.class, AppStarter.class})
@ActiveProfiles("itest")
@AutoConfigureWireMock(port = 0)
@ContextConfiguration(initializers = {CodelistControllerIT.Initializer.class})
public class CodelistControllerIT extends TestdataCodelists {

	@Autowired
	protected TestRestTemplate restTemplate;

	@Autowired
	private CodelistService service;

	@ClassRule
	public static PostgreSQLContainer postgreSQLContainer =
			(PostgreSQLContainer) new PostgreSQLContainer("postgres:10.4")
					.withDatabaseName("sampledb")
					.withUsername("sampleuser")
					.withPassword("samplepwd")
					.withStartupTimeout(Duration.ofSeconds(600));

	@Before
	public void initCodelists() {
		codelists.get(LIST).put(CODE, DESCRIPTION);
	}

	@Test
	public void findAll_shouldReturnCodelists() {
		ResponseEntity<Map> responseEntity = restTemplate.exchange(
				URL, HttpMethod.GET, HttpEntity.EMPTY, Map.class);

		assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
		assertThat(responseEntity.getBody().size(), is(3));

		Arrays.stream(ListName.values())
				.forEach(listName -> assertThat(responseEntity.getBody()
						.get(listName.toString()), is(codelists.get(listName))));
	}

	@Test
	public void getCodelistByListName_shouldReturnCodesAndDescriptionForListName() {
		String url = URL + "/" + LIST;

		ResponseEntity<Map> responseEntity = restTemplate.exchange(
				url, HttpMethod.GET, HttpEntity.EMPTY, Map.class);

		assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
		assertThat(responseEntity.getBody(), is(codelists.get(LIST)));
	}

	@Test
	public void getDescriptionByListNameAndCode_shouldReturnDescriptionForCodeAndListName() {
		String url = URL + "/" + LIST + "/" + CODE;

		ResponseEntity<String> responseEntity = restTemplate.exchange(
				url, HttpMethod.GET, HttpEntity.EMPTY, String.class);

		assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
		assertThat(responseEntity.getBody(), is(codelists.get(ListName.PRODUCER).get(CODE)));
	}

	@Test
	public void save_shouldSaveNewCodelist() {
		CodelistRequest request = createRequest(LIST, "SAVE_CODE", DESCRIPTION);
		int currentCodelistSize = codelists.get(request.getList()).size();
		assertNull(codelists.get(request.getList()).get(request.getCode()));

		ResponseEntity<String> responseEntity = restTemplate.exchange(
				URL, HttpMethod.POST, new HttpEntity<>(request), String.class);

		assertThat(responseEntity.getStatusCode(), is(HttpStatus.ACCEPTED));
		assertThat(codelists.get(request.getList()).size(), is(currentCodelistSize + 1));
		assertFalse(codelists.get(request.getList()).get(request.getCode()).isEmpty());
		assertTrue(responseEntity.getBody().contains(codelists.get(request.getList()).get(request.getCode())));
	}

	@Test
	public void update_shouldUpdateCodelist() {
		service.save(createRequest(LIST, "UPDATE_CODE", DESCRIPTION));

		CodelistRequest updateRequest = createRequest(LIST, "UPDATE_CODE", "Updated codelists");

		ResponseEntity<String> responseEntity = restTemplate.exchange(
				URL, HttpMethod.PUT, new HttpEntity<>(updateRequest), String.class);

		assertThat(responseEntity.getStatusCode(), is(HttpStatus.ACCEPTED));
		assertThat(codelists.get(LIST).get("UPDATE_CODE"), is(updateRequest.getDescription()));
	}


	@Test
	public void delete_shouldDeleteCodelist() {
		CodelistRequest request = createRequest(LIST, "DELETE_CODE", DESCRIPTION);
		service.save(request);
		assertNotNull(codelists.get(LIST).get("DELETE_CODE"));

		String url = URL + "/" + LIST + "/" + "DELETE_CODE";

		ResponseEntity<String> responseEntity = restTemplate.exchange(url, HttpMethod.DELETE, HttpEntity.EMPTY, String.class);

		assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
		assertNull(codelists.get(LIST).get("DELETE_CODE"));
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
