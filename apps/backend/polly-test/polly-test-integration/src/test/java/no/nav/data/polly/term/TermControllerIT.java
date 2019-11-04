package no.nav.data.polly.term;

import com.fasterxml.jackson.databind.JsonNode;
import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.common.utils.JsonUtils;
import no.nav.data.polly.term.TermController.TermPage;
import no.nav.data.polly.term.dto.TermRequest;
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
        JsonNode data = JsonUtils.toJsonNode("{\"hei\": \"heeeey\"}");
        ResponseEntity<TermPage> response = template
                .postForEntity("/term", List.of(TermRequest.builder().name("new-term").description("some description").data(data).build()), TermPage.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    }

    @Test
    void createTermValidationFail() {
        ResponseEntity<String> response = template
                .postForEntity("/term", List.of(TermRequest.builder().name("new-term").build()), String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).contains("description was null or missing");
    }

    @Test
    void createTermDuplicateFail() {
        template.postForEntity("/term", List.of(TermRequest.builder().name("new-term").description("some description").build()), TermPage.class);
        ResponseEntity<String> response = template
                .postForEntity("/term", List.of(TermRequest.builder().name("new-term").description("some other description").build()), String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).contains("The Term new-term already exists and therefore cannot be created");
    }
}
