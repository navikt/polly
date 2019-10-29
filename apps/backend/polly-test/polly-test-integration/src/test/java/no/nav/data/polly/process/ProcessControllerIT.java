package no.nav.data.polly.process;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.policy.dto.LegalBasisResponse;
import no.nav.data.polly.process.ProcessController.ProcessPage;
import no.nav.data.polly.process.dto.ProcessResponse;
import no.nav.data.polly.purpose.dto.InformationTypePurposeResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

class ProcessControllerIT extends IntegrationTestBase {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void hentProcess() {
        Policy policy = createPolicy(PURPOSE_CODE1, createInformationType());

        ResponseEntity<ProcessResponse> resp = restTemplate.getForEntity("/process/{processName}", ProcessResponse.class, "Auto_" + PURPOSE_CODE1);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        ProcessResponse processResponse = resp.getBody();
        assertThat(processResponse).isNotNull();

        assertThat(processResponse).isEqualTo(ProcessResponse.builder()
                .id(policy.getProcess().getId().toString())
                .name("Auto_" + PURPOSE_CODE1).purposeCode(PURPOSE_CODE1)
                .informationType(InformationTypePurposeResponse.builder()
                        .id(createInformationType().getId())
                        .name(INFORMATION_TYPE_NAME)
                        .legalBasis(LegalBasisResponse.builder().gdpr("a").nationalLaw("b").description("desc").build())
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
        assertThat(processPage.getContent()).contains(ProcessResponse.builder()
                .id(policy.getProcess().getId().toString())
                .name("Auto_" + PURPOSE_CODE1).purposeCode(PURPOSE_CODE1)
                .build(), ProcessResponse.builder()
                .id(policy2.getProcess().getId().toString())
                .name("Auto_" + PURPOSE_CODE1 + 2).purposeCode(PURPOSE_CODE1 + 2)
                .build());
    }
}