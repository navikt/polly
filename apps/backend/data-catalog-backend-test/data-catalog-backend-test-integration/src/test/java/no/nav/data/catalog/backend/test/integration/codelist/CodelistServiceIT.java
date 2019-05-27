package no.nav.data.catalog.backend.test.integration.codelist;


import static no.nav.data.catalog.backend.app.codelist.CodelistService.codelists;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;

import no.nav.data.catalog.backend.app.AppStarter;
import no.nav.data.catalog.backend.app.codelist.CodelistRepository;
import no.nav.data.catalog.backend.app.codelist.CodelistRequest;
import no.nav.data.catalog.backend.app.codelist.CodelistService;
import no.nav.data.catalog.backend.test.integration.IntegrationTestConfig;
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

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE,
		classes = {IntegrationTestConfig.class, AppStarter.class})
@ActiveProfiles("itest")
@ContextConfiguration(initializers = {CodelistServiceIT.Initializer.class})
public class CodelistServiceIT extends TestdataCodelists {

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

	@Test
	public void save_shouldSaveNewCodelist() {
		CodelistRequest request = createRequest();
		service.save(createRequest());

		assertThat(repository.findAll().size(), is(1));
		assertTrue(repository.findByListAndCode(LIST, CODE).isPresent());
		assertThat(codelists.get(LIST).size(), is(1));
		assertFalse(codelists.get(LIST).get(CODE).isEmpty());

		resetRepository(request);
	}

	@Test
	public void update_shouldUpdateCodelist() {
		service.save(createRequest());

		CodelistRequest updatedRequest = createRequest(LIST, CODE, "Updated codelist");
		service.update(updatedRequest);

		assertThat(codelists.get(LIST).get(CODE), is(updatedRequest.getDescription()));
		assertThat(repository.findByListAndCode(LIST, CODE).get().getDescription(), is(updatedRequest.getDescription()));

		resetRepository(updatedRequest);
	}

	@Test
	public void delete_shouldDeleteCodelist() {
		CodelistRequest request = createRequest();

		service.save(request);
		assertThat(repository.findAll().size(), is(1));
		assertThat(codelists.get(request.getList()).size(), is(1));

		service.delete(request.getList(), request.getCode());

		assertThat(repository.findAll().size(), is(0));
		assertFalse(repository.findByListAndCode(LIST, CODE).isPresent());
		assertThat(codelists.get(LIST).size(), is(0));
		assertNull(codelists.get(LIST).get(CODE));
	}

	private void resetRepository(CodelistRequest request) {
		service.delete(request.getList(), request.getCode());
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

