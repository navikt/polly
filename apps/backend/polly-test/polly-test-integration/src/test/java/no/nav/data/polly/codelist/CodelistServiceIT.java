package no.nav.data.polly.codelist;


import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.codelist.domain.Codelist;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodelistRequest;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Collections;
import java.util.List;

import static no.nav.data.polly.codelist.CodelistUtils.createCodelistRequest;
import static no.nav.data.polly.codelist.CodelistUtils.createListOfRequests;
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
        service.save(createListOfRequests(createCodelistRequest("SOURCE", "TEST_CODE", "Test shortName", "Test description")));

        assertThat(repository.findAll().size()).isEqualTo(1);
        assertTrue(repository.findByListAndCode(ListName.SOURCE, "TEST_CODE").isPresent());
        Codelist actualCodelist = CodelistService.getCodelist(ListName.SOURCE, "TEST_CODE");
        assertThat(actualCodelist.getShortName()).isEqualTo("Test shortName");
        assertThat(actualCodelist.getDescription()).isEqualTo("Test description");
    }

    @Test
    void save_shouldNotSaveOrProcessAnEmptyRequest() {
        service.save(Collections.emptyList());

        assertThat(repository.findAll().size()).isEqualTo(0);
    }

    @Test
    void update_shouldUpdateCodelist() {
        service.save(createListOfRequests(createCodelistRequest("SOURCE", "UPDATE_CODE", "shortName", "description")));

        List<CodelistRequest> updatedRequest = createListOfRequests(createCodelistRequest("SOURCE", "UPDATE_CODE", "Updated shortName", "Updated description"));
        service.update(updatedRequest);

        Codelist serviceCodelist = CodelistService.getCodelist(ListName.SOURCE, "UPDATE_CODE");
        Codelist repositoryCodelist = repository.findByListAndCode(ListName.SOURCE, "UPDATE_CODE").get();

        assertThat(serviceCodelist.getShortName()).isEqualTo("Updated shortName");
        assertThat(serviceCodelist.getDescription()).isEqualTo("Updated description");
        assertThat(repositoryCodelist.getShortName()).isEqualTo("Updated shortName");
        assertThat(repositoryCodelist.getDescription()).isEqualTo("Updated description");
    }

    @Test
    void delete_shouldDeleteCodelist() {
        List<CodelistRequest> request = createListOfRequests(createCodelistRequest("SOURCE", "DELETE_CODE"));
        service.save(request);
        assertThat(repository.findAll().size()).isEqualTo(1);
        assertThat(CodelistService.getCodelist(ListName.SOURCE).size()).isEqualTo(1);

        service.delete(ListName.SOURCE, "DELETE_CODE");

        assertThat(repository.findAll().size()).isEqualTo(0);
        assertFalse(repository.findByListAndCode(ListName.SOURCE, "DELETE_CODE").isPresent());
        assertThat(CodelistService.getCodelist(ListName.SOURCE).size()).isEqualTo(0);
        assertNull(CodelistService.getCodelist(ListName.SOURCE, "DELETE_CODE"));
    }

    @Test
    void validateRequests_shouldValidateRequests() {
        List<CodelistRequest> requests = createListOfRequests(
                createCodelistRequest("SOURCE", "CODE_1"),
                createCodelistRequest("SOURCE", "code_2 "),
                createCodelistRequest("SOURCE", " Code_3 "));

        service.validateRequest(requests, false);
    }

    @Test
    void validateRequests_shouldValidateWithoutAnyProcessing_whenListOfRequestsIsEmpty() {
        List<CodelistRequest> requests = Collections.emptyList();

        service.validateRequest(requests, false);
    }
}

