package no.nav.data.polly.process;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.informationtype.dto.InformationTypeShortResponse;
import no.nav.data.polly.legalbasis.dto.LegalBasisRequest;
import no.nav.data.polly.policy.domain.LegalBasesUse;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.policy.dto.PolicyResponse;
import no.nav.data.polly.process.ProcessReadController.ProcessPage;
import no.nav.data.polly.process.ProcessStateController.ProcessShortPage;
import no.nav.data.polly.process.dto.ProcessCountResponse;
import no.nav.data.polly.process.dto.ProcessRequest;
import no.nav.data.polly.process.dto.ProcessResponse;
import no.nav.data.polly.process.dto.ProcessStateRequest.ProcessField;
import no.nav.data.polly.process.dto.ProcessStateRequest.ProcessState;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class ProcessControllerIT extends IntegrationTestBase {

    @Autowired
    private TestRestTemplate restTemplate;
    @Autowired
    private ProcessService processService;

    @Test
    void getProcess() {
        Policy policy = createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());

        ResponseEntity<ProcessResponse> resp = restTemplate.getForEntity("/process/{id}", ProcessResponse.class, policy.getProcess().getId());

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        ProcessResponse processResponse = resp.getBody();
        assertThat(processResponse).isNotNull();

        // Unimportant date assertion
        assertThat(processResponse.getChangeStamp().getLastModifiedBy()).isNotNull();
        assertThat(processResponse.getChangeStamp().getLastModifiedDate()).isNotNull();
        processResponse.setChangeStamp(null);

        assertThat(processResponse).isEqualTo(processResponseBuilder(policy.getProcess().getId())
                .policy(PolicyResponse.builder()
                        .id(policy.getId())
                        .processId(policy.getProcess().getId())
                        .purposeCode(CodelistService.getCodelistResponse(ListName.PURPOSE, PURPOSE_CODE1))
                        .informationTypeId(createAndSaveInformationType().getId())
                        .informationType(
                                new InformationTypeShortResponse(createAndSaveInformationType().getId(), INFORMATION_TYPE_NAME,
                                        createAndSaveInformationType().getData().sensitivityCode()))
                        .legalBasesUse(LegalBasesUse.DEDICATED_LEGAL_BASES)
                        .subjectCategory(CodelistService.getCodelistResponse(ListName.SUBJECT_CATEGORY, policy.getData().getSubjectCategories().get(0)))
                        .legalBasis(legalBasisResponse())
                        .documentIds(policy.getData().getDocumentIds())
                        .build())
                .build());
    }

    @Test
    void searchProcess() {
        Policy policy = createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());
        ResponseEntity<ProcessPage> resp = restTemplate.getForEntity("/process/search/{name}", ProcessPage.class, policy.getProcess().getName().toLowerCase());

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody()).isNotNull();
        assertThat(resp.getBody().getNumberOfElements()).isEqualTo(1L);
    }

    @Nested
    class State {

        @ParameterizedTest
        @EnumSource(ProcessField.class)
        void processByStateYes(ProcessField field) {
            var p = createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());
            p.getData().setLegalBases(List.of());
            policyRepository.save(p);
            p.getProcess().getData().setLegalBases(List.of());
            p.getProcess().getData().setUsesAllInformationTypes(true);
            processService.save(p.getProcess());

            ResponseEntity<ProcessShortPage> resp = get(field, ProcessState.YES);

            assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(resp.getBody()).isNotNull();
            if (field != ProcessField.MISSING_ART9 && field != ProcessField.MISSING_LEGBAS) {
                assertThat(resp.getBody().getNumberOfElements()).isEqualTo(1L);
            }
        }

        @ParameterizedTest
        @EnumSource(ProcessField.class)
        void processByStateNo(ProcessField field) {
            var p = createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());
            p.getProcess().getData().setUsesAllInformationTypes(false);
            processService.save(p.getProcess());

            ResponseEntity<ProcessShortPage> resp = get(field, ProcessState.NO);

            assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(resp.getBody()).isNotNull();
            assertThat(resp.getBody().getNumberOfElements()).isEqualTo(0L);
        }

        @ParameterizedTest
        @EnumSource(ProcessField.class)
        void processByStateUnknown(ProcessField field) {
            createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());
            ResponseEntity<ProcessShortPage> resp = get(field, ProcessState.UNKNOWN);

            if (field.canBeUnknown) {
                assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
                assertThat(resp.getBody()).isNotNull();
                assertThat(resp.getBody().getNumberOfElements()).isEqualTo(0L);
            } else {
                assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
            }
        }

        private ResponseEntity<ProcessShortPage> get(ProcessField field, ProcessState yes) {
            return restTemplate
                    .getForEntity("/process/state?processField={field}&processState={state}", ProcessShortPage.class, field, yes);
        }

    }

    @Test
    void getAllProcess() {
        Policy policy = createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());
        Policy policy2 = createAndSavePolicy(PURPOSE_CODE1 + 2, createAndSaveInformationType());

        ResponseEntity<ProcessPage> resp = restTemplate.getForEntity("/process", ProcessPage.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        ProcessPage processPage = resp.getBody();
        assertThat(processPage).isNotNull();

        assertThat(processPage.getContent()).hasSize(2);
        processPage.getContent().forEach(p -> p.setChangeStamp(null));
        assertThat(processPage.getContent()).contains(
                processResponseBuilder(policy.getProcess().getId())
                        .name("Auto_" + PURPOSE_CODE1)
                        .purposeCode(PURPOSE_CODE1)
                        .build(),
                processResponseBuilder(policy2.getProcess().getId())
                        .name("Auto_" + PURPOSE_CODE1 + 2)
                        .purposeCode(PURPOSE_CODE1 + 2)
                        .build()
        );
    }

    @Test
    void getForProductTeam() {
        createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());

        ResponseEntity<ProcessPage> resp = restTemplate.getForEntity("/process?productTeam={productTeam}", ProcessPage.class, "teamid1");

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        ProcessPage processPage = resp.getBody();
        assertThat(processPage).isNotNull();

        assertThat(processPage.getContent()).hasSize(1);
    }

    @Test
    void getForProductArea() {
        createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());

        ResponseEntity<ProcessPage> resp = restTemplate.getForEntity("/process?productArea={productArea}", ProcessPage.class, "productarea1");

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        ProcessPage processPage = resp.getBody();
        assertThat(processPage).isNotNull();

        assertThat(processPage.getContent()).hasSize(1);
    }

    @Test
    void getByDocumentId() {
        Policy policy = createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());

        ResponseEntity<ProcessPage> resp = restTemplate.getForEntity("/process?documentId={documentId}", ProcessPage.class,
                policy.getData().getDocumentIds().get(0));

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        ProcessPage processPage = resp.getBody();
        assertThat(processPage).isNotNull();

        assertThat(processPage.getContent()).hasSize(1);
    }

    @Test
    void createProcess() {
        ResponseEntity<ProcessResponse> resp = restTemplate
                .postForEntity("/process", ProcessRequest.builder().name("newprocess").purposeCode("AAP").build(), ProcessResponse.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(resp.getBody()).isNotNull();
        assertThat(resp.getBody().getName()).isEqualTo("newprocess");
    }

    @Test
    void createProcessValidationError() {
        ResponseEntity<String> resp = restTemplate
                .postForEntity("/process", ProcessRequest.builder().name("newprocess").purposeCode("AAP")
                        .legalBases(List.of(LegalBasisRequest.builder().gdpr("6a").nationalLaw("eksisterer-ikke").description("desc").build()))
                        .build(), String.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(resp.getBody()).contains("legalBases[0].nationalLaw: EKSISTERER-IKKE code not found in codelist NATIONAL_LAW");
    }

    @Test
    void createProcessDuplicate() {
        var request = ProcessRequest.builder().name("newprocess").purposeCode("AAP").build();
        ResponseEntity<ProcessResponse> resp = restTemplate.postForEntity("/process", request, ProcessResponse.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        ResponseEntity<String> errorResp = restTemplate.postForEntity("/process", request, String.class);
        assertThat(errorResp.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(errorResp.getBody()).contains("nameAndPurposeExists");
    }

    @Test
    void updateProcess() {
        ResponseEntity<ProcessResponse> resp = restTemplate
                .postForEntity("/process", ProcessRequest.builder().name("newprocess").purposeCode("AAP").build(), ProcessResponse.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(resp.getBody()).isNotNull();

        String id = resp.getBody().getId().toString();
        ProcessRequest update = ProcessRequest.builder().id(id).name("newprocess").purposeCode("AAP").department("dep").build();
        resp = restTemplate.exchange("/process/{id}", HttpMethod.PUT, new HttpEntity<>(update), ProcessResponse.class, id);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody()).isNotNull();
        assertThat(resp.getBody().getDepartment().getCode()).isEqualTo("DEP");
    }

    @Test
    void updateProcessValidationError() {
        ResponseEntity<ProcessResponse> resp = restTemplate
                .postForEntity("/process", ProcessRequest.builder().name("newprocess").purposeCode("AAP").build(), ProcessResponse.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(resp.getBody()).isNotNull();

        String id = resp.getBody().getId().toString();
        ProcessRequest update = ProcessRequest.builder().id(id).name("newprocess").purposeCode("KONTROLL").department("dep").build();
        var errorResp = restTemplate.exchange("/process/{id}", HttpMethod.PUT, new HttpEntity<>(update), String.class, id);
        assertThat(errorResp.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(errorResp.getBody()).isNotNull();
        assertThat(errorResp.getBody()).contains("Cannot change purpose from AAP to KONTROLL");
    }

    @Test
    void countPurposes() {
        createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());
        createAndSavePolicy(PURPOSE_CODE1 + 2, createAndSaveInformationType());

        ResponseEntity<ProcessCountResponse> resp = restTemplate.getForEntity("/process/count?purpose", ProcessCountResponse.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        ProcessCountResponse purposeResponse = resp.getBody();
        assertThat(purposeResponse).isNotNull();

        assertThat(purposeResponse).isEqualTo(new ProcessCountResponse(Map.of(PURPOSE_CODE1, 1L, PURPOSE_CODE1 + 2, 1L, PURPOSE_CODE2, 0L)));
    }

    @Test
    void countDepartment() {
        createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());

        ResponseEntity<ProcessCountResponse> resp = restTemplate.getForEntity("/process/count?department", ProcessCountResponse.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        ProcessCountResponse purposeResponse = resp.getBody();
        assertThat(purposeResponse).isNotNull();

        assertThat(purposeResponse).isEqualTo(new ProcessCountResponse(Map.of("AOT", 0L, "DEP", 1L)));
    }

    @Test
    void countSubDepartment() {
        createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());

        ResponseEntity<ProcessCountResponse> resp = restTemplate.getForEntity("/process/count?subDepartment", ProcessCountResponse.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        ProcessCountResponse purposeResponse = resp.getBody();
        assertThat(purposeResponse).isNotNull();

        assertThat(purposeResponse).isEqualTo(new ProcessCountResponse(Map.of("PEN", 0L, "SUBDEP", 1L)));
    }

    @Test
    void countTeam() {
        createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());

        ResponseEntity<ProcessCountResponse> resp = restTemplate.getForEntity("/process/count?team", ProcessCountResponse.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        ProcessCountResponse purposeResponse = resp.getBody();
        assertThat(purposeResponse).isNotNull();

        assertThat(purposeResponse).isEqualTo(new ProcessCountResponse(Map.of("teamid1", 1L)));
    }

}