package no.nav.data.polly.nom;

import no.nav.data.integration.nom.NomController.AvdelingList;
import no.nav.data.polly.IntegrationTestBase;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class NomControllerIT extends IntegrationTestBase {

    @Test
    void getNomAvdelinger() {
        AvdelingList body = webTestClient.get()
                .uri("/nom/avdelinger")
                .exchange()
                .expectStatus().isOk()
                .expectBody(AvdelingList.class)
                .returnResult()
                .getResponseBody();

        assertThat(body).isNotNull();
        assertThat(body.getContent()).hasSize(2);
    }
}
