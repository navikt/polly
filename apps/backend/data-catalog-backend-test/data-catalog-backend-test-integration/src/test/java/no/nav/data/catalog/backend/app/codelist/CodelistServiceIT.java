package no.nav.data.catalog.backend.app.codelist;


import no.nav.data.catalog.backend.app.IntegrationTestBase;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CodelistServiceIT extends IntegrationTestBase {

    @Autowired
    private CodelistService service;

    @Autowired
    private CodelistRepository repository;

    @BeforeEach
    void setUp() {
        CodelistCache.init();
        repository.deleteAll();
    }

    @AfterEach
    void cleanUp() {
        repository.deleteAll();
    }

    @Test
    void save_shouldSaveNewCodelist() {
        service.save(createListOfOneRequest());

        assertThat(repository.findAll().size()).isEqualTo(1);
        assertTrue(repository.findByListAndNormalizedCode(ListName.PROVENANCE, "TESTCODE").isPresent());
        assertThat(CodelistCache.getAsMap(ListName.PROVENANCE).get("TEST_CODE")).isEqualTo("Test description");
        assertThat(CodelistService.getCodelist(ListName.PROVENANCE, "TEST_code").getDescription()).isEqualTo("Test description");
        assertThat(repository.findByListAndNormalizedCode(ListName.PROVENANCE, "TESTCODE").get().getDescription()).isEqualTo("Test description");
    }

    @Test
    void save_shouldNotSaveOrProcessAnEmptyRequest() {
        service.save(Collections.emptyList());

        assertThat(repository.findAll().size()).isEqualTo(0);
    }

    @Test
    void update_shouldUpdateCodelist() {
        service.save(createListOfOneRequest());

        List<CodelistRequest> updatedRequest = createListOfOneRequest("PROVENANCE", "TEST_CODE", "Updated codelist");
        service.update(updatedRequest);

        assertThat(CodelistCache.getAsMap(ListName.PROVENANCE).get("TEST_CODE")).isEqualTo("Updated codelist");
        assertThat(CodelistService.getCodelist(ListName.PROVENANCE, "TEST_code").getDescription()).isEqualTo("Updated codelist");
        assertThat(repository.findByListAndNormalizedCode(ListName.PROVENANCE, "TESTCODE").get().getDescription()).isEqualTo("Updated codelist");
    }

    @Test
    void delete_shouldDeleteCodelist() {
        List<CodelistRequest> request = createListOfOneRequest();
        service.save(request);
        assertThat(repository.findAll().size()).isEqualTo(1);
        assertThat(CodelistCache.getAsMap(ListName.PROVENANCE).size()).isEqualTo(1);

        service.delete(ListName.PROVENANCE, "TEST_CODE");

        assertThat(repository.findAll().size()).isEqualTo(0);
        assertFalse(repository.findByListAndNormalizedCode(ListName.PROVENANCE, "TEST_CODE").isPresent());
        assertThat(CodelistCache.getAsMap(ListName.PROVENANCE).size()).isEqualTo(0);
        assertNull(CodelistCache.getAsMap(ListName.PROVENANCE).get("TEST_CODE"));
    }

    @Disabled("Until generic test for RequestValidation is written")
    @Test
    void validateRequests_shouldValidateRequests() {
        List<CodelistRequest> requests = List.of(
                createOneRequest("PROVENANCE", "CODE_1", "Description"),
                createOneRequest("PROVENANCE", "code_2 ", "Description"),
                createOneRequest("PROVENANCE", " Code_3 ", "Description "));

//        service.validateRequest(requests, false);
    }

    @Disabled("Until generic test for RequestValidation is written")
    @Test
    void validateRequests_shouldValidateWithoutAnyProcessing_whenRequestIsNull() {
        List<CodelistRequest> requests = null;

//        service.validateRequest(requests, false);
    }

    @Disabled("Until generic test for RequestValidation is written")
    @Test
    void validateRequests_shouldValidateWithoutAnyProcessing_whenListOfRequestsIsEmpty() {
        List<CodelistRequest> requests = Collections.emptyList();

//        service.validateRequest(requests, false);
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

