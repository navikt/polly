package no.nav.data.polly.policy;

import no.nav.data.common.exceptions.ValidationException;
import no.nav.data.common.utils.JsonUtils;
import no.nav.data.polly.codelist.CodelistStub;
import no.nav.data.polly.informationtype.InformationTypeRepository;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.legalbasis.dto.LegalBasisRequest;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.policy.domain.PolicyRepository;
import no.nav.data.polly.policy.dto.PolicyRequest;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PolicyServiceTest {

    private static final String PROCESS_ID_1 = "fc9afeb8-4f2b-4c41-aa0f-414c9cd942f3";
    private static final String INFTYPE_ID_1 = "cd7f037e-374e-4e68-b705-55b61966b2fc";
    private static final String LEGALBASISDESCRIPTION = "LegalBasis";
    private static final String PURPOSECODE = "Kontroll";

    @Mock
    private ProcessRepository processRepository;
    @Mock
    private InformationTypeRepository informationTypeRepository;
    @Mock
    private PolicyRepository policyRepository;

    @InjectMocks
    private PolicyService service;

    @BeforeEach
    void setUp() {
        CodelistStub.initializeCodelist();
        lenient().when(processRepository.findById(UUID.fromString(PROCESS_ID_1))).thenReturn(Optional.of(Process.builder().id(UUID.fromString(PROCESS_ID_1)).build()));
        lenient().when(informationTypeRepository.findById(UUID.fromString(INFTYPE_ID_1)))
                .thenReturn(Optional.of(InformationType.builder().id(UUID.fromString(INFTYPE_ID_1)).build()));
    }

    @Test
    void shouldValidateInsertRequest() {
        PolicyRequest request = PolicyRequest.builder()
                .processId(PROCESS_ID_1)
                .subjectCategory("Bruker")
                .informationTypeId(INFTYPE_ID_1)
                .legalBases(List.of(LegalBasisRequest.builder().gdpr("6e").description(LEGALBASISDESCRIPTION).build()))
                .purposeCode(PURPOSECODE)
                .build();
        service.validateRequests(List.of(request), false);
    }

    @Test
    void shouldThrowAllNullValidationExceptionOnInsert() {
        PolicyRequest request = PolicyRequest.builder().build();
        try {
            service.validateRequests(List.of(request), false);
            fail();
        } catch (ValidationException e) {
            assertEquals(4, e.get().size(), JsonUtils.toJson(e.get()));
            assertThat(e.getMessage()).contains("informationTypeId was null or missing");
            assertThat(e.getMessage()).contains("processId was null or missing");
            assertThat(e.getMessage()).contains("purposeCode was null or missing");
            assertThat(e.getMessage()).contains("subjectCategories was null or missing");
        }
    }

    @Test
    void shouldThrowNotFoundValidationExceptionOnInsert() {
        PolicyRequest request = PolicyRequest.builder()
                .processId(PROCESS_ID_1)
                .informationTypeId(INFTYPE_ID_1)
                .subjectCategory("Bruker")
                .legalBases(List.of(LegalBasisRequest.builder().gdpr("ART61A").description(LEGALBASISDESCRIPTION).build()))
                .purposeCode("wrong")
                .build();
        when(processRepository.findById(UUID.fromString(PROCESS_ID_1))).thenReturn(Optional.empty());
        when(informationTypeRepository.findById(UUID.fromString(INFTYPE_ID_1))).thenReturn(Optional.empty());
        try {
            service.validateRequests(List.of(request), false);
            fail();
        } catch (ValidationException e) {
            assertThat(e.getMessage()).contains("purposeCode: WRONG code not found in codelist PURPOSE");
            assertThat(e.getMessage()).contains("An InformationType with id " + INFTYPE_ID_1 + " does not exist");
        }
    }

    @Test
    void shouldThrowAllNullValidationExceptionOnUpdate() {
        PolicyRequest request = PolicyRequest.builder().build();
        try {
            service.validateRequests(List.of(request), true);
            fail();
        } catch (ValidationException e) {
            assertAll(
                    () -> assertThat(e.getMessage()).contains("Id is missing for update"),
                    () -> assertThat(e.getMessage()).contains("informationTypeId was null or missing"),
                    () -> assertThat(e.getMessage()).contains("purposeCode was null or missing"),
                    () -> assertThat(e.getMessage()).contains("processId was null or missing")
            );
        }
    }

    @Test
    void shouldThrowNotFoundValidationExceptionOnUpdate() {
        PolicyRequest request = PolicyRequest.builder()
                .id("1-1-1-1-1")
                .processId(PROCESS_ID_1)
                .subjectCategory("BRUKER")
                .informationTypeId(INFTYPE_ID_1)
                .legalBases(List.of(LegalBasisRequest.builder().gdpr("ART61A").description(LEGALBASISDESCRIPTION).build()))
                .purposeCode("WRONG")
                .build();
        when(informationTypeRepository.findById(UUID.fromString(INFTYPE_ID_1))).thenReturn(Optional.empty());
        when(processRepository.findById(UUID.fromString(PROCESS_ID_1))).thenReturn(Optional.empty());
        when(policyRepository.findById(UUID.fromString(request.getId()))).thenReturn(Optional.of(Policy.builder().purposeCode("WRONG").build()));
        try {
            service.validateRequests(List.of(request), true);
            fail();
        } catch (ValidationException e) {
            assertEquals(3, e.get().size(), JsonUtils.toJson(e.get()));
            assertThat(e.getMessage()).contains("purposeCode: WRONG code not found in codelist PURPOSE");
            assertThat(e.getMessage()).contains("An InformationType with id " + INFTYPE_ID_1 + " does not exist");
            assertThat(e.getMessage()).contains("A Process with id " + PROCESS_ID_1 + " does not exist");
        }
    }

    @Test
    void shouldThrowWrongPurposecodeOnUpdate() {
        PolicyRequest request = PolicyRequest.builder()
                .processId(PROCESS_ID_1)
                .id("1-1-1-1-1")
                .subjectCategory("Bruker")
                .informationTypeId(INFTYPE_ID_1)
                .legalBases(List.of(LegalBasisRequest.builder().gdpr("ART61A").description(LEGALBASISDESCRIPTION).build()))
                .purposeCode(PURPOSECODE)
                .build();
        when(processRepository.findById(UUID.fromString(PROCESS_ID_1))).thenReturn(Optional.of(Process.builder().id(UUID.fromString(PROCESS_ID_1)).build()));
        when(informationTypeRepository.findById(UUID.fromString(INFTYPE_ID_1))).thenReturn(Optional.of(InformationType.builder().id(UUID.fromString(INFTYPE_ID_1)).build()));
        when(policyRepository.findById(UUID.fromString(request.getId()))).thenReturn(Optional.of(Policy.builder().purposeCode("OTHERPURPOSE").build()));
        try {
            service.validateRequests(List.of(request), true);
            fail();
        } catch (ValidationException e) {
            assertEquals(1, e.get().size(), JsonUtils.toJson(e.get()));
            assertThat(e.getMessage()).contains("Cannot change purpose from OTHERPURPOSE to KONTROLL for policy 1-1-1-1-1");
        }
    }

    @Test
    void shouldNotThrowAlreadyExistsValidationExceptionOnInsert() {
        PolicyRequest request = PolicyRequest.builder()
                .processId(PROCESS_ID_1)
                .subjectCategory("Bruker")
                .informationTypeId(INFTYPE_ID_1)
                .legalBases(List.of(LegalBasisRequest.builder().gdpr("ART61A").description(LEGALBASISDESCRIPTION).build()))
                .purposeCode(PURPOSECODE)
                .build();
        when(processRepository.findById(UUID.fromString(PROCESS_ID_1))).thenReturn(Optional.of(Process.builder().id(UUID.fromString(PROCESS_ID_1)).build()));
        when(informationTypeRepository.findById(UUID.fromString(INFTYPE_ID_1))).thenReturn(Optional.of(InformationType.builder().id(UUID.fromString(INFTYPE_ID_1)).build()));

        service.validateRequests(List.of(request), false);
    }
}
