package no.nav.data.polly.term;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.term.TermController.TermPage;
import no.nav.data.polly.term.dto.TermCountResponse;
import no.nav.data.polly.term.dto.TermResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;

import static org.assertj.core.api.Assertions.assertThat;

class TermControllerIT extends IntegrationTestBase {

    @Autowired
    private TestRestTemplate template;

    @Test
    void searchTerm() {
        var response = template.getForEntity("/term/search/term", TermPage.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getContent().get(0).getName()).isEqualTo("term old");
        assertThat(response.getBody().getContent().get(1).getName()).isEqualTo("new term");
    }

    @Test
    void getTerm() {
        var response = template.getForEntity("/term/{id}", TermResponse.class, "term");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
    }

    @Test
    void countTermByInfoType() {
        InformationType informationType = createInformationType();
        var response = template.getForEntity("/term/count/informationtype", TermCountResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getTerms()).hasSize(1);
        assertThat(response.getBody().getTerms().get(informationType.getTermId())).isEqualTo(1L);
    }
}
