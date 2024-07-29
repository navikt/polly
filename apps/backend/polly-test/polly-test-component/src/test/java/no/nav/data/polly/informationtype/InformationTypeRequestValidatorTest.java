package no.nav.data.polly.informationtype;

import no.nav.data.common.exceptions.ValidationException;
import no.nav.data.polly.codelist.CodelistStub;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.dto.InformationTypeRequest;
import no.nav.data.polly.informationtype.dto.InformationTypeRequestValidator;
import no.nav.data.polly.term.TermService;
import no.nav.data.polly.term.domain.PollyTerm;
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

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class InformationTypeRequestValidatorTest {

    @Mock
    private InformationTypeRepository informationTypeRepository;
    @Mock
    private TermService termService;

    @InjectMocks
    private InformationTypeRequestValidator requestValidator;

    @BeforeEach
    void setUp() {
        CodelistStub.initializeCodelist();
        lenient().when(termService.getTerm("term")).thenReturn(Optional.of(new PollyTerm()));
    }

    @Test
    void shouldValidateWithoutAnyProcessing_whenListOfRequestsIsNull() {
        requestValidator.validateRequest(null, false);
    }

    @Test
    void shouldValidateWithoutAnyProcessing_whenListOfRequestsIsEmpty() {
        List<InformationTypeRequest> requests = Collections.emptyList();
        requestValidator.validateRequest(requests, false);
    }

    @Test
    void shouldThrowValidationException_withDuplicatedElementInRequest() {
        InformationTypeRequest name1 = createValidInformationTypeRequest("Name1");
        InformationTypeRequest name2 = createValidInformationTypeRequest("Name2");

        var requests = new ArrayList<>(List.of(name1, name2, name1));

        Exception exception = assertThrows(ValidationException.class, () -> requestValidator.validateRequest(requests, false));
        assertThat(exception)
        .hasMessageContaining("Request:3 -- DuplicateElement -- The InformationType Name1 is not unique because it has already been used in this request (see request:1)");
    }

    @Test
    void shouldThrowValidationException_withChangeNameToAlreadyExistRequest() {
        InformationTypeRequest request = createValidInformationTypeUpdateRequest();
        InformationType existingInformationTypeByName = new InformationType().convertNewFromRequest(createValidInformationTypeRequest("Name"));
        InformationType existingInformationTypeById = new InformationType().convertNewFromRequest(createValidInformationTypeRequest("Name0"));

        when(informationTypeRepository.findById(request.getIdAsUUID())).thenReturn(Optional.of(existingInformationTypeById));
        when(informationTypeRepository.findByName("Name")).thenReturn(Optional.of(existingInformationTypeByName));

        Exception exception = assertThrows(ValidationException.class, () -> requestValidator.validateRequest(List.of(request), true));
        assertThat(exception).hasMessageContaining("Request:1 -- nameAlreadyExistsNameChange -- Cannot change name, InformationType Name already exists");
    }

    @Test
    void shouldThrowValidationException_withDuplicatedIdentifyingFieldsInRequest() {
        InformationTypeRequest name1 = createValidInformationTypeRequest("Name1");
        InformationTypeRequest name2 = createValidInformationTypeRequest("Name2");
        InformationTypeRequest name3 = createValidInformationTypeRequest("Name1");
        name3.setDescription("Not equal object as the request1");

        Exception exception = assertThrows(ValidationException.class, () -> requestValidator.validateRequest(List.of(name1, name2, name3), false));
        assertThat(exception).hasMessageContaining("Name1 -- DuplicatedIdentifyingFields -- Multiple elements in this request are using the same unique fields (Name1)");
    }

    @Test
    void shouldThrowValidationException_whenFieldNameIsNull() {
        Exception exception = assertThrows(ValidationException.class, () -> requestValidator.validateRequest(List.of(createValidInformationTypeRequest(null)), false));
        assertThat(exception).hasMessageContaining("Request:1 -- fieldIsNullOrMissing -- name was null or missing");
    }

    @Test
    void shouldThrowValidationException_whenFieldCategoriesInvalid() {
        InformationTypeRequest request = createValidInformationTypeRequest("Name1");
        request.setCategories(List.of("doesntexist"));

        Exception exception = assertThrows(ValidationException.class, () -> requestValidator.validateRequest(List.of(request), false));
        assertThat(exception).hasMessageContaining("Request:1 -- fieldIsInvalidCodelist -- categories[0]: DOESNTEXIST code not found in codelist CATEGORY");
    }

    @Test
    void shouldThrowValidationException_whenFieldNameIsEmpty() {
        InformationTypeRequest request = createValidInformationTypeRequest("");

        Exception exception = assertThrows(ValidationException.class, () -> requestValidator.validateRequest(List.of(request), false));
        assertThat(exception).hasMessageContaining("Request:1 -- fieldIsNullOrMissing -- name was null or missing");
    }

    @Test
    void shouldThrowValidationException_whenCreatingExistingInformationType() {
        InformationTypeRequest request = createValidInformationTypeRequest("Name");
        InformationType existingInformationType = new InformationType().convertNewFromRequest(request);

        when(informationTypeRepository.findByName("Name")).thenReturn(Optional.of(existingInformationType));

        Exception exception = assertThrows(ValidationException.class, () -> requestValidator.validateRequest(List.of(request), false));
        assertThat(exception).hasMessageContaining("Request:1 -- nameAlreadyExists -- The InformationType Name already exists");
    }

    @Test
    void shouldThrowValidationException_whenTryingToUpdateNonExistingInformationType() {
        when(informationTypeRepository.findById(any())).thenReturn(Optional.empty());

        InformationTypeRequest request = createValidInformationTypeUpdateRequest();
        Exception exception = assertThrows(ValidationException.class, () -> requestValidator.validateRequest(List.of(request), true));
        assertThat(exception).hasMessageContaining("Request:1 -- updatingNonExistingInformationType --");
        assertThat(exception).hasMessageContaining("The InformationType Name does not exist and therefore cannot be updated");
    }

    @Test
    void shouldThrowValidationException_whenInvalidTerm() {
        InformationTypeRequest request = createValidInformationTypeRequest("name");
        request.setTerm("invalidterm");
        Exception exception = assertThrows(ValidationException.class, () -> requestValidator.validateRequest(List.of(request), false));
        assertThat(exception).hasMessageContaining("Request:1 -- termDoesNotExist -- The Term invalidterm doesnt exist");
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
                .sensitivity("pol")
                .orgMaster("TPS")
                .categories(List.of("Personalia"))
                .sources(List.of("Skatt"))
                .keywords(List.of("Keywords"))
                .requestIndex(1)
                .build();
    }

}
