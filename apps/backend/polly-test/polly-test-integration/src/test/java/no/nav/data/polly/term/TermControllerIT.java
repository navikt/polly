package no.nav.data.polly.term;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.term.dto.TermCountResponse;
import no.nav.data.polly.term.dto.TermResponse;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class TermControllerIT extends IntegrationTestBase {

    @Test
    void searchTerm() {
        webTestClient.get()
                .uri("/term/search/term")
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.content.length()").isEqualTo(2)
                .jsonPath("$.content[0].name").isEqualTo("term old")
                .jsonPath("$.content[1].name").isEqualTo("new term");
    }

    @Test
    void getTerm() {
        TermResponse body = webTestClient.get()
                .uri("/term/{id}", "term")
                .exchange()
                .expectStatus().isOk()
                .expectBody(TermResponse.class)
                .returnResult()
                .getResponseBody();

        assertThat(body).isNotNull();
    }

    @Test
    void countTermByInfoType() {
        InformationType informationType = createAndSaveInformationType();

        TermCountResponse body = webTestClient.get()
                .uri("/term/count/informationtype")
                .exchange()
                .expectStatus().isOk()
                .expectBody(TermCountResponse.class)
                .returnResult()
                .getResponseBody();

        assertThat(body).isNotNull();
        assertThat(body.getTerms()).hasSize(1);
        assertThat(body.getTerms().get(informationType.getTermId())).isEqualTo(1L);
    }
}
