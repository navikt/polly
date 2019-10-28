package no.nav.data.polly.term;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.term.TermController.TermPage;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class TermControllerIT extends IntegrationTestBase {

    @Autowired
    private TestRestTemplate template;

    @Test
    void createTerm() {
        ResponseEntity<TermPage> response = template
                .postForEntity("/term", List.of(TermRequest.builder().name("new-term").description("some description").build()), TermPage.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    }
}
