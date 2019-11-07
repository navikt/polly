package no.nav.data.polly.process;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodeResponse;
import no.nav.data.polly.informationtype.dto.InformationTypeNameResponse;
import no.nav.data.polly.legalbasis.dto.LegalBasisRequest;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.policy.dto.PolicyResponse;
import no.nav.data.polly.process.ProcessController.ProcessPage;
import no.nav.data.polly.process.dto.ProcessPolicyResponse;
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
        Policy policy = createPolicy(PURPOSE_CODE1, createInformationType());

        ResponseEntity<ProcessPolicyResponse> resp = restTemplate.getForEntity("/process/{id}", ProcessPolicyResponse.class, policy.getProcess().getId());

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        ProcessPolicyResponse processResponse = resp.getBody();
        assertThat(processResponse).isNotNull();

        assertThat(processResponse).isEqualTo(ProcessPolicyResponse.builder()
                .id(policy.getProcess().getId().toString())
                .name("Auto_" + PURPOSE_CODE1)
                .purposeCode(PURPOSE_CODE1)
                .start(LocalDate.now())
                .end(LocalDate.now())
                .legalBasis(legalBasisResponse())
                .policy(PolicyResponse.builder()
                        .id(policy.getId())
                        .process(policy.getProcess().getName())
                        .purposeCode(new CodeResponse(PURPOSE_CODE1, "Kontrollering"))
                        .informationType(new InformationTypeNameResponse(createInformationType().getId().toString(), INFORMATION_TYPE_NAME))
                        .subjectCategory(CodelistService.getCodeResponse(ListName.SUBJECT_CATEGORY, policy.getSubjectCategory()))
                        .start(policy.getStart())
                        .end(policy.getEnd())
                        .legalBasis(legalBasisResponse())
                        .build())
                .build());
    }

    @Test
    void hentAllProcess() {
        Policy policy = createPolicy(PURPOSE_CODE1, createInformationType());
        Policy policy2 = createPolicy(PURPOSE_CODE1 + 2, createInformationType());

        ResponseEntity<ProcessPage> resp = restTemplate.getForEntity("/process", ProcessPage.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        ProcessPage processPage = resp.getBody();
        assertThat(processPage).isNotNull();

        assertThat(processPage.getContent()).hasSize(2);
        assertThat(processPage.getContent()).contains(
                ProcessResponse.builder()
                        .id(policy.getProcess().getId().toString())
                        .name("Auto_" + PURPOSE_CODE1)
                        .purposeCode(PURPOSE_CODE1)
                        .start(LocalDate.now())
                        .end(LocalDate.now())
                        .legalBasis(legalBasisResponse())
                        .build(),
                ProcessResponse.builder()
                        .id(policy2.getProcess().getId().toString())
                        .name("Auto_" + PURPOSE_CODE1 + 2)
                        .purposeCode(PURPOSE_CODE1 + 2)
                        .start(LocalDate.now())
                        .end(LocalDate.now())
                        .legalBasis(legalBasisResponse())
                        .build()
        );
    }

    @Test
    void createProcess() {
        ResponseEntity<ProcessPage> resp = restTemplate
                .postForEntity("/process", List.of(ProcessRequest.builder().name("newprocess").purposeCode("AAP").build()), ProcessPage.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(resp.getBody()).isNotNull();
        assertThat(resp.getBody().getContent().get(0).getName()).isEqualTo("newprocess");
    }

    @Test
    void createProcessValidationError() {
        ResponseEntity<String> resp = restTemplate
                .postForEntity("/process", List.of(ProcessRequest.builder().name("newprocess").purposeCode("AAP")
                        .legalBases(List.of(LegalBasisRequest.builder().gdpr("6a").nationalLaw("eksisterer-ikke").description("desc").build()))
                        .build()), String.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(resp.getBody()).contains("legalBases[0].nationalLaw: eksisterer-ikke code not found in codelist NATIONAL_LAW");
    }

    @Test
    void createProcessDuplicate() {
        var request = ProcessRequest.builder().name("newprocess").purposeCode("AAP").build();
        ResponseEntity<ProcessPage> resp = restTemplate.postForEntity("/process", List.of(request), ProcessPage.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        ResponseEntity<String> errorResp = restTemplate.postForEntity("/process", List.of(request), String.class);
        assertThat(errorResp.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(errorResp.getBody()).contains("nameAndPurposeExists");
    }

    @Test
    void updateProcess() {
        ResponseEntity<ProcessPage> resp = restTemplate
                .postForEntity("/process", List.of(ProcessRequest.builder().name("newprocess").purposeCode("AAP").build()), ProcessPage.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(resp.getBody()).isNotNull();

        String id = resp.getBody().getContent().get(0).getId();
        ProcessRequest update = ProcessRequest.builder().id(id).name("newprocess").purposeCode("AAP").department("dep").build();
        resp = restTemplate.exchange("/process", HttpMethod.PUT, new HttpEntity<>(List.of(update)), ProcessPage.class, id);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody()).isNotNull();
        assertThat(resp.getBody().getContent().get(0).getDepartment().getCode()).isEqualTo("dep");
    }

    @Test
    void updateProcessValidationError() {
        ResponseEntity<ProcessPage> resp = restTemplate
                .postForEntity("/process", List.of(ProcessRequest.builder().name("newprocess").purposeCode("AAP").build()), ProcessPage.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(resp.getBody()).isNotNull();

        String id = resp.getBody().getContent().get(0).getId();
        ProcessRequest update = ProcessRequest.builder().id(id).name("changedName").purposeCode("AAP").department("dep").build();
        var errorResp = restTemplate.exchange("/process", HttpMethod.PUT, new HttpEntity<>(List.of(update)), String.class, id);
        assertThat(errorResp.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(errorResp.getBody()).isNotNull();
        assertThat(errorResp.getBody()).contains("Cannot change name from newprocess to changedName");
    }
}