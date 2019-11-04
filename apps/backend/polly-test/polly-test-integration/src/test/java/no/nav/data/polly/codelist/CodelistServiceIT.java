package no.nav.data.polly.codelist;


import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodelistRequest;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
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
        assertTrue(repository.findByListAndNormalizedCode(ListName.SOURCE, "TESTCODE").isPresent());
        assertThat(CodelistCache.getAsMap(ListName.SOURCE).get("TEST_CODE")).isEqualTo("Test description");
        assertThat(CodelistService.getCodelist(ListName.SOURCE, "TEST_code").getDescription()).isEqualTo("Test description");
        assertThat(repository.findByListAndNormalizedCode(ListName.SOURCE, "TESTCODE").get().getDescription()).isEqualTo("Test description");
    }

    @Test
    void save_shouldNotSaveOrProcessAnEmptyRequest() {
        service.save(Collections.emptyList());

        assertThat(repository.findAll().size()).isEqualTo(0);
    }

    @Test
    void update_shouldUpdateCodelist() {
        service.save(createListOfOneRequest());

        List<CodelistRequest> updatedRequest = createListOfOneRequest("SOURCE", "TEST_CODE", "Updated codelist");
        service.update(updatedRequest);

        assertThat(CodelistCache.getAsMap(ListName.SOURCE).get("TEST_CODE")).isEqualTo("Updated codelist");
        assertThat(CodelistService.getCodelist(ListName.SOURCE, "TEST_code").getDescription()).isEqualTo("Updated codelist");
        assertThat(repository.findByListAndNormalizedCode(ListName.SOURCE, "TESTCODE").get().getDescription()).isEqualTo("Updated codelist");
    }

    @Test
    void delete_shouldDeleteCodelist() {
        List<CodelistRequest> request = createListOfOneRequest();
        service.save(request);
        assertThat(repository.findAll().size()).isEqualTo(1);
        assertThat(CodelistCache.getAsMap(ListName.SOURCE).size()).isEqualTo(1);

        service.delete(ListName.SOURCE, "TEST_CODE");

        assertThat(repository.findAll().size()).isEqualTo(0);
        assertFalse(repository.findByListAndNormalizedCode(ListName.SOURCE, "TEST_CODE").isPresent());
        assertThat(CodelistCache.getAsMap(ListName.SOURCE).size()).isEqualTo(0);
        assertNull(CodelistCache.getAsMap(ListName.SOURCE).get("TEST_CODE"));
    }

    @Test
    void validateRequests_shouldValidateRequests() {
        List<CodelistRequest> requests = List.of(
                createOneRequest("SOURCE", "CODE_1", "Description"),
                createOneRequest("SOURCE", "code_2 ", "Description"),
                createOneRequest("SOURCE", " Code_3 ", "Description "));

        service.validateRequest(requests, false);
    }

    @Test
    void validateRequests_shouldValidateWithoutAnyProcessing_whenListOfRequestsIsEmpty() {
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
        return createListOfOneRequest("SOURCE", "TEST_CODE", "Test description");
    }

}

