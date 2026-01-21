package no.nav.data.polly.process;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.process.ProcessReadController.ProcessPage;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class PurposeControllerIT extends IntegrationTestBase {

    @Test
    void hentBehandlingsgrunnlag() {
        Policy policy = createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());

        ProcessPage body = webTestClient.get()
                .uri("/process/purpose/{purpose}", PURPOSE_CODE1)
                .exchange()
                .expectStatus().isOk()
                .expectBody(ProcessPage.class)
                .returnResult()
                .getResponseBody();

        assertThat(body).isNotNull();
        assertThat(body.getNumberOfElements()).isOne();
        body.getContent().forEach(p -> p.setChangeStamp(null));

        assertThat(body.getContent().get(0)).isEqualTo(
                processResponseBuilder(policy.getProcess().getId()).build()
        );
    }
}