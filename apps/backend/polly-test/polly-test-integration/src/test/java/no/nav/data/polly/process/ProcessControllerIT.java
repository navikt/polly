package no.nav.data.polly.process;

import com.nimbusds.jwt.JWTClaimsSet.Builder;
import no.nav.data.common.security.azure.AzureConstants;
import no.nav.data.common.security.azure.AzureUserInfo;
import no.nav.data.common.utils.MdcUtils;
import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.codelist.CodelistStaticService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.informationtype.dto.InformationTypeShortResponse;
import no.nav.data.polly.legalbasis.dto.LegalBasisRequest;
import no.nav.data.polly.policy.domain.LegalBasesUse;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.policy.dto.PolicyRequest;
import no.nav.data.polly.policy.dto.PolicyResponse;
import no.nav.data.polly.policy.rest.PolicyRestController.PolicyPage;
import no.nav.data.polly.process.ProcessReadController.LastEditedPage;
import no.nav.data.polly.process.ProcessReadController.ProcessPage;
import no.nav.data.polly.process.ProcessStateController.ProcessShortPage;
import no.nav.data.polly.process.dto.ProcessCountResponse;
import no.nav.data.polly.process.dto.ProcessRequest;
import no.nav.data.polly.process.dto.ProcessResponse;
import no.nav.data.polly.process.dto.ProcessStateRequest.ProcessField;
import no.nav.data.polly.process.dto.ProcessStateRequest.ProcessState;
import no.nav.data.polly.process.dto.sub.AffiliationRequest;
import no.nav.data.polly.test.TestConfig.MockFilter;
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
import org.springframework.security.oauth2.core.oidc.StandardClaimNames;

import java.util.List;
import java.util.Map;
import java.util.Set;

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
                        .purpose(CodelistStaticService.getCodelistResponse(ListName.PURPOSE, PURPOSE_CODE1))
                        .informationTypeId(createAndSaveInformationType().getId())
                        .informationType(
                                new InformationTypeShortResponse(createAndSaveInformationType().getId(), INFORMATION_TYPE_NAME,
                                        createAndSaveInformationType().getData().sensitivityCode()))
                        .legalBasesUse(LegalBasesUse.DEDICATED_LEGAL_BASES)
                        .subjectCategory(CodelistStaticService.getCodelistResponse(ListName.SUBJECT_CATEGORY, policy.getData().getSubjectCategories().get(0)))
                        .legalBasis(legalBasisResponse())
                        .documentIds(policy.getData().getDocumentIds())
                        .build())
                .build());
    }

    @Test
    void getProcessByNumber() {
        Policy policy = createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());

        ResponseEntity<ProcessResponse> resp = restTemplate.getForEntity("/process/{id}", ProcessResponse.class, policy.getProcess().getData().getNumber());

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        ProcessResponse processResponse = resp.getBody();
        assertThat(processResponse).isNotNull();
        assertThat(processResponse.getId()).isEqualTo(policy.getProcess().getId());
    }

    @Test
    void getProcessShortById() {
        Policy policy = createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());
        Policy policy2 = createAndSavePolicy(PURPOSE_CODE2, createAndSaveInformationType());

        ResponseEntity<ProcessPage> resp = restTemplate
                .postForEntity("/process/shortbyid",
                        List.of(policy.getProcess().getId(), policy2.getProcess().getId()),
                        ProcessPage.class
                );

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        ProcessPage respBody = resp.getBody();
        assertThat(respBody).isNotNull();
        assertThat(respBody.getContent()).hasSize(2);
    }

    @Test
    void getLastEdits() {
        createAndSaveProcess(PURPOSE_CODE1);

        AzureUserInfo userInfo = new AzureUserInfo(new Builder().claim(StandardClaimNames.NAME, "Name Nameson").claim(AzureConstants.IDENT_CLAIM, "S123456").build(), Set.of());

        MdcUtils.setUser(userInfo.getIdentName());
        for (int i = 0; i < 40; i++) {
            createAndSaveProcess(PURPOSE_CODE2 + i);
        }
        var deleted = createAndSaveProcess("deleted");
        var deleted2 = createAndSaveProcess("deleted2");
        processService.deleteById(deleted.getId());
        MdcUtils.clearUser();
        processService.deleteById(deleted2.getId());

        MockFilter.setUser(userInfo);
        ResponseEntity<LastEditedPage> resp = restTemplate.getForEntity("/process/myedits", LastEditedPage.class);
        MockFilter.clearUser();

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody()).isNotNull();
        assertThat(resp.getBody().getNumberOfElements()).isEqualTo(20L);
        assertThat(resp.getBody().getContent().get(0).getTime()).isNotNull();
        for (int i = 0; i < 20; i++) {
            assertThat(resp.getBody().getContent().get(i).getProcess().getPurposes().get(0).getCode()).isEqualTo(PURPOSE_CODE2 + (39 - i));
        }
    }

    @Test
    void searchProcess() {
        Policy policy = createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());
        ResponseEntity<ProcessPage> resp = restTemplate.getForEntity("/process/search/{name}", ProcessPage.class, policy.getProcess().getData().getName().toLowerCase());

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
            if (trueAlerts(field)) {
                assertThat(resp.getBody().getNumberOfElements()).isEqualTo(1L);
            } else {
                assertThat(resp.getBody().getNumberOfElements()).isEqualTo(0L);
            }
        }

        private boolean trueAlerts(ProcessField field) {
            return field != ProcessField.MISSING_ARTICLE_9 &&
                    field != ProcessField.MISSING_LEGAL_BASIS &&
                    field != ProcessField.EXCESS_INFO &&
                    field != ProcessField.RETENTION_DATA &&
                    field != ProcessField.DPIA_REFERENCE_MISSING;
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

            assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(resp.getBody()).isNotNull();
            assertThat(resp.getBody().getNumberOfElements()).isEqualTo(0L);
        }

        private ResponseEntity<ProcessShortPage> get(ProcessField field, ProcessState yes) {
            return restTemplate
                    .getForEntity("/process/state?processField={field}&processState={state}", ProcessShortPage.class, field, yes);
        }

    }

    @Nested
    class GetAll {

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
                            .purposes(List.of(CodelistStaticService.getCodelistResponse(ListName.PURPOSE, PURPOSE_CODE1)))
                            .build(),
                    processResponseBuilder(policy2.getProcess().getId())
                            .name("Auto_" + PURPOSE_CODE1 + 2)
                            .purposes(List.of(CodelistStaticService.getCodelistResponse(ListName.PURPOSE, PURPOSE_CODE1 + 2)))
                            .build()
            );
            assertThat(processPage.getContent().get(0).getNumber()).isEqualTo(policy2.getProcess().getData().getNumber());
        }

        @Test
        void getForProductTeam() {
            createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());

            ResponseEntity<ProcessPage> resp = restTemplate.getForEntity("/process?productTeam={productTeam}", ProcessPage.class, "teamid1");

            assertSize(resp, 1);
        }

        @Test
        void getForProductArea() {
            createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());

            ResponseEntity<ProcessPage> resp = restTemplate.getForEntity("/process?productArea={productArea}", ProcessPage.class, "productarea1");

            assertSize(resp, 1);
        }

        @Test
        void getByDocumentId() {
            Policy policy = createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());

            ResponseEntity<ProcessPage> resp = restTemplate.getForEntity("/process?documentId={documentId}", ProcessPage.class,
                    policy.getData().getDocumentIds().get(0));

            assertSize(resp, 1);
        }

        @Test
        void getByProcessorId() {
            Policy policy = createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());

            ResponseEntity<ProcessPage> resp = restTemplate.getForEntity("/process?processorId={processorId}", ProcessPage.class,
                    policy.getProcess().getData().getDataProcessing().getProcessors().get(0));

            assertSize(resp, 1);
        }

        @Test
        void getByGdprAndLaw() {
            createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());

            assertSize(restTemplate.getForEntity("/process?gdprArticle={gdpr}&nationalLaw={law}", ProcessPage.class, "ART61A", "FTRL"), 1);
            assertSize(restTemplate.getForEntity("/process?gdprArticle={gdpr}", ProcessPage.class, "ART61A"), 1);
            assertSize(restTemplate.getForEntity("/process?nationalLaw={law}", ProcessPage.class, "FTRL"), 1);
            assertSize(restTemplate.getForEntity("/process?gdprArticle={gdpr}&nationalLaw={law}", ProcessPage.class, "ART61A", "FTRL2"), 0);
            assertSize(restTemplate.getForEntity("/process?gdprArticle={gdpr}&nationalLaw={law}", ProcessPage.class, "ART61B", "FTRL"), 0);
        }

        private void assertSize(ResponseEntity<ProcessPage> resp, int expected) {
            assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
            ProcessPage processPage = resp.getBody();
            assertThat(processPage).isNotNull();

            assertThat(processPage.getContent()).hasSize(expected);
        }
    }

    @Test
    void createProcess() {
        ResponseEntity<ProcessResponse> resp = restTemplate
                .postForEntity("/process", ProcessRequest.builder().name("newprocess").purpose("AAP").build(), ProcessResponse.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(resp.getBody()).isNotNull();
        assertThat(resp.getBody().getName()).isEqualTo("newprocess");
        assertThat(resp.getBody().getNumber()).isGreaterThan(100);
    }

    @Test
    void createProcessValidationError() {
        var resp = restTemplate
                    .postForEntity("/process", ProcessRequest.builder().name("newprocess").purpose("AAP")
                            .legalBases(List.of(LegalBasisRequest.builder().gdpr("6a").nationalLaw("eksisterer-ikke").description("desc").build()))
                            .build(), String.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(resp.getBody()).contains("legalBases[0].nationalLaw: EKSISTERER-IKKE code not found in codelist NATIONAL_LAW");
    }

    @Test
    void createProcessDuplicate() {
        var request = ProcessRequest.builder().name("newprocess").purpose("AAP").build();
        ResponseEntity<ProcessResponse> resp = restTemplate.postForEntity("/process", request, ProcessResponse.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        var response = restTemplate.postForEntity("/process", request, String.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).contains("nameAndPurposeExists");
    }

    @Test
    void updateProcess() {
        ResponseEntity<ProcessResponse> resp = restTemplate
                .postForEntity("/process", ProcessRequest.builder().name("newprocess").purpose("AAP").build(), ProcessResponse.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(resp.getBody()).isNotNull();

        String id = resp.getBody().getId().toString();
        ProcessRequest update = ProcessRequest.builder().id(id).name("newprocess").purpose("AAP")
                .affiliation(AffiliationRequest.builder().department("dep").build())
                .build();
        resp = restTemplate.exchange("/process/{id}", HttpMethod.PUT, new HttpEntity<>(update), ProcessResponse.class, id);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody()).isNotNull();
        assertThat(resp.getBody().getAffiliation().getDepartment().getCode()).isEqualTo("DEP");
    }

    @Test
    void updateProcessChangePurpose() {
        ResponseEntity<ProcessResponse> resp = restTemplate
                .postForEntity("/process", ProcessRequest.builder().name("newprocess").purpose("AAP").build(), ProcessResponse.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(resp.getBody()).isNotNull();
        ResponseEntity<PolicyPage> polResp = restTemplate
                .postForEntity("/policy", List.of(PolicyRequest.builder().processId(resp.getBody().getId().toString()).purpose("AAP")
                        .informationTypeId(createAndSaveInformationType().getId().toString())
                        .subjectCategory("BRUKER")
                        .build()), PolicyPage.class);
        assertThat(polResp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(polResp.getBody()).isNotNull();
        assertThat(polResp.getBody().getNumberOfElements()).isEqualTo(1);

        String id = resp.getBody().getId().toString();
        ProcessRequest update = ProcessRequest.builder().id(id).name("newprocess").purpose("KONTROLL")
                .affiliation(AffiliationRequest.builder().department("dep").build())
                .build();
        var errorResp = restTemplate.exchange("/process/{id}", HttpMethod.PUT, new HttpEntity<>(update), String.class, id);
        assertThat(errorResp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(errorResp.getBody()).isNotNull();
        assertThat(policyRepository.findById(polResp.getBody().getContent().get(0).getId()).orElseThrow().getData().getPurposes()).isEqualTo(List.of("KONTROLL"));
    }

    @Test
    void countPurposes() {
        createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());
        createAndSavePolicy(PURPOSE_CODE1 + 2, createAndSaveInformationType());

        ResponseEntity<ProcessCountResponse> resp = restTemplate.getForEntity("/process/count?purpose", ProcessCountResponse.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        ProcessCountResponse purposeResponse = resp.getBody();
        assertThat(purposeResponse).isNotNull()
                .isEqualTo(new ProcessCountResponse(Map.of(PURPOSE_CODE1, 1L, PURPOSE_CODE1 + 2, 1L, PURPOSE_CODE2, 0L)));
    }

    @Test
    void countDepartment() {
        createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());

        ResponseEntity<ProcessCountResponse> resp = restTemplate.getForEntity("/process/count?department", ProcessCountResponse.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        ProcessCountResponse purposeResponse = resp.getBody();
        assertThat(purposeResponse).isNotNull()
                .isEqualTo(new ProcessCountResponse(Map.of("AOT", 0L, "DEP", 1L)));
    }

    @Test
    void countSubDepartment() {
        createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());

        ResponseEntity<ProcessCountResponse> resp = restTemplate.getForEntity("/process/count?subDepartment", ProcessCountResponse.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        ProcessCountResponse purposeResponse = resp.getBody();
        assertThat(purposeResponse).isNotNull()
                .isEqualTo(new ProcessCountResponse(Map.of("PEN", 0L, "SUBDEP", 1L)));
    }

    @Test
    void countTeam() {
        createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());

        ResponseEntity<ProcessCountResponse> resp = restTemplate.getForEntity("/process/count?team", ProcessCountResponse.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        ProcessCountResponse purposeResponse = resp.getBody();
        assertThat(purposeResponse).isNotNull()
                .isEqualTo(new ProcessCountResponse(Map.of("teamid1", 1L)));
    }

}