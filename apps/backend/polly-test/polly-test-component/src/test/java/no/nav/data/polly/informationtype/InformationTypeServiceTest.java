package no.nav.data.polly.informationtype;

import no.nav.data.polly.codelist.CodelistStub;
import no.nav.data.polly.common.exceptions.ValidationException;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.dto.InformationTypeRequest;
import no.nav.data.polly.term.domain.Term;
import no.nav.data.polly.term.domain.TermRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static no.nav.data.polly.informationtype.domain.InformationTypeMaster.GITHUB;
import static no.nav.data.polly.informationtype.domain.InformationTypeMaster.REST;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
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
        InformationTypeRequest request = createValidInformationTypeUpdateRequest();
        when(informationTypeRepository.findAllById(List.of(request.getIdAsUUID()))).thenReturn(Collections.singletonList(new InformationType()));

        service.updateAll(List.of(request));
        verify(informationTypeRepository, times(1)).saveAll(anyList());
    }

    @Test
    void validateRequest_shouldValidateWithoutAnyProcessing_whenListOfRequestsIsNull() {
        service.validateRequest(null, false, null);
    }

    @Test
    void validateRequest_shouldValidateWithoutAnyProcessing_whenListOfRequestsIsEmpty() {
        List<InformationTypeRequest> requests = Collections.emptyList();
        service.validateRequest(requests, false, null);
    }

    @Test
    void validateRequest_shouldThrowValidationException_withDuplicatedElementInRequest() {
        InformationTypeRequest name1 = createValidInformationTypeRequest("Name1");
        InformationTypeRequest name2 = createValidInformationTypeRequest("Name2");

        var requests = new ArrayList<>(List.of(name1, name2, name1));

        Exception exception = assertThrows(ValidationException.class, () -> service.validateRequest(requests, false, REST));
        assertThat(exception)
                .hasMessageContaining("Request:3 -- DuplicateElement -- The InformationType Name1 is not unique because it has already been used in this request (see request:1)");
    }

    @Test
    void validateRequest_shouldThrowValidationException_withChangeNameToAlreadyExistRequest() {
        InformationTypeRequest request = createValidInformationTypeUpdateRequest();
        InformationType existingInformationTypeByName = new InformationType().convertNewFromRequest(createValidInformationTypeRequest("Name"), REST);
        InformationType existingInformationTypeById = new InformationType().convertNewFromRequest(createValidInformationTypeRequest("Name0"), REST);

        when(informationTypeRepository.findById(request.getIdAsUUID())).thenReturn(Optional.of(existingInformationTypeById));
        when(informationTypeRepository.findByName("Name")).thenReturn(Optional.of(existingInformationTypeByName));

        Exception exception = assertThrows(ValidationException.class, () -> service.validateRequest(List.of(request), true, REST));
        assertThat(exception).hasMessageContaining("Request:1 -- nameAlreadyExistsNameChange -- Cannot change name, InformationType Name already exists");
    }

    @Test
    void validateRequest_shouldThrowValidationException_withDuplicatedIdentifyingFieldsInRequest() {
        InformationTypeRequest name1 = createValidInformationTypeRequest("Name1");
        InformationTypeRequest name2 = createValidInformationTypeRequest("Name2");
        InformationTypeRequest name3 = createValidInformationTypeRequest("Name1");
        name3.setDescription("Not equal object as the request1");

        Exception exception = assertThrows(ValidationException.class, () -> service.validateRequest(List.of(name1, name2, name3), false, REST));
        assertThat(exception).hasMessageContaining("Name1 -- DuplicatedIdentifyingFields -- Multiple elements in this request are using the same unique fields (Name1)");
    }

    @Test
    void validateRequest_shouldThrowValidationException_whenFieldNameIsNull() {
        Exception exception = assertThrows(ValidationException.class, () -> service.validateRequest(List.of(createValidInformationTypeRequest(null)), false, REST));
        assertThat(exception).hasMessageContaining("Request:1 -- fieldIsNullOrMissing -- name was null or missing");
    }

    @Test
    void validateRequest_shouldThrowValidationException_whenFieldCategoriesInvalid() {
        InformationTypeRequest request = createValidInformationTypeRequest("Name1");
        request.setCategories(List.of("doesntexist"));

        Exception exception = assertThrows(ValidationException.class, () -> service.validateRequest(List.of(request), false, REST));
        assertThat(exception).hasMessageContaining("Request:1 -- fieldIsInvalidCodelist -- categories[0]: doesntexist code not found in codelist CATEGORY");
    }

    @Test
    void validateRequest_shouldThrowValidationException_whenFieldNameIsEmpty() {
        InformationTypeRequest request = createValidInformationTypeRequest("");

        Exception exception = assertThrows(ValidationException.class, () -> service.validateRequest(List.of(request), false, REST));
        assertThat(exception).hasMessageContaining("Request:1 -- fieldIsNullOrMissing -- name was null or missing");
    }

    @Test
    void validateRequest_shouldThrowValidationException_whenCreatingExistingInformationType() {
        InformationTypeRequest request = createValidInformationTypeRequest("Name");
        InformationType existingInformationType = new InformationType().convertNewFromRequest(request, REST);

        when(informationTypeRepository.findByName("Name")).thenReturn(Optional.of(existingInformationType));

        Exception exception = assertThrows(ValidationException.class, () -> service.validateRequest(List.of(request), false, REST));
        assertThat(exception).hasMessageContaining("Request:1 -- nameAlreadyExists -- The InformationType Name already exists");
    }

    @Test
    void validateRequest_shouldThrowValidationException_whenTryingToUpdateNonExistingInformationType() {
        when(informationTypeRepository.findById(any())).thenReturn(Optional.empty());

        InformationTypeRequest request = createValidInformationTypeUpdateRequest();
        Exception exception = assertThrows(ValidationException.class, () -> service.validateRequest(List.of(request), true, REST));
        assertThat(exception).hasMessageContaining("Request:1 -- updatingNonExistingInformationType --");
        assertThat(exception).hasMessageContaining("The InformationType Name does not exist and therefore cannot be updated");
    }

    @Test
    void validateRequest_shouldThrowValidationException_whenNonCorrelatingMaster() {
        InformationTypeRequest request = createValidInformationTypeUpdateRequest();

        InformationType existingInformationType = new InformationType().convertNewFromRequest(request, GITHUB);

        when(informationTypeRepository.findById(request.getIdAsUUID())).thenReturn(Optional.of(existingInformationType));

        Exception exception = assertThrows(ValidationException.class, () -> service.validateRequest(List.of(request), true, REST));
        assertThat(exception).hasMessageContaining("Request:1 -- nonCorrelatingMaster --");
        assertThat(exception).hasMessageContaining("The InformationType Name is mastered in GITHUB and therefore cannot be updated from REST");
    }

    private InformationTypeRequest createValidInformationTypeUpdateRequest() {
        InformationTypeRequest req = createValidInformationTypeRequest("Name");
        req.setId(UUID.randomUUID().toString());
        return req;
    }

    private InformationTypeRequest createValidInformationTypeRequest(String name) {
        return InformationTypeRequest.builder()
                .name(name)
                .term("term")
                .description("Description")
                .pii("false")
                .sensitivity("Personopplysning")
                .categories(List.of("Personalia"))
                .sources(List.of("Skatt"))
                .keywords(List.of("Keywords"))
                .requestIndex(1)
                .navMaster("TPS")
                .build();
    }

}
