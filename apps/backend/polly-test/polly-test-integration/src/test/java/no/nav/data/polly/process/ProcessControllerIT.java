package no.nav.data.polly.process;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.legalbasis.dto.LegalBasisRequest;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.policy.dto.PolicyInformationTypeResponse;
import no.nav.data.polly.policy.dto.PolicyResponse;
import no.nav.data.polly.process.ProcessReadController.ProcessPage;
import no.nav.data.polly.process.dto.ProcessRequest;
import no.nav.data.polly.process.dto.ProcessResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class ProcessControllerIT extends IntegrationTestBase {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void hentProcess() {
        Policy policy = createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());

        ResponseEntity<ProcessResponse> resp = restTemplate.getForEntity("/process/{id}", ProcessResponse.class, policy.getProcess().getId());

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        ProcessResponse processResponse = resp.getBody();
        assertThat(processResponse).isNotNull();

        assertThat(processResponse).isEqualTo(ProcessResponse.builder()
                .id(policy.getProcess().getId())
                .name("Auto_" + PURPOSE_CODE1)
                .description("process description")
                .purposeCode(PURPOSE_CODE1)
                .start(LocalDate.now())
                .end(LocalDate.now())
                .legalBasis(legalBasisResponse())
                .policy(PolicyResponse.builder()
                        .id(policy.getId())
                        .process(policy.getProcess().convertToIdNameResponse())
                        .purposeCode(CodelistService.getCodelistResponse(ListName.PURPOSE, PURPOSE_CODE1))
                        .informationTypeId(createAndSaveInformationType().getId())
                        .informationType(
                                new PolicyInformationTypeResponse(createAndSaveInformationType().getId(), INFORMATION_TYPE_NAME,
                                        createAndSaveInformationType().getData().sensitivityCode()))
                        .subjectCategory(CodelistService.getCodelistResponse(ListName.SUBJECT_CATEGORY, policy.getData().getSubjectCategories().get(0)))
                        .start(policy.getData().getStart())
                        .end(policy.getData().getEnd())
                        .legalBasis(legalBasisResponse())
                        .documentIds(List.of())
                        .build())
                .build());
    }

    @Test
    void hentAllProcess() {
        Policy policy = createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());
        Policy policy2 = createAndSavePolicy(PURPOSE_CODE1 + 2, createAndSaveInformationType());

        ResponseEntity<ProcessPage> resp = restTemplate.getForEntity("/process", ProcessPage.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        ProcessPage processPage = resp.getBody();
        assertThat(processPage).isNotNull();

        assertThat(processPage.getContent()).hasSize(2);
        assertThat(processPage.getContent()).contains(
                ProcessResponse.builder()
                        .id(policy.getProcess().getId())
                        .name("Auto_" + PURPOSE_CODE1)
                        .description("process description")
                        .purposeCode(PURPOSE_CODE1)
                        .start(LocalDate.now())
                        .end(LocalDate.now())
                        .legalBasis(legalBasisResponse())
                        .build(),
                ProcessResponse.builder()
                        .id(policy2.getProcess().getId())
                        .name("Auto_" + PURPOSE_CODE1 + 2)
                        .description("process description")
                        .purposeCode(PURPOSE_CODE1 + 2)
                        .start(LocalDate.now())
                        .end(LocalDate.now())
                        .legalBasis(legalBasisResponse())
                        .build()
        );
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
        ProcessRequest update = ProcessRequest.builder().id(id).name("changedName").purposeCode("AAP").department("dep").build();
        var errorResp = restTemplate.exchange("/process/{id}", HttpMethod.PUT, new HttpEntity<>(update), String.class, id);
        assertThat(errorResp.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(errorResp.getBody()).isNotNull();
        assertThat(errorResp.getBody()).contains("Cannot change name from newprocess to changedName");
    }
}