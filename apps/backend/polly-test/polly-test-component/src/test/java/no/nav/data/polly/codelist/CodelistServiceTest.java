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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
        CodelistRequest request = CodelistRequest.builder()
                .list("CATEGORY")
                .code("TEST_CREATE")
                .description("Test av kategorien TEST_CREATE")
                .build();
        when(repository.saveAll(anyList())).thenAnswer(AdditionalAnswers.returnsFirstArg());
        service.save(List.of(request));
        verify(repository, times(1)).saveAll(anyList());
        assertThat(CodelistService.getCodelist(ListName.CATEGORY, "TEST_CREATE").getDescription()).isEqualTo("Test av kategorien TEST_CREATE");
    }

    @Test
    void update_shouldUpdateCodelist_whenRequestIsValid() {
        CodelistCache.set(Codelist.builder().list(ListName.SOURCE).code("test_update").description("Original description").build());

        CodelistRequest request = CodelistRequest.builder()
                .list("SOURCE")
                .code("test_update")
                .description("Updated description")
                .build();

        when(repository.findByListAndNormalizedCode(ListName.SOURCE, "TESTUPDATE")).thenReturn(Optional.of(request.convert()));
        when(repository.saveAll(List.of(request.convert()))).thenReturn(List.of(request.convert()));

        service.update(List.of(request));

        verify(repository, times(1)).saveAll(anyList());
        assertThat(CodelistService.getCodelist(ListName.SOURCE, request.getCode()).getDescription()).isEqualTo("Updated description");
    }

    @Test
    void update_shouldThrowNotFound_whenCodeDoesNotExist() {
        CodelistRequest request = CodelistRequest.builder()
                .list("SOURCE")
                .code("UNKNOWN_CODE")
                .description("Updated description")
                .build();
        try {
            service.update(List.of(request));
            fail();
        } catch (CodelistNotFoundException e) {
            assertThat(e.getLocalizedMessage()).isEqualTo("Cannot find codelist with code=UNKNOWN_CODE in list=SOURCE");
        }
    }

    @Test
    void delete_shouldDelete_whenListAndCodeExists() {
        ListName listName = ListName.CATEGORY;
        String code = "TEST_DELETE";
        String description = "Test delete description";

        CodelistCache.set(Codelist.builder().list(listName).code(code).description(description).build());

        Codelist codelist = Codelist.builder()
                .list(listName)
                .code(code)
                .description(description)
                .build();
        when(repository.findByListAndNormalizedCode(listName, codelist.getNormalizedCode())).thenReturn(Optional.of(codelist));

        service.delete(listName, code);

        verify(repository, times(1)).delete(any(Codelist.class));
        assertNull(CodelistService.getCodelist(listName, code));
    }

    @Test
    void delete_shouldThrowIllegalArgumentException_whenCodeDoesNotExist() {
        when(repository.findByListAndNormalizedCode(ListName.SOURCE, "UNKNOWNCODE")).thenReturn(Optional.empty());

        try {
            service.delete(ListName.SOURCE, "UNKNOWN_CODE");
            fail();
        } catch (IllegalArgumentException e) {
            assertThat(e.getLocalizedMessage()).isEqualTo("Cannot find a codelist to delete with code=UNKNOWN_CODE and listName=SOURCE");
        }
    }

    @Test
    void validateListNameExistsAndValidateListNameAndCodeExists_nothingShouldHappenWhenValuesExists() {
        CodelistCache.set(Codelist.builder().list(ListName.PURPOSE).code("CODE").description("Description").build());

        service.validateListNameExists("PURPOSE");
        service.validateListNameAndCodeExists("PURPOSE", "CODE");
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
        //TODO: HelperFunctions
        List<CodelistRequest> requests = createListOfRequests(
                createRequestWithListName("SOURCE"),
                createRequestWithListName("CATEGORY"));

        when(repository.findByListAndNormalizedCode(any(ListName.class), anyString())).thenReturn(Optional.empty());

        service.validateRequest(requests, false);
    }

    private List<CodelistRequest> createListOfRequests(CodelistRequest... requests) {
        return Arrays.stream(requests).collect(Collectors.toList());
    }

    private CodelistRequest createRequestWithListName(String listName) {
        return CodelistRequest.builder()
                .list(listName)
                .code("TEST_CODE")
                .description("Test description")
                .update(false)
                .requestIndex(0)
                .build();
    }


    @Test
    void validate_shouldValidateWithoutAnyProcessing_whenRequestIsEmpty() {
        List<CodelistRequest> requests = new ArrayList<>(Collections.emptyList());
        service.validateRequest(requests, false);
    }

    @Test
    void validateThatAllFieldsHaveValidValues_shouldThrowValidationException_whenSaveAndRequestItemExist() {
        List<CodelistRequest> requests = createListOfRequests(createRequestWithListNameAndCode("SOURCE", "BRUKER"));
        Codelist expectedCodelist = createCodelistWithListNameAndCode(ListName.SOURCE, "BRUKER");

        when(repository.findByListAndNormalizedCode(ListName.SOURCE, "BRUKER")).thenReturn(Optional.of(expectedCodelist));

        try {
            service.validateRequest(requests, false);
            fail();
        } catch (ValidationException e) {
            assertThat(e.get().size()).isEqualTo(1);
            assertThat(e.toErrorString()).isEqualTo("Request:1 -- creatingExistingCodelist -- The Codelist SOURCE-BRUKER already exists and therefore cannot be created");
        }
    }

    private Codelist createCodelistWithListNameAndCode(ListName listName, String code) {
        return Codelist.builder().list(listName).code(code).normalizedCode(Codelist.normalize(code)).description("description").build();
    }

    private CodelistRequest createRequestWithListNameAndCode(String source, String code) {
        CodelistRequest request = createRequestWithListName(source);
        request.setCode(code);
        return request;
    }

    @Test
    void validateThatAllFieldsHaveValidValues_shouldValidate_whenUpdateAndRequestItemExist() {
        //TODO: HelperFunctions
        List<CodelistRequest> requests = new ArrayList<>();
        requests.add(CodelistRequest.builder()
                .list("SOURCE")
                .code("TEST")
                .description("Informasjon oppgitt av tester")
                .build());
        Codelist codelist = requests.get(0).convert();

        CodelistCache.set(Codelist.builder().list(ListName.SOURCE).code("TEST").description("Informasjon oppgitt av tester").build());

        when(repository.findByListAndNormalizedCode(ListName.SOURCE, "TEST")).thenReturn(Optional.of(codelist));

        service.validateRequest(requests, true);
    }

    @Test
    void validateThatAllFieldsHaveValidValues_shouldThrowValidationException_whenUpdateAndRequestItemDoesNotExist() {
        List<CodelistRequest> requests = createListOfRequests(createRequestWithListNameAndCode("SOURCE", "unknownCode"));
//        requests.forEach(r -> r.setUpdate(true));

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
        List<CodelistRequest> requests = List.of(CodelistRequest.builder()
                .list("     category      ")
                .code("    cOrRecTFormAT  ")
                .description("   Trim av description                      ")
                .build());
        when(repository.saveAll(anyList())).thenAnswer(AdditionalAnswers.returnsFirstArg());
        service.validateRequest(requests, false);
        service.save(requests);
        assertTrue(CodelistCache.contains(ListName.CATEGORY, "CORRECTFORMAT"));
        assertThat(CodelistService.getCodelist(ListName.CATEGORY, "CORRECTFORMAT").getDescription()).isEqualTo("Trim av description");
    }
}
