package no.nav.data.polly.term;

import com.fasterxml.jackson.databind.JsonNode;
import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.common.utils.JsonUtils;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.term.TermController.TermPage;
import no.nav.data.polly.term.dto.TermCountResponse;
import no.nav.data.polly.term.dto.TermRequest;
import no.nav.data.polly.term.dto.TermResponse;
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
    void searchTerm() {
        createTerms();
        var response = template.getForEntity("/term/search/term", TermPage.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getContent().get(0).getName()).isEqualTo("term old");
        assertThat(response.getBody().getContent().get(1).getName()).isEqualTo("new term");
    }

    @Test
    void getTerm() {
        var created = createTerms();
        var response = template.getForEntity("/term/{id}", TermResponse.class, created.getContent().get(0).getId());

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
        assertThat(response.getBody().getTerms().get(informationType.getTerm().getName())).isEqualTo(1L);
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
        createTerms();
        ResponseEntity<String> response = template
                .postForEntity("/term", List.of(TermRequest.builder().name("new term").description("some other description").build()), String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).contains("The Term new term already exists and therefore cannot be created");
    }

    private TermPage createTerms() {
        ResponseEntity<TermPage> resp = template.postForEntity("/term", List.of(TermRequest.builder().name("new term").description("some description").build(),
                TermRequest.builder().name("term old").description("some description").build()), TermPage.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        return resp.getBody();
    }
}
