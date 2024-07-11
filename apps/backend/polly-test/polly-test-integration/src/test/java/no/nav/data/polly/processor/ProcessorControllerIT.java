package no.nav.data.polly.processor;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.codelist.CodelistStaticService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.processor.ProcessorController.ProcessorPage;
import no.nav.data.polly.processor.domain.Processor;
import no.nav.data.polly.processor.dto.ProcessorResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class ProcessorControllerIT extends IntegrationTestBase {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void createProcessor() {
        var request = createProcessorRequest();
        var resp = restTemplate.postForEntity("/processor", request, ProcessorResponse.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertBody(resp.getBody());
    }

    @Test
    void getProcessor() {
        var request = createProcessorRequest();
        var resp = restTemplate.postForEntity("/processor", request, ProcessorResponse.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(resp.getBody()).isNotNull();
        String id = resp.getBody().getId().toString();

        resp = restTemplate.getForEntity("/processor/{id}", ProcessorResponse.class, id);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertBody(resp.getBody());
    }

    @Test
    void searchProcessor() {
        restTemplate.postForEntity("/processor", createProcessorRequest(), ProcessorResponse.class);

        var resp = restTemplate.getForEntity("/processor/search/{name}", ProcessorPage.class, "name");
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody()).isNotNull();
        assertThat(resp.getBody().getContent()).hasSize(1);
        assertBody(resp.getBody().getContent().get(0));
    }

    @Test
    void getAllProcessor() {
        restTemplate.postForEntity("/processor", createProcessorRequest(), ProcessorResponse.class);

        var resp = restTemplate.getForEntity("/processor", ProcessorPage.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody()).isNotNull();
        assertThat(resp.getBody().getContent()).hasSize(1);
        assertBody(resp.getBody().getContent().get(0));
    }

    @Test
    void updateProcessor() {
        var request = createProcessorRequest();
        var resp = restTemplate.postForEntity("/processor", request, ProcessorResponse.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(resp.getBody()).isNotNull();
        String id = resp.getBody().getId().toString();

        request.setId(id);
        request.setName("name 2");
        resp = restTemplate.exchange("/processor/{id}", HttpMethod.PUT, new HttpEntity<>(request), ProcessorResponse.class, id);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody()).isNotNull();
        assertThat(resp.getBody().getName()).isEqualTo("name 2");
    }

    @Test
    void deleteProcessor() {
        var resp = restTemplate.postForEntity("/processor", createProcessorRequest(), ProcessorResponse.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(resp.getBody()).isNotNull();
        assertThat(processorRepository.count()).isOne();

        restTemplate.delete("/processor/{id}", resp.getBody().getId().toString());
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

        restTemplate.delete("/processor/{id}", PROCESSOR_ID1);

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
                .operationalContractManager("A123457")
                .note("note")

                .outsideEU(true)
                .transferGroundsOutsideEU(CodelistStaticService.getCodelistResponse(ListName.TRANSFER_GROUNDS_OUTSIDE_EU, "OTHER"))
                .transferGroundsOutsideEUOther("reason")
                .country("FJI")
                .build());
    }

}
