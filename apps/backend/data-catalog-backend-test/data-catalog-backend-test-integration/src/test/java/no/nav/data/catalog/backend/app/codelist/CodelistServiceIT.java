package no.nav.data.catalog.backend.app.codelist;


import no.nav.data.catalog.backend.app.IntegrationTestBase;
import no.nav.data.catalog.backend.app.PostgresTestContainer;
import org.junit.After;
import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

import static no.nav.data.catalog.backend.app.codelist.CodelistService.codelists;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;

public class CodelistServiceIT extends IntegrationTestBase {

	@Autowired
	private CodelistService service;

	@Autowired
	private CodelistRepository repository;

	@ClassRule
	public static PostgresTestContainer postgreSQLContainer = PostgresTestContainer.getInstance();

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
		service.save(createListOfOneRequest());

		assertThat(repository.findAll().size(), is(1));
		assertTrue(repository.findByListAndCode(ListName.PRODUCER, "TEST_CODE").isPresent());
		assertThat(codelists.get(ListName.PRODUCER).size(), is(1));
		assertFalse(codelists.get(ListName.PRODUCER).get("TEST_CODE").isEmpty());
	}

	@Test
	public void update_shouldUpdateCodelist() {
		service.save(createListOfOneRequest());

        List<CodelistRequest> updatedRequest = createListOfOneRequest("PRODUCER", "TEST_CODE", "Updated codelist");
		service.update(updatedRequest);

		assertThat(codelists.get(ListName.PRODUCER).get("TEST_CODE"), is(updatedRequest.get(0).getDescription()));
		assertThat(repository.findByListAndCode(ListName.PRODUCER, "TEST_CODE").get().getDescription(), is(updatedRequest.get(0)
				.getDescription()));
	}

	@Test
	public void delete_shouldDeleteCodelist() {
		List<CodelistRequest> request = createListOfOneRequest();
		service.save(request);
		assertThat(repository.findAll().size(), is(1));
		assertThat(codelists.get(ListName.PRODUCER).size(), is(1));

		service.delete(ListName.PRODUCER, "TEST_CODE");

		assertThat(repository.findAll().size(), is(0));
		assertFalse(repository.findByListAndCode(ListName.PRODUCER, "TEST_CODE").isPresent());
		assertThat(codelists.get(ListName.PRODUCER).size(), is(0));
		assertNull(codelists.get(ListName.PRODUCER).get("TEST_CODE"));
	}


	@Test
	public void validateRequests_shouldValidateRequests() {
		List<CodelistRequest> requests = List.of(
                createOneRequest("PRODUCER", "CODE_1", "Description"),
                createOneRequest("PRODUCER", "code_2 ", "Description"),
                createOneRequest("PRODUCER", " Code_3 ", "Description "));

        service.validateRequest(requests, false);
    }

    private CodelistRequest createOneRequest(String listName, String code, String description) {
		return CodelistRequest.builder()
				.list(listName)
				.code(code)
				.description(description)
				.build();
	}

    private List<CodelistRequest> createListOfOneRequest(String listName, String code, String description) {
		return List.of(CodelistRequest.builder()
				.list(listName)
				.code(code)
				.description(description)
				.build());
	}

	private List<CodelistRequest> createListOfOneRequest() {
        return createListOfOneRequest("PRODUCER", "TEST_CODE", "Test description");
	}

}

