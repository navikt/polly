package no.nav.data.polly.informationtype;

import no.nav.data.polly.codelist.CodelistStub;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.dto.InformationTypeRequest;
import no.nav.data.polly.term.domain.Term;
import no.nav.data.polly.term.domain.TermRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static no.nav.data.polly.informationtype.domain.InformationTypeMaster.GITHUB;
import static no.nav.data.polly.informationtype.domain.InformationTypeMaster.REST;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class InformationTypeServiceTest {

    @Mock
    private InformationTypeRepository informationTypeRepository;
    @Mock
    private TermRepository termRepository;

    @InjectMocks
    private InformationTypeService service;

    @BeforeEach
    void setUp() {
        CodelistStub.initializeCodelist();
    }

    @Test
    void save_shouldSave_whenRequestIsValid() {
        when(termRepository.findByName("term")).thenReturn(Optional.of(new Term()));
        InformationTypeRequest request = createValidInformationTypeRequest("Name");

        service.saveAll(List.of(request), REST);
        verify(informationTypeRepository, times(1)).saveAll(anyList());
    }

    @Test
    void update_shouldUpdate_whenRequestIsValid() {
        when(informationTypeRepository.findAllByName(Collections.singletonList("Name"))).thenReturn(Collections.singletonList(new InformationType()));
        InformationTypeRequest request = createValidInformationTypeRequest("Name");

        service.updateAll(List.of(request));
        verify(informationTypeRepository, times(1)).saveAll(anyList());
    }

    @Test
    void validateRequest_shouldValidateWithoutAnyProcessing_whenListOfRequestsIsNull() {
        service.validateRequest(null);
    }

    @Test
    void validateRequest_shouldValidateWithoutAnyProcessing_whenListOfRequestsIsEmpty() {
        List<InformationTypeRequest> requests = Collections.emptyList();
        service.validateRequest(requests);
    }

    @Disabled("Until generic test for RequestValidation is written")
    @Test
    void validateRequest_shouldThrowValidationException_withDuplicatedElementInRequest() {
        InformationTypeRequest name1 = createValidInformationTypeRequest("Name1");
        InformationTypeRequest name2 = createValidInformationTypeRequest("Name2");

        Exception exception = assertThrows(Exception.class, () -> service.validateRequest(new ArrayList<>(List.of(name1, name2, name1))));
        assertThat(exception)
                .hasMessageContaining("Request:3 -- DuplicateElement -- The informationType Name1 is not unique because it has already been used in this request (see request:1)");
    }

    @Test
    void validateRequest_shouldThrowValidationException_withDuplicatedIdentifyingFieldsInRequest() {
        InformationTypeRequest name1 = createValidInformationTypeRequest("Name1");
        InformationTypeRequest name2 = createValidInformationTypeRequest("Name2");
        InformationTypeRequest name3 = createValidInformationTypeRequest("Name1");
        name3.setDescription("Not equal object as the request1");

        Exception exception = assertThrows(Exception.class, () -> service.validateRequest(new ArrayList<>(List.of(name1, name2, name3))));
        assertThat(exception).hasMessageContaining("Name1-context -- DuplicatedIdentifyingFields -- Multiple elements in this request are using the same unique fields (Name1-context)");
    }

    @Disabled("Until generic test for RequestValidation is written")
    @Test
    void validateRequest_shouldThrowValidationException_whenFieldNameIsNull() {
        Exception exception = assertThrows(Exception.class, () -> service.validateRequest(List.of(createValidInformationTypeRequest(null))));
        assertThat(exception).hasMessageContaining("Request:1 -- fieldIsNullOrMissing -- name was null or missing");
    }

    @Test
    void validateRequest_shouldThrowValidationException_whenFieldCategoriesInvalid() {
        InformationTypeRequest request = createValidInformationTypeRequest("Name1");
        request.setCategories(List.of("doesntexist"));

        Exception exception = assertThrows(Exception.class, () -> service.validateRequest(List.of(request)));
        assertThat(exception).hasMessageContaining("Request:1 -- fieldIsInvalidCodelist -- categories[0]: doesntexist code not found in codelist CATEGORY");
    }

    @Test
    void validateRequest_shouldThrowValidationException_whenFieldNameIsEmpty() {
        InformationTypeRequest request = createValidInformationTypeRequest("");

        Exception exception = assertThrows(Exception.class, () -> service.validateRequest(List.of(request)));
        assertThat(exception).hasMessageContaining("Request:1 -- fieldIsNullOrMissing -- name was null or missing");
    }

    @Test
    void validateRequest_shouldThrowValidationException_whenCreatingExistingInformationType() {
        List<InformationTypeRequest> requests = List.of(createValidInformationTypeRequest("Name"));
        InformationType existingInformationType = new InformationType().convertNewFromRequest(requests.get(0), REST);

        when(informationTypeRepository.findByName("Name")).thenReturn(Optional.of(existingInformationType));

        Exception exception = assertThrows(Exception.class, () -> service.validateRequest(requests));
        assertThat(exception).hasMessageContaining("Request:1 -- creatingExistingInformationType --");
        assertThat(exception).hasMessageContaining("The InformationType Name-context already exists and therefore cannot be created");
    }

    @Test
    void validateRequest_shouldThrowValidationException_whenTryingToUpdateNonExistingInformationType() {
        when(informationTypeRepository.findByName("Name")).thenReturn(Optional.empty());

        InformationTypeRequest request = createValidInformationTypeRequest("Name");
        request.setUpdate(true);
        Exception exception = assertThrows(Exception.class, () -> service.validateRequest(List.of(request)));
        assertThat(exception).hasMessageContaining("Request:1 -- updatingNonExistingInformationType --");
        assertThat(exception).hasMessageContaining("The InformationType Name-context does not exist and therefore cannot be updated");
    }

    @Test
    void validateRequest_shouldThrowValidationException_whenNonCorrelatingMaster() {
        InformationTypeRequest request = createValidInformationTypeRequest("Name");
        request.setUpdate(true);

        InformationType existingInformationType = new InformationType().convertNewFromRequest(request, GITHUB);

        when(informationTypeRepository.findByName("Name")).thenReturn(Optional.of(existingInformationType));

        Exception exception = assertThrows(Exception.class, () -> service.validateRequest(List.of(request)));
        assertThat(exception).hasMessageContaining("Request:1 -- nonCorrelatingMaster --");
        assertThat(exception).hasMessageContaining("The InformationType Name-context is mastered in GITHUB and therefore cannot be updated from REST");
    }

    private InformationTypeRequest createValidInformationTypeRequest(String name) {
        return InformationTypeRequest.builder()
                .name(name)
                .context("context")
                .term("term")
                .description("Description")
                .pii("false")
                .sensitivity("aye")
                .categories(List.of("Personalia"))
                .sources(List.of("Skatt"))
                .keywords(List.of("Keywords"))
                .informationTypeMaster(REST)
                .requestIndex(1)
                .build();
    }

}
