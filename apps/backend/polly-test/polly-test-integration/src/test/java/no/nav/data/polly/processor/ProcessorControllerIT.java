package no.nav.data.polly.processor;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.codelist.CodelistStaticService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.processor.ProcessorController.ProcessorPage;
import no.nav.data.polly.processor.domain.Processor;
import no.nav.data.polly.processor.dto.ProcessorResponse;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class ProcessorControllerIT extends IntegrationTestBase {

    @Test
    void createProcessor() {
        var request = createProcessorRequest();
        ProcessorResponse body = webTestClient.post()
                .uri("/processor")
                .bodyValue(request)
                .exchange()
                .expectStatus().isCreated()
                .expectBody(ProcessorResponse.class)
                .returnResult()
                .getResponseBody();

        assertBody(body);
    }

    @Test
    void getProcessor() {
        var request = createProcessorRequest();
        ProcessorResponse created = webTestClient.post()
                .uri("/processor")
                .bodyValue(request)
                .exchange()
                .expectStatus().isCreated()
                .expectBody(ProcessorResponse.class)
                .returnResult()
                .getResponseBody();

        assertThat(created).isNotNull();

        ProcessorResponse fetched = webTestClient.get()
                .uri("/processor/{id}", created.getId().toString())
                .exchange()
                .expectStatus().isOk()
                .expectBody(ProcessorResponse.class)
                .returnResult()
                .getResponseBody();

        assertBody(fetched);
    }

    @Test
    void searchProcessor() {
        webTestClient.post().uri("/processor").bodyValue(createProcessorRequest()).exchange().expectStatus().isCreated();

        ProcessorPage page = webTestClient.get()
                .uri("/processor/search/{name}", "name")
                .exchange()
                .expectStatus().isOk()
                .expectBody(ProcessorPage.class)
                .returnResult()
                .getResponseBody();

        assertThat(page).isNotNull();
        assertThat(page.getContent()).hasSize(1);
        assertBody(page.getContent().get(0));
    }

    @Test
    void getAllProcessor() {
        webTestClient.post().uri("/processor").bodyValue(createProcessorRequest()).exchange().expectStatus().isCreated();

        ProcessorPage page = webTestClient.get()
                .uri("/processor")
                .exchange()
                .expectStatus().isOk()
                .expectBody(ProcessorPage.class)
                .returnResult()
                .getResponseBody();

        assertThat(page).isNotNull();
        assertThat(page.getContent()).hasSize(1);
        assertBody(page.getContent().get(0));
    }

    @Test
    void updateProcessor() {
        var request = createProcessorRequest();
        ProcessorResponse created = webTestClient.post()
                .uri("/processor")
                .bodyValue(request)
                .exchange()
                .expectStatus().isCreated()
                .expectBody(ProcessorResponse.class)
                .returnResult()
                .getResponseBody();

        assertThat(created).isNotNull();
        String id = created.getId().toString();

        request.setId(id);
        request.setName("name 2");

        ProcessorResponse updated = webTestClient.put()
                .uri("/processor/{id}", id)
                .bodyValue(request)
                .exchange()
                .expectStatus().isOk()
                .expectBody(ProcessorResponse.class)
                .returnResult()
                .getResponseBody();

        assertThat(updated).isNotNull();
        assertThat(updated.getName()).isEqualTo("name 2");
    }

    @Test
    void deleteProcessor() {
        ProcessorResponse created = webTestClient.post()
                .uri("/processor")
                .bodyValue(createProcessorRequest())
                .exchange()
                .expectStatus().isCreated()
                .expectBody(ProcessorResponse.class)
                .returnResult()
                .getResponseBody();

        assertThat(created).isNotNull();
        assertThat(processorRepository.count()).isOne();

        webTestClient.delete()
                .uri("/processor/{id}", created.getId().toString())
                .exchange()
                .expectStatus().is2xxSuccessful();

        assertThat(processorRepository.count()).isZero();
    }

    @Test
    void deleteProcessorFail() {
        var p = new Processor().convertFromRequest(createProcessorRequest());
        p.setId(PROCESSOR_ID1);
        processorRepository.save(p);
        assertThat(processorRepository.count()).isOne();
        var process = createAndSaveProcess(PURPOSE_CODE1);
        process.getData().getDataProcessing().setProcessors(List.of(p.getId()));
        processRepository.save(process);

        webTestClient.delete()
                .uri("/processor/{id}", PROCESSOR_ID1)
                .exchange()
                .expectStatus().is2xxSuccessful();

        assertThat(processorRepository.count()).isOne();
    }

    private void assertBody(ProcessorResponse body) {
        assertThat(body).isNotNull();
        assertThat(body.getId()).isNotNull();
        assertThat(body.getChangeStamp()).isNotNull();
        // dont compare fluid values
        body.setId(null);
        body.setChangeStamp(null);
        assertThat(body).isEqualTo(ProcessorResponse.builder()
                .name("name")
                .contract("contract")
                .contractOwner("A123456")
                .operationalContractManager("A123456")
                .note("note")
                .outsideEU(true)
                .transferGroundsOutsideEU(CodelistStaticService.getCodelistResponse(ListName.TRANSFER_GROUNDS_OUTSIDE_EU, "OTHER"))
                .transferGroundsOutsideEUOther("reason")
                .countries(List.of("FJI"))
                .build());
    }
}
