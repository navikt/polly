package no.nav.data.catalog.backend.app.codelist;


import no.nav.data.catalog.backend.app.IntegrationTestBase;
import no.nav.data.catalog.backend.app.PostgresTestContainer;
import org.junit.After;
import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Collections;
import java.util.List;

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
        CodelistCache.init();
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
        assertTrue(repository.findByListAndNormalizedCode(ListName.PROVENANCE, "TESTCODE").isPresent());
        assertThat(CodelistCache.getAsMap(ListName.PROVENANCE).get("TEST_CODE"), is("Test description"));
        assertThat(CodelistService.getCodelist(ListName.PROVENANCE, "TEST_code").getDescription(), is("Test description"));
        assertThat(repository.findByListAndNormalizedCode(ListName.PROVENANCE, "TESTCODE").get().getDescription(), is("Test description"));
    }

    @Test
    public void save_shouldNotSaveOrProcessAnEmptyRequest() {
        service.save(Collections.emptyList());

        assertThat(repository.findAll().size(), is(0));
    }

    @Test
    public void update_shouldUpdateCodelist() {
        service.save(createListOfOneRequest());

        List<CodelistRequest> updatedRequest = createListOfOneRequest("PROVENANCE", "TEST_CODE", "Updated codelist");
        service.update(updatedRequest);

        assertThat(CodelistCache.getAsMap(ListName.PROVENANCE).get("TEST_CODE"), is("Updated codelist"));
        assertThat(CodelistService.getCodelist(ListName.PROVENANCE, "TEST_code").getDescription(), is("Updated codelist"));
        assertThat(repository.findByListAndNormalizedCode(ListName.PROVENANCE, "TESTCODE").get().getDescription(), is("Updated codelist"));
    }

    @Test
    public void delete_shouldDeleteCodelist() {
        List<CodelistRequest> request = createListOfOneRequest();
        service.save(request);
        assertThat(repository.findAll().size(), is(1));
        assertThat(CodelistCache.getAsMap(ListName.PROVENANCE).size(), is(1));

        service.delete(ListName.PROVENANCE, "TEST_CODE");

        assertThat(repository.findAll().size(), is(0));
        assertFalse(repository.findByListAndNormalizedCode(ListName.PROVENANCE, "TEST_CODE").isPresent());
        assertThat(CodelistCache.getAsMap(ListName.PROVENANCE).size(), is(0));
        assertNull(CodelistCache.getAsMap(ListName.PROVENANCE).get("TEST_CODE"));
    }


    @Test
    public void validateRequests_shouldValidateRequests() {
        List<CodelistRequest> requests = List.of(
                createOneRequest("PROVENANCE", "CODE_1", "Description"),
                createOneRequest("PROVENANCE", "code_2 ", "Description"),
                createOneRequest("PROVENANCE", " Code_3 ", "Description "));

        service.validateRequest(requests, false);
    }

    @Test
    public void validateRequests_shouldValidateWithoutAnyProcessing_whenRequestIsNull() {
        List<CodelistRequest> requests = null;

        service.validateRequest(requests, false);
    }

    @Test
    public void validateRequests_shouldValidateWithoutAnyProcessing_whenListOfRequestsIsEmpty() {
        List<CodelistRequest> requests = Collections.emptyList();

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
        return createListOfOneRequest("PROVENANCE", "TEST_CODE", "Test description");
    }

}

