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
        when(repository.saveAll(anyList())).thenAnswer(AdditionalAnswers.returnsFirstArg());
        service.save(List.of(createRequest()));
        verify(repository, times(1)).saveAll(anyList());
        assertThat(CodelistService.getCodelist(ListName.SOURCE, "TEST_CODE").getDescription()).isEqualTo("Test description");
    }

    @Test
    void update_shouldUpdateCodelist_whenRequestIsValid() {
        CodelistCache.set(createRequest().convert());

        CodelistRequest request = createRequest();
        request.setShortName("name2");
        request.setDescription("desc2");

        when(repository.findByListAndCode(ListName.SOURCE, "TEST_CODE")).thenReturn(Optional.of(request.convert()));
        when(repository.saveAll(List.of(request.convert()))).thenReturn(List.of(request.convert()));

        service.update(List.of(request));

        verify(repository, times(1)).saveAll(anyList());
        Codelist codelist = CodelistService.getCodelist(ListName.SOURCE, request.getCode());
        assertThat(codelist.getShortName()).isEqualTo("name2");
        assertThat(codelist.getDescription()).isEqualTo("desc2");
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
        Codelist codelist = createRequest().convert();
        CodelistCache.set(codelist);
        when(repository.findByListAndCode(codelist.getList(), codelist.getCode())).thenReturn(Optional.of(createRequest().convert()));

        service.delete(codelist.getList(), codelist.getCode());

        verify(repository, times(1)).delete(any(Codelist.class));
        assertNull(CodelistService.getCodelist(codelist.getList(), codelist.getCode()));
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
        CodelistCache.set(Codelist.builder().list(ListName.PURPOSE).code("CODE").shortName("name").description("Description").build());

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

        when(repository.findByListAndCode(any(ListName.class), anyString())).thenReturn(Optional.empty());

        service.validateRequest(requests, false);
    }

    private List<CodelistRequest> createListOfRequests(CodelistRequest... requests) {
        return Arrays.stream(requests).collect(Collectors.toList());
    }

    private CodelistRequest createRequest() {
        return createRequestWithListName(ListName.SOURCE.name());
    }

    private CodelistRequest createRequestWithListName(String listName) {
        return CodelistRequest.builder()
                .list(listName)
                .code("TEST_CODE")
                .shortName("name")
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

        when(repository.findByListAndCode(ListName.SOURCE, "BRUKER")).thenReturn(Optional.of(expectedCodelist));

        try {
            service.validateRequest(requests, false);
            fail();
        } catch (ValidationException e) {
            assertThat(e.get().size()).isEqualTo(1);
            assertThat(e.toErrorString()).isEqualTo("Request:1 -- creatingExistingCodelist -- The Codelist SOURCE-BRUKER already exists and therefore cannot be created");
        }
    }

    private Codelist createCodelistWithListNameAndCode(ListName listName, String code) {
        return Codelist.builder().list(listName).code(code).shortName(code + " shortname").description("description").build();
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
                .shortName("name")
                .description("Informasjon oppgitt av tester")
                .build());
        Codelist codelist = requests.get(0).convert();

        CodelistCache.set(Codelist.builder().list(ListName.SOURCE).code("TEST").shortName("name").description("Informasjon oppgitt av tester").build());

        when(repository.findByListAndCode(ListName.SOURCE, "TEST")).thenReturn(Optional.of(codelist));

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
                .shortName("  name ")
                .description("   Trim av description                      ")
                .build());
        when(repository.saveAll(anyList())).thenAnswer(AdditionalAnswers.returnsFirstArg());
        service.validateRequest(requests, false);
        service.save(requests);
        assertTrue(CodelistCache.contains(ListName.CATEGORY, "CORRECTFORMAT"));
        assertThat(CodelistService.getCodelist(ListName.CATEGORY, "CORRECTFORMAT").getDescription()).isEqualTo("Trim av description");
    }
}
