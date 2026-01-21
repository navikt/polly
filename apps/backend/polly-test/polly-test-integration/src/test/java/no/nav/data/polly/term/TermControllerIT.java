package no.nav.data.polly.term;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.term.TermController.TermPage;
import no.nav.data.polly.term.dto.TermCountResponse;
import no.nav.data.polly.term.dto.TermResponse;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class TermControllerIT extends IntegrationTestBase {

    @Test
    void searchTerm() {
        TermPage body = webTestClient.get()
                .uri("/term/search/term")
                .exchange()
                .expectStatus().isOk()
                .expectBody(TermPage.class)
                .returnResult()
                .getResponseBody();

        assertThat(body).isNotNull();
        assertThat(body.getContent().get(0).getName()).isEqualTo("term old");
        assertThat(body.getContent().get(1).getName()).isEqualTo("new term");
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
