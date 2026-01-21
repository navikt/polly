package no.nav.data.polly.process.dpprocess;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.codelist.CodelistStaticService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.process.dpprocess.DpProcessController.DpProcessPage;
import no.nav.data.polly.process.dpprocess.dto.DpProcessRequest;
import no.nav.data.polly.process.dpprocess.dto.DpProcessResponse;
import no.nav.data.polly.process.dpprocess.dto.sub.DpRetentionRequest;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

class DpProcessControllerIT extends IntegrationTestBase {

    @Test
    void createDpProcess() {
        var request = createDpProcessRequest();
        DpProcessResponse body = webTestClient.post()
                .uri("/dpprocess")
                .bodyValue(request)
                .exchange()
                .expectStatus().isCreated()
                .expectBody(DpProcessResponse.class)
                .returnResult()
                .getResponseBody();

        assertBody(body);
    }

    @Test
    void getDpProcess() {
        var request = createDpProcessRequest();
        DpProcessResponse created = webTestClient.post()
                .uri("/dpprocess")
                .bodyValue(request)
                .exchange()
                .expectStatus().isCreated()
                .expectBody(DpProcessResponse.class)
                .returnResult()
                .getResponseBody();

        assertThat(created).isNotNull();

        DpProcessResponse fetched = webTestClient.get()
                .uri("/dpprocess/{id}", created.getId().toString())
                .exchange()
                .expectStatus().isOk()
                .expectBody(DpProcessResponse.class)
                .returnResult()
                .getResponseBody();

        assertBody(fetched);
    }

    @Test
    void searchDpProcess() {
        webTestClient.post().uri("/dpprocess").bodyValue(createDpProcessRequest()).exchange().expectStatus().isCreated();

        DpProcessPage page = webTestClient.get()
                .uri("/dpprocess/search/{name}", "name")
                .exchange()
                .expectStatus().isOk()
                .expectBody(DpProcessPage.class)
                .returnResult()
                .getResponseBody();

        assertThat(page).isNotNull();
        assertThat(page.getContent()).hasSize(1);
        assertBody(page.getContent().get(0));
    }

    @Test
    void getAllDpProcess() {
        webTestClient.post().uri("/dpprocess").bodyValue(createDpProcessRequest()).exchange().expectStatus().isCreated();

        DpProcessPage page = webTestClient.get()
                .uri("/dpprocess")
                .exchange()
                .expectStatus().isOk()
                .expectBody(DpProcessPage.class)
                .returnResult()
                .getResponseBody();

        assertThat(page).isNotNull();
        assertThat(page.getContent()).hasSize(1);
        assertBody(page.getContent().get(0));
    }

    @Test
    void updateDpProcess() {
        var request = createDpProcessRequest();
        DpProcessResponse created = webTestClient.post()
                .uri("/dpprocess")
                .bodyValue(request)
                .exchange()
                .expectStatus().isCreated()
                .expectBody(DpProcessResponse.class)
                .returnResult()
                .getResponseBody();

        assertThat(created).isNotNull();
        String id = created.getId().toString();

        request.setId(id);
        request.setName("name 2");

        DpProcessResponse updated = webTestClient.put()
                .uri("/dpprocess/{id}", id)
                .bodyValue(request)
                .exchange()
                .expectStatus().isOk()
                .expectBody(DpProcessResponse.class)
                .returnResult()
                .getResponseBody();

        assertThat(updated).isNotNull();
        assertThat(updated.getName()).isEqualTo("name 2");
    }

    @Test
    void deleteDpProcess() {
        var request = createDpProcessRequest();
        DpProcessResponse created = webTestClient.post()
                .uri("/dpprocess")
                .bodyValue(request)
                .exchange()
                .expectStatus().isCreated()
                .expectBody(DpProcessResponse.class)
                .returnResult()
                .getResponseBody();

        assertThat(created).isNotNull();
        assertThat(dpProcessRepository.count()).isOne();

        webTestClient.delete()
                .uri("/dpprocess/{id}", created.getId().toString())
                .exchange()
                .expectStatus().is2xxSuccessful();

        assertThat(dpProcessRepository.count()).isZero();
    }

    private DpProcessRequest createDpProcessRequest() {
        return DpProcessRequest.builder()
                .name("name")
                .description("desc")
                .retention(DpRetentionRequest.builder()
                        .retentionMonths(24)
                        .retentionStart("Birth")
                        .build())
                .affiliation(affiliationRequest())
                .externalProcessResponsible("SKATT")
                .start(LocalDate.now().toString())
                .end(LocalDate.now().toString())
                .build();
    }

    private void assertBody(DpProcessResponse body) {
        assertThat(body).isNotNull();
        assertThat(body.getId()).isNotNull();
        assertThat(body.getChangeStamp()).isNotNull();

        body.setId(null);
        body.setChangeStamp(null);

        assertThat(body).isEqualTo(DpProcessResponse.builder()
                .name("name")
                .description("desc")
                .retention(dpRetentionResponse())
                .affiliation(affiliationResponse())
                .externalProcessResponsible(CodelistStaticService.getCodelistResponse(ListName.THIRD_PARTY, "SKATT"))
                .start(LocalDate.now())
                .end(LocalDate.now())
                .build());
    }
}
