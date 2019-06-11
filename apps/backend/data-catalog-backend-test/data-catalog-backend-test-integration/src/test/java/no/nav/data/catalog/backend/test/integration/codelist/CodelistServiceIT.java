package no.nav.data.catalog.backend.test.integration.codelist;


import static no.nav.data.catalog.backend.app.codelist.CodelistService.codelists;
import static no.nav.data.catalog.backend.test.integration.codelist.TestdataCodelists.CODE;
import static no.nav.data.catalog.backend.test.integration.codelist.TestdataCodelists.DESCRIPTION;
import static no.nav.data.catalog.backend.test.integration.codelist.TestdataCodelists.LIST_NAME;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;

import no.nav.data.catalog.backend.app.AppStarter;
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
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.testcontainers.containers.PostgreSQLContainer;

import java.time.Duration;
import java.util.List;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE,
		classes = {IntegrationTestConfig.class, AppStarter.class})
@ActiveProfiles("itest")
@ContextConfiguration(initializers = {CodelistServiceIT.Initializer.class})
public class CodelistServiceIT {

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
		repository.deleteAll();
	}

	@After
	public void cleanUp() {
		repository.deleteAll();
	}

	@Test
	public void save_shouldSaveNewCodelist() {
		service.save(createRequest());

		assertThat(repository.findAll().size(), is(1));
		assertTrue(repository.findByListAndCode(LIST_NAME, CODE).isPresent());
		assertThat(codelists.get(LIST_NAME).size(), is(1));
		assertFalse(codelists.get(LIST_NAME).get(CODE).isEmpty());
	}

	@Test
	public void update_shouldUpdateCodelist() {
		service.save(createRequest());

		List<CodelistRequest> updatedRequest = createRequest(LIST_NAME, CODE, "Updated codelist");
		service.update(updatedRequest);

		assertThat(codelists.get(LIST_NAME).get(CODE), is(updatedRequest.get(0).getDescription()));
		assertThat(repository.findByListAndCode(LIST_NAME, CODE).get().getDescription(), is(updatedRequest.get(0)
				.getDescription()));
	}

	@Test
	public void delete_shouldDeleteCodelist() {
		List<CodelistRequest> request = createRequest();
		service.save(request);
		assertThat(repository.findAll().size(), is(1));
		assertThat(codelists.get(LIST_NAME).size(), is(1));

		service.delete(LIST_NAME, CODE);

		assertThat(repository.findAll().size(), is(0));
		assertFalse(repository.findByListAndCode(LIST_NAME, CODE).isPresent());
		assertThat(codelists.get(LIST_NAME).size(), is(0));
		assertNull(codelists.get(LIST_NAME).get(CODE));
	}

	private List<CodelistRequest> createRequest(ListName listName, String code, String description) {
		return List.of(CodelistRequest.builder()
				.list(listName)
				.code(code)
				.description(description)
				.build());
	}

	private List<CodelistRequest> createRequest() {
		return createRequest(LIST_NAME, CODE, DESCRIPTION);
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

