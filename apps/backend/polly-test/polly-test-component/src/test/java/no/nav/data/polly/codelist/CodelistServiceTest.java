package no.nav.data.polly.codelist;

import no.nav.data.polly.codelist.domain.Codelist;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodelistRequest;
import no.nav.data.polly.common.exceptions.CodelistNotFoundException;
import no.nav.data.polly.common.exceptions.ValidationException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.AdditionalAnswers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static no.nav.data.polly.codelist.CodelistUtils.createCodelist;
import static no.nav.data.polly.codelist.CodelistUtils.createCodelistRequest;
import static no.nav.data.polly.codelist.CodelistUtils.createListOfRequests;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CodelistServiceTest {

    @Mock
    private CodelistRepository repository;

    @InjectMocks
    private CodelistService service;

    @Test
    void save_shouldSaveCodelist_whenRequestIsValid() {
        when(repository.saveAll(anyList())).thenAnswer(AdditionalAnswers.returnsFirstArg());
        service.save(List.of(createCodelistRequest("SOURCE", "TEST_CODE", "Test shortName", "Test description")));
        verify(repository, times(1)).saveAll(anyList());
        assertThat(CodelistService.getCodelist(ListName.SOURCE, "TEST_CODE").getShortName()).isEqualTo("Test shortName");
        assertThat(CodelistService.getCodelist(ListName.SOURCE, "TEST_CODE").getDescription()).isEqualTo("Test description");
    }

    @Test
    void update_shouldUpdateCodelist_whenRequestIsValid() {
        saveCodelist(createCodelist(ListName.SOURCE, "CODE", "name1", "desc1"));

        CodelistRequest request = createCodelistRequest();
        request.setShortName("name2");
        request.setDescription("desc2");

        when(repository.findByListAndCode(ListName.SOURCE, "CODE")).thenReturn(Optional.of(request.convert()));
        when(repository.saveAll(List.of(request.convert()))).thenReturn(List.of(request.convert()));

        service.update(List.of(request));

        verify(repository, times(1)).saveAll(anyList());
        Codelist codelist = CodelistService.getCodelist(ListName.SOURCE, request.getCode());
        assertThat(codelist.getShortName()).isEqualTo("name2");
        assertThat(codelist.getDescription()).isEqualTo("desc2");
    }

    @Test
    void update_shouldThrowNotFound_whenCodeDoesNotExist() {
        CodelistRequest request = createCodelistRequest("SOURCE", "UNKNOWN_CODE", "Unknown shortName", "Updated description");

        try {
            service.update(List.of(request));
            fail();
        } catch (CodelistNotFoundException e) {
            assertThat(e.getLocalizedMessage()).isEqualTo("Cannot find codelist with code=UNKNOWN_CODE in list=SOURCE");
        }
    }

    @Test
    void delete_shouldDelete_whenListAndCodeExists() {
        when(repository.findByListAndCode(ListName.SOURCE, "DELETE_CODE")).thenReturn(Optional.of(createCodelist(ListName.SOURCE, "DELETE_CODE")));

        service.delete(ListName.SOURCE, "DELETE_CODE");

        verify(repository, times(1)).delete(any(Codelist.class));
        assertNull(CodelistService.getCodelist(ListName.SOURCE, "DELETE_CODE"));
    }

    @Test
    void delete_shouldThrowIllegalArgumentException_whenCodeDoesNotExist() {
        when(repository.findByListAndCode(ListName.SOURCE, "UNKNOWN_CODE")).thenReturn(Optional.empty());

        try {
            service.delete(ListName.SOURCE, "UNKNOWN_CODE");
            fail();
        } catch (IllegalArgumentException e) {
            assertThat(e.getLocalizedMessage()).isEqualTo("Cannot find a codelist to delete with code=UNKNOWN_CODE and listName=SOURCE");
        }
    }

    @Test
    void validateListNameExistsAndValidateListNameAndCodeExists_nothingShouldHappenWhenValuesExists() {
        saveCodelist(createCodelist(ListName.PURPOSE, "VALID_CODE"));

        service.validateListNameExists("PURPOSE");
        service.validateListNameAndCodeExists("PURPOSE", "VALID_CODE");
    }

    @Test
    void validateListNameExists_shouldThrowNotFound_whenListNameDoesNotExists() {
        try {
            service.validateListNameExists("UNKNOWN_LISTNAME");
            fail();
        } catch (CodelistNotFoundException e) {
            assertThat(e.getLocalizedMessage()).isEqualTo("Codelist with listName=UNKNOWN_LISTNAME does not exist");
        }
    }

    @Test
    void validateListNameAndCodeExists_shouldThrowNotFound_whenCodeDoesNotExists() {
        try {
            service.validateListNameAndCodeExists("SOURCE", "unknownCode");
            fail();
        } catch (CodelistNotFoundException e) {
            assertThat(e.getLocalizedMessage()).isEqualTo("The code=unknownCode does not exist in the list=SOURCE.");
        }
    }

    @Test
    void listNameExists_shouldReturnFalse_whenListNameDoesNotExist() {
        try {
            service.validateListNameExists("UnknownListName");
            fail();
        } catch (CodelistNotFoundException e) {
            assertThat(e.getLocalizedMessage()).isEqualTo("Codelist with listName=UnknownListName does not exist");
        }
    }

    @Test
    void validateThatAllFieldsHaveValidValues_shouldValidate_whenSaveAndRequestItemDoesNotExist() {
        List<CodelistRequest> requests = createListOfRequests(
                createCodelistRequest("SOURCE"),
                createCodelistRequest("CATEGORY"));

        when(repository.findByListAndCode(any(ListName.class), anyString())).thenReturn(Optional.empty());

        service.validateRequest(requests, false);
    }

    @Test
    void validate_shouldValidateWithoutAnyProcessing_whenRequestIsEmpty() {
        List<CodelistRequest> requests = Collections.emptyList();
        service.validateRequest(requests, false);
    }

    @Test
    void validateThatAllFieldsHaveValidValues_shouldThrowValidationException_whenSaveAndRequestItemExist() {
        List<CodelistRequest> requests = createListOfRequests(createCodelistRequest("SOURCE", "BRUKER"));
        Codelist expectedCodelist = createCodelist(ListName.SOURCE, "BRUKER");

        when(repository.findByListAndCode(ListName.SOURCE, "BRUKER")).thenReturn(Optional.of(expectedCodelist));

        try {
            service.validateRequest(requests, false);
            fail();
        } catch (ValidationException e) {
            assertThat(e.get().size()).isEqualTo(1);
            assertThat(e.toErrorString()).isEqualTo("Request:1 -- creatingExistingCodelist -- The Codelist SOURCE-BRUKER already exists and therefore cannot be created");
        }
    }

    @Test
    void validateThatAllFieldsHaveValidValues_shouldValidate_whenUpdateAndRequestItemExist() {
        saveCodelist(createCodelist(ListName.SOURCE, "TEST", "name", "description"));
        when(repository.findByListAndCode(ListName.SOURCE, "TEST")).thenReturn(Optional.of(CodelistCache.getCodelist(ListName.SOURCE, "TEST")));

        List<CodelistRequest> requests = createListOfRequests(createCodelistRequest("SOURCE", "TEST", "name", "Informasjon oppgitt av tester"));

        service.validateRequest(requests, true);
    }

    @Test
    void validateThatAllFieldsHaveValidValues_shouldThrowValidationException_whenUpdateAndRequestItemDoesNotExist() {
        List<CodelistRequest> requests = createListOfRequests(createCodelistRequest("SOURCE", "unknownCode"));

        try {
            service.validateRequest(requests, true);
            fail();
        } catch (ValidationException e) {
            assertThat(e.get().size()).isEqualTo(1);
            assertThat(e.toErrorString())
                    .isEqualTo("Request:1 -- updatingNonExistingCodelist -- The Codelist SOURCE-UNKNOWNCODE does not exist and therefore cannot be updated");
        }
    }

    @Test
    void validateThatAllFieldsHaveValidValues_shouldChangeInputInRequestToCorrectFormat() {
        List<CodelistRequest> requests = createListOfRequests(
                createCodelistRequest("     category      ", "    cOrRecTFormAT  ", "  name ", "   Trim av description                      "));
        when(repository.saveAll(anyList())).thenAnswer(AdditionalAnswers.returnsFirstArg());
        service.validateRequest(requests, false);
        service.save(requests);
        assertTrue(CodelistCache.contains(ListName.CATEGORY, "CORRECTFORMAT"));
        assertThat(CodelistService.getCodelist(ListName.CATEGORY, "CORRECTFORMAT").getDescription()).isEqualTo("Trim av description");
    }

    private void saveCodelist(Codelist codelist) {
        CodelistCache.set(codelist);
    }
}
