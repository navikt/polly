package no.nav.data.polly.policy;

import no.nav.data.polly.codelist.CodelistStub;
import no.nav.data.polly.common.exceptions.ValidationException;
import no.nav.data.polly.common.utils.JsonUtils;
import no.nav.data.polly.informationtype.InformationTypeRepository;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.legalbasis.dto.LegalBasisRequest;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.policy.domain.PolicyRepository;
import no.nav.data.polly.policy.dto.PolicyRequest;
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

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;
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
                .process("process")
                .subjectCategory("Bruker")
                .informationTypeName(INFTYPE_NAME)
                .legalBases(List.of(LegalBasisRequest.builder().gdpr("6e").description(LEGALBASISDESCRIPTION).build()))
                .purposeCode(PURPOSECODE)
                .build();
        when(informationTypeRepository.findByName(request.getInformationTypeName())).thenReturn(Optional.of(InformationType.builder().id(UUID.fromString(INFTYPE_ID_1)).build()));
        when(policyRepository.findByInformationTypeIdAndPurposeCodeAndSubjectCategoryAndProcessName(any(UUID.class), anyString(), anyString(), anyString())).thenReturn(List.of());
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
            assertThat(e.getMessage()).contains("informationTypeName was null or missing");
            assertThat(e.getMessage()).contains("purposeCode was null or missing");
            assertThat(e.getMessage()).contains("process was null or missing");
            assertThat(e.getMessage()).contains("subjectCategory was null or missing");
        }
    }

    @Test
    void shouldThrowNotFoundValidationExceptionOnInsert() {
        PolicyRequest request = PolicyRequest.builder()
                .process("process")
                .informationTypeName(INFTYPE_NAME)
                .subjectCategory("Bruker")
                .legalBases(List.of(LegalBasisRequest.builder().gdpr("ART61A").description(LEGALBASISDESCRIPTION).build()))
                .purposeCode("wrong")
                .build();
        when(informationTypeRepository.findByName(request.getInformationTypeName())).thenReturn(Optional.empty());
        try {
            service.validateRequests(List.of(request), false);
            fail();
        } catch (ValidationException e) {
            assertThat(e.getMessage()).contains("purposeCode: WRONG code not found in codelist PURPOSE");
            assertThat(e.getMessage()).contains("An InformationType with name " + INFTYPE_NAME + " does not exist");
        }
    }

    @Test
    void shouldThrowAlreadyExistsValidationExceptionOnInsert() {
        PolicyRequest request = PolicyRequest.builder()
                .process("process")
                .informationTypeName(INFTYPE_NAME)
                .subjectCategory("Bruker")
                .legalBases(List.of(LegalBasisRequest.builder().gdpr("ART61A").description(LEGALBASISDESCRIPTION).build()))
                .purposeCode(PURPOSECODE)
                .build();
        when(informationTypeRepository.findByName(request.getInformationTypeName())).thenReturn(Optional.of(InformationType.builder().id(UUID.fromString(INFTYPE_ID_1)).build()));
        when(policyRepository.findByInformationTypeIdAndPurposeCodeAndSubjectCategoryAndProcessName(any(UUID.class), anyString(), anyString(), anyString()))
                .thenReturn(List.of(Policy.builder().start(LocalDate.now()).end(LocalDate.now()).build()));
        try {
            service.validateRequests(List.of(request), false);
            fail();
        } catch (ValidationException e) {
            assertEquals(1, e.get().size(), JsonUtils.toJson(e.get()));
            assertThat(e.getMessage()).contains("A policy combining InformationType: Personalia and Process: process Purpose: KONTROLL SubjectCategory: BRUKER already exists");
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
                    () -> assertThat(e.getMessage()).contains("informationTypeName was null or missing"),
                    () -> assertThat(e.getMessage()).contains("purposeCode was null or missing"),
                    () -> assertThat(e.getMessage()).contains("process was null or missing")
            );
        }
    }

    @Test
    void shouldThrowNotFoundValidationExceptionOnUpdate() {
        PolicyRequest request = PolicyRequest.builder()
                .id("1-1-1-1-1")
                .process("process")
                .subjectCategory("BRUKER")
                .informationTypeName(INFTYPE_NAME)
                .legalBases(List.of(LegalBasisRequest.builder().gdpr("ART61A").description(LEGALBASISDESCRIPTION).build()))
                .purposeCode("WRONG")
                .build();
        when(informationTypeRepository.findByName(request.getInformationTypeName())).thenReturn(Optional.empty());
        when(policyRepository.findById(UUID.fromString(request.getId()))).thenReturn(Optional.of(Policy.builder().purposeCode("WRONG").build()));
        try {
            service.validateRequests(List.of(request), true);
            fail();
        } catch (ValidationException e) {
            assertEquals(2, e.get().size(), JsonUtils.toJson(e.get()));
            assertThat(e.getMessage()).contains("purposeCode: WRONG code not found in codelist PURPOSE");
            assertThat(e.getMessage()).contains("An InformationType with name " + INFTYPE_NAME + " does not exist");
        }
    }

    @Test
    void shouldThrowWrongPurposecodeOnUpdate() {
        PolicyRequest request = PolicyRequest.builder()
                .process("process")
                .id("1-1-1-1-1")
                .subjectCategory("Bruker")
                .informationTypeName(INFTYPE_NAME)
                .legalBases(List.of(LegalBasisRequest.builder().gdpr("ART61A").description(LEGALBASISDESCRIPTION).build()))
                .purposeCode(PURPOSECODE)
                .build();
        when(informationTypeRepository.findByName(request.getInformationTypeName())).thenReturn(Optional.of(InformationType.builder().id(UUID.fromString(INFTYPE_ID_1)).build()));
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
                .process("process")
                .subjectCategory("Bruker")
                .informationTypeName(INFTYPE_NAME)
                .legalBases(List.of(LegalBasisRequest.builder().gdpr("ART61A").description(LEGALBASISDESCRIPTION).build()))
                .purposeCode(PURPOSECODE)
                .build();
        when(informationTypeRepository.findByName(request.getInformationTypeName())).thenReturn(Optional.of(InformationType.builder().id(UUID.fromString(INFTYPE_ID_1)).build()));

        service.validateRequests(List.of(request), false);
    }
}
