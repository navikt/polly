package no.nav.data.polly.policy;

import no.nav.data.polly.codelist.CodelistStub;
import no.nav.data.polly.common.exceptions.ValidationException;
import no.nav.data.polly.common.utils.JsonUtils;
import no.nav.data.polly.informationtype.InformationTypeRepository;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.legalbasis.LegalBasisRequest;
import no.nav.data.polly.policy.domain.PolicyRequest;
import no.nav.data.polly.policy.entities.Policy;
import no.nav.data.polly.policy.repository.PolicyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PolicyServiceTest {

    private static final String INFTYPE_ID_1 = "cd7f037e-374e-4e68-b705-55b61966b2fc";
    private static final String INFTYPE_NAME = "Personalia";
    private static final String LEGALBASISDESCRIPTION = "LegalBasis";
    private static final String PURPOSECODE = "Kontroll";

    @Mock
    private InformationTypeRepository informationTypeRepository;
    @Mock
    private PolicyRepository policyRepository;

    @InjectMocks
    private PolicyService service;

    @BeforeEach
    void setUp() {
        CodelistStub.initializeCodelist();
    }

    @Test
    void shouldValidateInsertRequest() {
        PolicyRequest request = PolicyRequest.builder()
                .informationTypeName(INFTYPE_NAME)
                .legalBases(List.of(LegalBasisRequest.builder().description(LEGALBASISDESCRIPTION).build()))
                .purposeCode(PURPOSECODE)
                .build();
        when(informationTypeRepository.findByName(request.getInformationTypeName())).thenReturn(Optional.of(InformationType.builder().id(UUID.fromString(INFTYPE_ID_1)).build()));
        when(policyRepository.findByInformationTypeIdAndPurposeCode(any(UUID.class), anyString())).thenReturn(List.of());
        service.validateRequests(List.of(request), false);
    }

    @Test
    void shouldThrowAllNullValidationExceptionOnInsert() {
        PolicyRequest request = PolicyRequest.builder().build();
        try {
            service.validateRequests(List.of(request), false);
            fail();
        } catch (ValidationException e) {
            assertEquals(3, e.get().size(), JsonUtils.toJson(e.get()));
            assertEquals("informationTypeName cannot be null", e.get("informationTypeName").getErrorMessage());
            assertEquals("purposeCode cannot be null", e.get("purposeCode").getErrorMessage());
            assertEquals("legalBases cannot be null", e.get("legalBases").getErrorMessage());
        }
    }

    @Test
    void shouldThrowNotFoundValidationExceptionOnInsert() {
        PolicyRequest request = PolicyRequest.builder()
                .informationTypeName(INFTYPE_NAME)
                .legalBases(List.of(LegalBasisRequest.builder().description(LEGALBASISDESCRIPTION).build()))
                .purposeCode("wrong")
                .build();
        when(informationTypeRepository.findByName(request.getInformationTypeName())).thenReturn(Optional.empty());
        try {
            service.validateRequests(List.of(request), false);
            fail();
        } catch (ValidationException e) {
            assertEquals(2, e.get().size(), JsonUtils.toJson(e.get()));
            assertEquals("The purposeCode wrong was not found in the PURPOSE codelist.", e.get("purposeCode").getErrorMessage());
            assertEquals("An informationType with name " + INFTYPE_NAME + " does not exist", e.get("informationTypeName").getErrorMessage());
        }
    }

    @Test
    void shouldThrowAlreadyExistsValidationExceptionOnInsert() {
        PolicyRequest request = PolicyRequest.builder()
                .informationTypeName(INFTYPE_NAME)
                .legalBases(List.of(LegalBasisRequest.builder().description(LEGALBASISDESCRIPTION).build()))
                .purposeCode(PURPOSECODE)
                .build();
        when(informationTypeRepository.findByName(request.getInformationTypeName())).thenReturn(Optional.of(InformationType.builder().id(UUID.fromString(INFTYPE_ID_1)).build()));
        when(policyRepository.findByInformationTypeIdAndPurposeCode(any(UUID.class), anyString()))
                .thenReturn(List.of(Policy.builder().start(LocalDate.now()).end(LocalDate.now()).build()));
        try {
            service.validateRequests(List.of(request), false);
            fail();
        } catch (ValidationException e) {
            assertEquals(1, e.get().size(), JsonUtils.toJson(e.get()));
            assertEquals("A policy combining InformationType Personalia and Purpose Kontroll already exists", e.get("informationTypeAndPurpose").getErrorMessage());
        }
    }

    @Test
    void shouldThrowAllNullValidationExceptionOnUpdate() {
        PolicyRequest request = PolicyRequest.builder().build();
        try {
            service.validateRequests(List.of(request), true);
            fail();
        } catch (ValidationException e) {
            assertEquals(4, e.get().size(), JsonUtils.toJson(e.get()));
            assertEquals("Id is missing for update", e.get("missingIdForUpdate").getErrorMessage());
            assertEquals("informationTypeName cannot be null", e.get("informationTypeName").getErrorMessage());
            assertEquals("purposeCode cannot be null", e.get("purposeCode").getErrorMessage());
            assertEquals("legalBases cannot be null", e.get("legalBases").getErrorMessage());
        }
    }

    @Test
    void shouldThrowNotFoundValidationExceptionOnUpdate() {
        PolicyRequest request = PolicyRequest.builder()
                .id("1-1-1-1-1")
                .informationTypeName(INFTYPE_NAME)
                .legalBases(List.of(LegalBasisRequest.builder().description(LEGALBASISDESCRIPTION).build()))
                .purposeCode("wrong")
                .build();
        when(informationTypeRepository.findByName(request.getInformationTypeName())).thenReturn(Optional.empty());
        when(policyRepository.findById(UUID.fromString(request.getId()))).thenReturn(Optional.of(Policy.builder().purposeCode("wrong").build()));
        try {
            service.validateRequests(List.of(request), true);
            fail();
        } catch (ValidationException e) {
            assertEquals(2, e.get().size(), JsonUtils.toJson(e.get()));
            assertEquals("The purposeCode wrong was not found in the PURPOSE codelist.", e.get("purposeCode").getErrorMessage());
            assertEquals("An informationType with name " + INFTYPE_NAME + " does not exist", e.get("informationTypeName").getErrorMessage());
        }
    }

    @Test
    void shouldThrowWrongPurposecodeOnUpdate() {
        PolicyRequest request = PolicyRequest.builder()
                .id("1-1-1-1-1")
                .informationTypeName(INFTYPE_NAME)
                .legalBases(List.of(LegalBasisRequest.builder().description(LEGALBASISDESCRIPTION).build()))
                .purposeCode(PURPOSECODE)
                .build();
        when(informationTypeRepository.findByName(request.getInformationTypeName())).thenReturn(Optional.of(InformationType.builder().id(UUID.fromString(INFTYPE_ID_1)).build()));
        when(policyRepository.findById(UUID.fromString(request.getId()))).thenReturn(Optional.of(Policy.builder().purposeCode("otherpurpose").build()));
        try {
            service.validateRequests(List.of(request), true);
            fail();
        } catch (ValidationException e) {
            assertEquals(1, e.get().size(), JsonUtils.toJson(e.get()));
            assertEquals("Cannot change purpose from otherpurpose to Kontroll for policy 1-1-1-1-1", e.get("cannotChangePurpose").getErrorMessage());
        }
    }

    @Test
    void shouldNotThrowAlreadyExistsValidationExceptionOnInsert() {
        PolicyRequest request = PolicyRequest.builder()
                .informationTypeName(INFTYPE_NAME)
                .legalBases(List.of(LegalBasisRequest.builder().description(LEGALBASISDESCRIPTION).build()))
                .purposeCode(PURPOSECODE)
                .id("1-1-1-1-1")
                .build();
        when(informationTypeRepository.findByName(request.getInformationTypeName())).thenReturn(Optional.of(InformationType.builder().id(UUID.fromString(INFTYPE_ID_1)).build()));

        service.validateRequests(List.of(request), false);
    }
}
