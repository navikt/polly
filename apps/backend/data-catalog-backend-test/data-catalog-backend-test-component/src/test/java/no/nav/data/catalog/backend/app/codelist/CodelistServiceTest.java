package no.nav.data.catalog.backend.app.codelist;

import no.nav.data.catalog.backend.app.common.exceptions.CodelistNotFoundException;
import no.nav.data.catalog.backend.app.common.exceptions.ValidationException;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class CodelistServiceTest {

    @Mock
    private CodelistRepository repository;

    @InjectMocks
    private CodelistService service;

    @Test
    public void save_shouldSaveCodelist_whenRequestIsValid() {
        CodelistRequest request = CodelistRequest.builder()
                .list("CATEGORY")
                .code("TEST_CREATE")
                .description("Test av kategorien TEST_CREATE")
                .build();
        service.save(List.of(request));
        verify(repository, times(1)).saveAll(anyList());
        assertThat(CodelistService.getCodelist(ListName.CATEGORY, "TEST_CREATE").getDescription(), is("Test av kategorien TEST_CREATE"));
    }

    @Test
    public void update_shouldUpdateCodelist_whenRequestIsValid() {
        CodelistCache.set(Codelist.builder().list(ListName.PROVENANCE).code("test_update").description("Original description").build());

        CodelistRequest request = CodelistRequest.builder()
                .list("PROVENANCE")
                .code("test_update")
                .description("Updated description")
                .build();

        when(repository.findByListAndNormalizedCode(ListName.PROVENANCE, "TESTUPDATE")).thenReturn(Optional.of(request.convert()));
        when(repository.saveAll(List.of(request.convert()))).thenReturn(List.of(request.convert()));

        service.update(List.of(request));

        verify(repository, times(1)).saveAll(anyList());
        assertThat(CodelistService.getCodelist(ListName.PROVENANCE, request.getCode()).getDescription(), is("Updated description"));
    }

    @Test
    public void update_shouldThrowNotFound_whenCodeDoesNotExist() {
        CodelistRequest request = CodelistRequest.builder()
                .list("PROVENANCE")
                .code("UNKNOWN_CODE")
                .description("Updated description")
                .build();
        try {
            service.update(List.of(request));
            fail();
        } catch (CodelistNotFoundException e) {
            assertThat(e.getLocalizedMessage(), is("Cannot find codelist with code=UNKNOWN_CODE in list=PROVENANCE"));
        }
    }

    @Test
    public void delete_shouldDelete_whenListAndCodeExists() {
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
    public void delete_shouldThrowIllegalArgumentException_whenCodeDoesNotExist() {
        when(repository.findByListAndNormalizedCode(ListName.PROVENANCE, "UNKNOWNCODE")).thenReturn(Optional.empty());

        try {
            service.delete(ListName.PROVENANCE, "UNKNOWN_CODE");
            fail();
        } catch (IllegalArgumentException e) {
            assertThat(e.getLocalizedMessage(), is("Cannot find a codelist to delete with code=UNKNOWN_CODE and listName=PROVENANCE"));
        }
    }

    @Test
    public void validateListNameExistsAndValidateListNameAndCodeExists_nothingShouldHappenWhenValuesExists() {
        CodelistCache.set(Codelist.builder().list(ListName.PURPOSE).code("CODE").description("Description").build());

        service.validateListNameExists("PURPOSE");
        service.validateListNameAndCodeExists("PURPOSE", "CODE");
    }

    @Test
    public void validateListNameExists_shouldThrowNotFound_whenListNameDoesNotExists() {
        try {
            service.validateListNameExists("UNKNOWN_LISTNAME");
            fail();
        } catch (CodelistNotFoundException e) {
            assertThat(e.getLocalizedMessage(), is("Codelist with listName=UNKNOWN_LISTNAME does not exist"));
        }
    }

    @Test
    public void validateListNameAndCodeExists_shouldThrowNotFound_whenCodeDoesNotExists() {
        try {
            service.validateListNameAndCodeExists("PROVENANCE", "unknownCode");
            fail();
        } catch (CodelistNotFoundException e) {
            assertThat(e.getLocalizedMessage(), is("The code=unknownCode does not exist in the list=PROVENANCE."));
        }
    }

    @Test
    public void listNameExists_shouldReturnFalse_whenListNameDoesNotExist() {
        try {
            service.validateListNameExists("UnknownListName");
            fail();
        } catch (CodelistNotFoundException e) {
            assertThat(e.getLocalizedMessage(), is("Codelist with listName=UnknownListName does not exist"));
        }
    }

    @Test
    public void validateThatAllFieldsHaveValidValues_shouldValidate_whenSaveAndRequestItemDoesNotExist() {
        List<CodelistRequest> requests = new ArrayList<>();
        requests.add(CodelistRequest.builder()
                .list("PROVENANCE")
                .code("TEST")
                .description("Informasjon oppgitt av tester")
                .build());
        requests.add(CodelistRequest.builder()
                .list("CATEGORY")
                .code("TEST")
                .description("Informasjon oppgitt av tester")
                .build());

        when(repository.findByListAndNormalizedCode(any(ListName.class), anyString())).thenReturn(Optional.empty());

        service.validateRequest(requests, false);
    }

    @Test
    public void validate_shouldValidateWithoutAnyProcessing_whenRequestIsEmpty() {
        List<CodelistRequest> requests = new ArrayList<>(Collections.emptyList());
        service.validateRequest(requests, false);
    }

    @Test
    public void validate_shouldValidateWithoutAnyProcessing_whenRequestIsNull() {
        List<CodelistRequest> requests = null;
        service.validateRequest(requests, false);
    }

    @Test
    public void validateThatAllFieldsHaveValidValues_shouldThrowValidationException_whenSaveAndRequestItemExist() {
        CodelistRequest request = CodelistRequest.builder().list("PROVENANCE").code("bruker").description("Test").build();
        when(repository.findByListAndNormalizedCode(ListName.PROVENANCE, "BRUKER")).thenReturn(Optional.of(request.convert()));
        try {
            service.validateRequest(List.of(request), false);
            fail();
        } catch (ValidationException e) {
            assertThat(e.get().size(), is(1));
            assertThat(e.toErrorString(), is("Request:1 -- creatingExistingCodelist -- The codelist PROVENANCE-BRUKER already exists and therefore cannot be created"));
        }
    }

    @Test
    public void validateThatAllFieldsHaveValidValues_shouldValidate_whenUpdateAndRequestItemExist() {
        List<CodelistRequest> requests = new ArrayList<>();
        requests.add(CodelistRequest.builder()
                .list("PROVENANCE")
                .code("TEST")
                .description("Informasjon oppgitt av tester")
                .build());
        Codelist codelist = requests.get(0).convert();

        CodelistCache.set(Codelist.builder().list(ListName.PROVENANCE).code("TEST").description("Informasjon oppgitt av tester").build());

        when(repository.findByListAndNormalizedCode(ListName.PROVENANCE, "TEST")).thenReturn(Optional.of(codelist));

        service.validateRequest(requests, true);
    }

    @Test
    public void validateThatAllFieldsHaveValidValues_shouldThrowValidationException_whenUpdateAndRequestItemDoesNotExist() {
        CodelistRequest request = CodelistRequest.builder()
                .list("PROVENANCE")
                .code("unknownCode")
                .description("Test")
                .build();
        try {
            service.validateRequest(List.of(request), true);
            fail();
        } catch (ValidationException e) {
            assertThat(e.get().size(), is(1));
            assertThat(e.toErrorString(),
                    is("Request:1 -- updatingNonExistingCodelist -- The codelist PROVENANCE-UNKNOWNCODE does not exist and therefore cannot be updated"));
        }
    }

    @Test
    public void validateThatAllFieldsHaveValidValues_shouldChangeInputInRequestToCorrectFormat() {
        List<CodelistRequest> requests = List.of(CodelistRequest.builder()
                .list("     category      ")
                .code("    cOrRecTFormAT  ")
                .description("   Trim av description                      ")
                .build());
        service.validateRequest(requests, false);
        service.save(requests);
        assertTrue(CodelistCache.contains(ListName.CATEGORY, "CORRECTFORMAT"));
        assertThat(CodelistService.getCodelist(ListName.CATEGORY, "CORRECTFORMAT").getDescription(), is("Trim av description"));
    }
}
