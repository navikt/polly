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
import org.springframework.security.oauth2.core.oidc.StandardClaimNames;

import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class ProcessControllerIT extends IntegrationTestBase {

    @Autowired
    private ProcessService processService;

    @Test
    void getProcess() {
        Policy policy = createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());

        ProcessResponse processResponse = webTestClient.get()
                .uri("/process/{id}", policy.getProcess().getId())
                .exchange()
                .expectStatus().isOk()
                .expectBody(ProcessResponse.class)
                .returnResult()
                .getResponseBody();

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

        ProcessResponse processResponse = webTestClient.get()
                .uri("/process/{id}", policy.getProcess().getData().getNumber())
                .exchange()
                .expectStatus().isOk()
                .expectBody(ProcessResponse.class)
                .returnResult()
                .getResponseBody();

        assertThat(processResponse).isNotNull();
        assertThat(processResponse.getId()).isEqualTo(policy.getProcess().getId());
    }

    @Test
    void getProcessShortById() {
        Policy policy = createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());
        Policy policy2 = createAndSavePolicy(PURPOSE_CODE2, createAndSaveInformationType());

        ProcessPage respBody = webTestClient.post()
                .uri("/process/shortbyid")
                .bodyValue(List.of(policy.getProcess().getId(), policy2.getProcess().getId()))
                .exchange()
                .expectStatus().isOk()
                .expectBody(ProcessPage.class)
                .returnResult()
                .getResponseBody();

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
        LastEditedPage page = webTestClient.get()
                .uri("/process/myedits")
                .exchange()
                .expectStatus().isOk()
                .expectBody(LastEditedPage.class)
                .returnResult()
                .getResponseBody();
        MockFilter.clearUser();

        assertThat(page).isNotNull();
        assertThat(page.getNumberOfElements()).isEqualTo(20L);
        assertThat(page.getContent().get(0).getTime()).isNotNull();
        for (int i = 0; i < 20; i++) {
            assertThat(page.getContent().get(i).getProcess().getPurposes().get(0).getCode()).isEqualTo(PURPOSE_CODE2 + (39 - i));
        }
    }

    @Test
    void searchProcess() {
        Policy policy = createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());

        ProcessPage page = webTestClient.get()
                .uri("/process/search/{name}", policy.getProcess().getData().getName().toLowerCase())
                .exchange()
                .expectStatus().isOk()
                .expectBody(ProcessPage.class)
                .returnResult()
                .getResponseBody();

        assertThat(page).isNotNull();
        assertThat(page.getNumberOfElements()).isEqualTo(1L);
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

            ProcessShortPage page = get(field, ProcessState.YES);

            assertThat(page).isNotNull();
            if (trueAlerts(field)) {
                assertThat(page.getNumberOfElements()).isEqualTo(1L);
            } else {
                assertThat(page.getNumberOfElements()).isEqualTo(0L);
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

            ProcessShortPage page = get(field, ProcessState.NO);

            assertThat(page).isNotNull();
            assertThat(page.getNumberOfElements()).isEqualTo(0L);
        }

        @ParameterizedTest
        @EnumSource(ProcessField.class)
        void processByStateUnknown(ProcessField field) {
            createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());
            ProcessShortPage page = get(field, ProcessState.UNKNOWN);

            assertThat(page).isNotNull();
            assertThat(page.getNumberOfElements()).isEqualTo(0L);
        }

        private ProcessShortPage get(ProcessField field, ProcessState yes) {
            return webTestClient.get()
                    .uri(uriBuilder -> uriBuilder.path("/process/state")
                            .queryParam("processField", field)
                            .queryParam("processState", yes)
                            .build())
                    .exchange()
                    .expectStatus().isOk()
                    .expectBody(ProcessShortPage.class)
                    .returnResult()
                    .getResponseBody();
        }

    }

    @Nested
    class GetAll {

        @Test
        void getAllProcess() {
            Policy policy = createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());
            Policy policy2 = createAndSavePolicy(PURPOSE_CODE1 + 2, createAndSaveInformationType());

            ProcessPage processPage = webTestClient.get()
                    .uri("/process")
                    .exchange()
                    .expectStatus().isOk()
                    .expectBody(ProcessPage.class)
                    .returnResult()
                    .getResponseBody();

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

            ProcessPage resp = webTestClient.get()
                    .uri(uriBuilder -> uriBuilder.path("/process").queryParam("productTeam", "teamid1").build())
                    .exchange()
                    .expectStatus().isOk()
                    .expectBody(ProcessPage.class)
                    .returnResult()
                    .getResponseBody();

            assertSize(resp, 1);
        }

        @Test
        void getForProductArea() {
            createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());

            ProcessPage resp = webTestClient.get()
                    .uri(uriBuilder -> uriBuilder.path("/process").queryParam("productArea", "productarea1").build())
                    .exchange()
                    .expectStatus().isOk()
                    .expectBody(ProcessPage.class)
                    .returnResult()
                    .getResponseBody();

            assertSize(resp, 1);
        }

        @Test
        void getByDocumentId() {
            Policy policy = createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());

            ProcessPage resp = webTestClient.get()
                    .uri(uriBuilder -> uriBuilder.path("/process").queryParam("documentId", policy.getData().getDocumentIds().get(0)).build())
                    .exchange()
                    .expectStatus().isOk()
                    .expectBody(ProcessPage.class)
                    .returnResult()
                    .getResponseBody();

            assertSize(resp, 1);
        }

        @Test
        void getByProcessorId() {
            Policy policy = createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());

            ProcessPage resp = webTestClient.get()
                    .uri(uriBuilder -> uriBuilder.path("/process").queryParam("processorId", policy.getProcess().getData().getDataProcessing().getProcessors().get(0)).build())
                    .exchange()
                    .expectStatus().isOk()
                    .expectBody(ProcessPage.class)
                    .returnResult()
                    .getResponseBody();

            assertSize(resp, 1);
        }

        @Test
        void getByGdprAndLaw() {
            createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());

            assertSize(getByGdprLaw("ART61A", "FTRL"), 1);
            assertSize(getByGdpr("ART61A"), 1);
            assertSize(getByLaw("FTRL"), 1);
            assertSize(getByGdprLaw("ART61A", "FTRL2"), 0);
            assertSize(getByGdprLaw("ART61B", "FTRL"), 0);
        }

        private ProcessPage getByGdprLaw(String gdpr, String law) {
            return webTestClient.get()
                    .uri(uriBuilder -> uriBuilder.path("/process")
                            .queryParam("gdprArticle", gdpr)
                            .queryParam("nationalLaw", law)
                            .build())
                    .exchange()
                    .expectStatus().isOk()
                    .expectBody(ProcessPage.class)
                    .returnResult()
                    .getResponseBody();
        }

        private ProcessPage getByGdpr(String gdpr) {
            return webTestClient.get()
                    .uri(uriBuilder -> uriBuilder.path("/process")
                            .queryParam("gdprArticle", gdpr)
                            .build())
                    .exchange()
                    .expectStatus().isOk()
                    .expectBody(ProcessPage.class)
                    .returnResult()
                    .getResponseBody();
        }

        private ProcessPage getByLaw(String law) {
            return webTestClient.get()
                    .uri(uriBuilder -> uriBuilder.path("/process")
                            .queryParam("nationalLaw", law)
                            .build())
                    .exchange()
                    .expectStatus().isOk()
                    .expectBody(ProcessPage.class)
                    .returnResult()
                    .getResponseBody();
        }

        private void assertSize(ProcessPage processPage, int expected) {
            assertThat(processPage).isNotNull();
            assertThat(processPage.getContent()).hasSize(expected);
        }
    }

    @Test
    void createProcess() {
        ProcessResponse body = webTestClient.post()
                .uri("/process")
                .bodyValue(ProcessRequest.builder().name("newprocess").purpose("AAP").build())
                .exchange()
                .expectStatus().isCreated()
                .expectBody(ProcessResponse.class)
                .returnResult()
                .getResponseBody();

        assertThat(body).isNotNull();
        assertThat(body.getName()).isEqualTo("newprocess");
        assertThat(body.getNumber()).isGreaterThan(100);
    }

    @Test
    void createProcessValidationError() {
        String body = webTestClient.post()
                .uri("/process")
                .bodyValue(ProcessRequest.builder().name("newprocess").purpose("AAP")
                        .legalBases(List.of(LegalBasisRequest.builder().gdpr("6a").nationalLaw("eksisterer-ikke").description("desc").build()))
                        .build())
                .exchange()
                .expectStatus().isBadRequest()
                .expectBody(String.class)
                .returnResult()
                .getResponseBody();

        assertThat(body).contains("legalBases[0].nationalLaw: EKSISTERER-IKKE code not found in codelist NATIONAL_LAW");
    }

    @Test
    void createProcessDuplicate() {
        var request = ProcessRequest.builder().name("newprocess").purpose("AAP").build();

        webTestClient.post()
                .uri("/process")
                .bodyValue(request)
                .exchange()
                .expectStatus().isCreated();

        String body = webTestClient.post()
                .uri("/process")
                .bodyValue(request)
                .exchange()
                .expectStatus().isBadRequest()
                .expectBody(String.class)
                .returnResult()
                .getResponseBody();

        assertThat(body).contains("nameAndPurposeExists");
    }

    @Test
    void updateProcess() {
        ProcessResponse created = webTestClient.post()
                .uri("/process")
                .bodyValue(ProcessRequest.builder().name("newprocess").purpose("AAP").build())
                .exchange()
                .expectStatus().isCreated()
                .expectBody(ProcessResponse.class)
                .returnResult()
                .getResponseBody();

        assertThat(created).isNotNull();

        String id = created.getId().toString();
        ProcessRequest update = ProcessRequest.builder().id(id).name("newprocess").purpose("AAP")
                .affiliation(AffiliationRequest.builder().department("dep").build())
                .build();

        ProcessResponse updated = webTestClient.put()
                .uri("/process/{id}", id)
                .bodyValue(update)
                .exchange()
                .expectStatus().isOk()
                .expectBody(ProcessResponse.class)
                .returnResult()
                .getResponseBody();

        assertThat(updated).isNotNull();
        assertThat(updated.getAffiliation().getDepartment().getCode()).isEqualTo("DEP");
    }

    @Test
    void updateProcessChangePurpose() {
        ProcessResponse createdProcess = webTestClient.post()
                .uri("/process")
                .bodyValue(ProcessRequest.builder().name("newprocess").purpose("AAP").build())
                .exchange()
                .expectStatus().isCreated()
                .expectBody(ProcessResponse.class)
                .returnResult()
                .getResponseBody();

        assertThat(createdProcess).isNotNull();

        PolicyPage polResp = webTestClient.post()
                .uri("/policy")
                .bodyValue(List.of(PolicyRequest.builder().processId(createdProcess.getId().toString()).purpose("AAP")
                        .informationTypeId(createAndSaveInformationType().getId().toString())
                        .subjectCategory("BRUKER")
                        .build()))
                .exchange()
                .expectStatus().isCreated()
                .expectBody(PolicyPage.class)
                .returnResult()
                .getResponseBody();

        assertThat(polResp).isNotNull();
        assertThat(polResp.getNumberOfElements()).isEqualTo(1);

        String id = createdProcess.getId().toString();
        ProcessRequest update = ProcessRequest.builder().id(id).name("newprocess").purpose("KONTROLL")
                .affiliation(AffiliationRequest.builder().department("dep").build())
                .build();

        String respBody = webTestClient.put()
                .uri("/process/{id}", id)
                .bodyValue(update)
                .exchange()
                .expectStatus().isOk()
                .expectBody(String.class)
                .returnResult()
                .getResponseBody();

        assertThat(respBody).isNotNull();
        assertThat(policyRepository.findById(polResp.getContent().get(0).getId()).orElseThrow().getData().getPurposes()).isEqualTo(List.of("KONTROLL"));
    }

    @Test
    void countPurposes() {
        createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());
        createAndSavePolicy(PURPOSE_CODE1 + 2, createAndSaveInformationType());

        ProcessCountResponse body = webTestClient.get()
                .uri("/process/count?purpose")
                .exchange()
                .expectStatus().isOk()
                .expectBody(ProcessCountResponse.class)
                .returnResult()
                .getResponseBody();

        assertThat(body).isNotNull()
                .isEqualTo(new ProcessCountResponse(Map.of(PURPOSE_CODE1, 1L, PURPOSE_CODE1 + 2, 1L, PURPOSE_CODE2, 0L)));
    }

    @Test
    void countDepartment() {
        createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());

        ProcessCountResponse body = webTestClient.get()
                .uri("/process/count?department")
                .exchange()
                .expectStatus().isOk()
                .expectBody(ProcessCountResponse.class)
                .returnResult()
                .getResponseBody();

        assertThat(body).isNotNull()
                .isEqualTo(new ProcessCountResponse(Map.of("AOT", 0L, "DEP", 1L)));
    }

    @Test
    void countSubDepartment() {
        createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());

        ProcessCountResponse body = webTestClient.get()
                .uri("/process/count?subDepartment")
                .exchange()
                .expectStatus().isOk()
                .expectBody(ProcessCountResponse.class)
                .returnResult()
                .getResponseBody();

        assertThat(body).isNotNull()
                .isEqualTo(new ProcessCountResponse(Map.of("PEN", 0L, "SUBDEP", 1L)));
    }

    @Test
    void countTeam() {
        createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());

        ProcessCountResponse body = webTestClient.get()
                .uri("/process/count?team")
                .exchange()
                .expectStatus().isOk()
                .expectBody(ProcessCountResponse.class)
                .returnResult()
                .getResponseBody();

        assertThat(body).isNotNull()
                .isEqualTo(new ProcessCountResponse(Map.of("teamid1", 1L)));
    }

}
