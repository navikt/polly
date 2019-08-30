package no.nav.data.catalog.backend.app.codelist;

import no.nav.data.catalog.backend.app.common.exceptions.CodelistNotFoundException;
import no.nav.data.catalog.backend.app.common.exceptions.ValidationException;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static no.nav.data.catalog.backend.app.codelist.CodelistService.codelists;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;
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
        assertThat(codelists.get(ListName.CATEGORY).get("TEST_CREATE"), is("Test av kategorien TEST_CREATE"));
    }

    @Test
    public void update_shouldUpdateCodelist_whenRequestIsValid() {
        codelists.get(ListName.PRODUCER).put("TEST_UPDATE", "Original description");

        CodelistRequest request = CodelistRequest.builder()
                .list("PRODUCER")
                .code("TEST_UPDATE")
                .description("Updated description")
                .build();

        when(repository.findByListAndCode(ListName.PRODUCER, "TEST_UPDATE")).thenReturn(Optional.of(request
                .convert()));
        when(repository.saveAll(List.of(request.convert()))).thenReturn(List.of(request.convert()));

        service.update(List.of(request));

        verify(repository, times(1)).saveAll(anyList());
        verify(repository, times(1)).findByListAndCode(ListName.PRODUCER, "TEST_UPDATE");
        assertThat(codelists.get(ListName.PRODUCER).get(request.getCode()), is("Updated description"));
    }

    @Test
    public void update_shouldThrowNotFound_whenCodeDoesNotExist() {
        CodelistRequest request = CodelistRequest.builder()
                .list("PRODUCER")
                .code("UNKNOWN_CODE")
                .description("Updated description")
                .build();
        try {
            service.update(List.of(request));
        } catch (CodelistNotFoundException e) {
            assertThat(e.getLocalizedMessage(), is("Cannot find codelist with code=UNKNOWN_CODE in list=PRODUCER"));
        }
    }

    @Test
    public void delete_shouldDelete_whenListAndCodeExists() {
        ListName listName = ListName.CATEGORY;
        String code = "TEST_DELETE";
        String description = "Test delete description";

        codelists.get(listName).put(code, description);
        Codelist codelist = Codelist.builder()
                .list(listName)
                .code(code)
                .description(description)
                .build();
        when(repository.findByListAndCode(listName, code)).thenReturn(Optional.of(codelist));

        service.delete(listName, code);

        verify(repository, times(1)).findByListAndCode(any(ListName.class), anyString());
        verify(repository, times(1)).delete(any(Codelist.class));
        assertNull(codelists.get(listName).get(code));
    }

    @Test
    public void delete_shouldThrowIllegalArgumentException_whenCodeDoesNotExist() {
        when(repository.findByListAndCode(ListName.PRODUCER, "UNKNOWN_CODE")).thenReturn(Optional.empty());


        try {
            service.delete(ListName.PRODUCER, "UNKNOWN_CODE");
        } catch (IllegalArgumentException e) {
            assertThat(e.getLocalizedMessage(), is("Cannot find a codelist to delete with code=UNKNOWN_CODE and listName=PRODUCER"));
        }
    }

    @Test
    public void validateListNameExistsANDvalidateListNameAndCodeExists_nothingShouldHappenWhenValuesExists() {
        codelists.get(ListName.PURPOSE).put("CODE", "Description");

        service.validateListNameExists("PURPOSE");
        service.validateListNameAndCodeExists("PURPOSE", "CODE");
    }

    @Test
    public void validateListNameExists_shouldThrowNotFound_whenListNameDoesNotExists() {
        try {
            service.validateListNameExists("UNKNOWN_LISTNAME");
        } catch (CodelistNotFoundException e) {
            assertThat(e.getLocalizedMessage(), is("Codelist with listName=UNKNOWN_LISTNAME does not exist"));
        }
    }

    @Test
    public void validateListNameAndCodeExists_shouldThrowNotFound_whenCodeDoesNotExists() {
        try {
            service.validateListNameAndCodeExists("PRODUCER", "unknownCode");
        } catch (CodelistNotFoundException e) {
            assertThat(e.getLocalizedMessage(), is("The code=unknownCode does not exist in the list=PRODUCER."));
        }
    }

    @Test
    public void listNameExists_shouldReturnFalse_whenListNameDoesNotExist() {
        try {
            service.validateListNameExists("UnknownListName");
        } catch (CodelistNotFoundException e) {
            assertThat(e.getLocalizedMessage(), is("Codelist with listName=UnknownListName does not exist"));
        }
    }

    @Test
    public void validateThatAllFieldsHaveValidValues_shouldValidate_whenSaveAndRequestItemDoesNotExist() {
        List<CodelistRequest> requests = new ArrayList<>();
        requests.add(CodelistRequest.builder()
                .list("PRODUCER")
                .code("TEST")
                .description("Informasjon oppgitt av tester")
                .build());
        requests.add(CodelistRequest.builder()
                .list("SYSTEM")
                .code("TEST")
                .description("Informasjon oppgitt av tester")
                .build());
        requests.add(CodelistRequest.builder()
                .list("CATEGORY")
                .code("TEST")
                .description("Informasjon oppgitt av tester")
                .build());

        when(repository.findByListAndCode(any(ListName.class), anyString())).thenReturn(Optional.empty());

        service.validateRequest(requests, false);
    }

    @Test
    public void validateThatAllFieldsHaveValidValues_shouldThrowValidationException_whenSaveAndRequestItemExist() {
        CodelistRequest request = CodelistRequest.builder().list("PRODUCER").code("BRUKER").description("Test").build();
        service.save(List.of(request));
        try {
            service.validateRequest(List.of(request), false);
        } catch (ValidationException e) {
            assertThat(e.get().size(), is(1));
            assertThat(e.toErrorString(), is("Request:1 -- creatingExistingCode -- The code BRUKER already exists in the codelist(PRODUCER) and therefore cannot be created"));
        }
    }

    @Test
    public void validateThatAllFieldsHaveValidValues_shouldValidate_whenUpdateAndRequestItemExist() {
        List<CodelistRequest> requests = new ArrayList<>();
        requests.add(CodelistRequest.builder()
                .list("PRODUCER")
                .code("TEST")
                .description("Informasjon oppgitt av tester")
                .build());
        Codelist codelist = requests.get(0).convert();

        codelists.get(ListName.PRODUCER).put("TEST", "Informasjon oppgitt av tester");

        when(repository.findByListAndCode(ListName.PRODUCER, "TEST")).thenReturn(Optional.of(codelist));

        service.validateRequest(requests, true);
    }

    @Test
    public void validateThatAllFieldsHaveValidValues_shouldThrowValidationException_whenUpdateAndRequestItemDoesNotExist() {
        CodelistRequest request = CodelistRequest.builder()
                .list("PRODUCER")
                .code("unknownCode")
                .description("Test")
                .build();
        try {
            service.validateRequest(List.of(request), true);
        } catch (ValidationException e) {
            assertThat(e.get().size(), is(1));
            assertThat(e.toErrorString(),
                    is("Request:1 -- updatingNonExistingCodelist -- The codelist PRODUCER-UNKNOWNCODE does not exist and therefore cannot be updated"));
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
        assertTrue(codelists.get(ListName.CATEGORY).containsKey("CORRECTFORMAT"));
        assertTrue(codelists.get(ListName.CATEGORY).containsValue("Trim av description"));
    }
}
