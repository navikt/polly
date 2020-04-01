package no.nav.data.polly.process;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.process.ProcessReadController.ProcessPage;
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
        Policy policy = createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());

        ResponseEntity<ProcessPage> resp = restTemplate.getForEntity("/process/purpose/{purpose}", ProcessPage.class, PURPOSE_CODE1);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        ProcessPage purposeResponse = resp.getBody();
        assertThat(purposeResponse).isNotNull();

        assertThat(purposeResponse.getNumberOfElements()).isOne();
        purposeResponse.getContent().forEach(p -> p.setChangeStamp(null));
        assertThat(purposeResponse.getContent().get(0)).isEqualTo(
                processResponseBuilder(policy.getProcess().getId())
                        .build());
    }
}