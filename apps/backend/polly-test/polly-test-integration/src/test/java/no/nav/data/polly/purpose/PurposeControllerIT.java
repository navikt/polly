package no.nav.data.polly.purpose;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.policy.dto.LegalBasisResponse;
import no.nav.data.polly.process.dto.ProcessResponse;
import no.nav.data.polly.purpose.dto.InformationTypePurposeResponse;
import no.nav.data.polly.purpose.dto.PurposeResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

class PurposeControllerIT extends IntegrationTestBase {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void hentBehandlingsgrunnlag() {
        Policy policy = createPolicy(PURPOSE_CODE1, createInformationType());

        ResponseEntity<PurposeResponse> resp = restTemplate.getForEntity("/purpose/{purpose}", PurposeResponse.class, PURPOSE_CODE1);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        PurposeResponse purposeResponse = resp.getBody();
        assertThat(purposeResponse).isNotNull();

        assertThat(purposeResponse).isEqualTo(PurposeResponse.builder()
                .purpose(PURPOSE_CODE1)
                .process(ProcessResponse.builder()
                        .id(policy.getProcess().getId().toString())
                        .name("Auto_" + PURPOSE_CODE1).purposeCode(PURPOSE_CODE1)
                        .informationType(InformationTypePurposeResponse.builder()
                                .id(createInformationType().getId())
                                .name(INFORMATION_TYPE_NAME)
                                .legalBasis(LegalBasisResponse.builder().gdpr("a").nationalLaw("b").description("desc").build())
                                .build())
                        .build())
                .build());
    }
}