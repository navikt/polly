package no.nav.data.polly.nom;

import no.nav.data.polly.IntegrationTestBase;
import org.junit.jupiter.api.Test;

public class NomControllerIT extends IntegrationTestBase {

    @Test
    void getNomAvdelinger() {
        webTestClient.get()
                .uri("/nom/avdelinger")
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.content.length()").isEqualTo(14);
    }
}
