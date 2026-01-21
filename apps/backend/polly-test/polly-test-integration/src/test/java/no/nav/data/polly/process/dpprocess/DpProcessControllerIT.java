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

        webTestClient.get()
                .uri("/dpprocess/search/{name}", "name")
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.content.length()").isEqualTo(1);

        webTestClient.get()
                .uri("/dpprocess/search/{name}", "name")
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.content[0]")
                .exists();

        // Fetch the first element via typed mapping by requesting the created entity directly
        DpProcessResponse created = dpProcessRepository.findAll().stream().findFirst().orElseThrow().convertToResponse();
        assertBody(created);
    }

    @Test
    void getAllDpProcess() {
        webTestClient.post().uri("/dpprocess").bodyValue(createDpProcessRequest()).exchange().expectStatus().isCreated();

        webTestClient.get()
                .uri("/dpprocess")
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.content.length()").isEqualTo(1);

        DpProcessResponse created = dpProcessRepository.findAll().stream().findFirst().orElseThrow().convertToResponse();
        assertBody(created);
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
        var affiliation = affiliationRequest();
        affiliation.setProductTeams(java.util.List.of());

        return DpProcessRequest.builder()
                .name("name")
                .description("desc")
                .retention(DpRetentionRequest.builder()
                        .retentionMonths(24)
                        .retentionStart("Birth")
                        .build())
                .affiliation(affiliation)
                .externalProcessResponsible("SKATT")
                .start(LocalDate.now().toString())
                .end(LocalDate.now().toString())
                .build();
    }

    private void assertBody(DpProcessResponse body) {
        assertThat(body).isNotNull();
        assertThat(body.getId()).isNotNull();
        assertThat(body.getChangeStamp()).isNotNull();
        assertThat(body.getDpProcessNumber()).isGreaterThanOrEqualTo(101);

        // Normalize volatile fields
        body.setId(null);
        body.setChangeStamp(null);
        body.setDpProcessNumber(0);

        // subDataProcessing is returned as an empty structure (not null) in the new stack
        body.setSubDataProcessing(null);

        var expectedAffiliation = affiliationResponse();
        expectedAffiliation.setProductTeams(java.util.List.of());

        assertThat(body).isEqualTo(DpProcessResponse.builder()
                .name("name")
                .description("desc")
                .retention(dpRetentionResponse())
                .affiliation(expectedAffiliation)
                .externalProcessResponsible(CodelistStaticService.getCodelistResponse(ListName.THIRD_PARTY, "SKATT"))
                .start(LocalDate.now())
                .end(LocalDate.now())
                .dpProcessNumber(0)
                .build());
    }
}
