package no.nav.data.polly.process.dpprocess;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.codelist.CodelistStaticService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.process.dpprocess.DpProcessController.DpProcessPage;
import no.nav.data.polly.process.dpprocess.dto.DpProcessRequest;
import no.nav.data.polly.process.dpprocess.dto.DpProcessResponse;
import no.nav.data.polly.process.dpprocess.dto.sub.DpRetentionRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

class DpProcessControllerIT extends IntegrationTestBase {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void createDpProcess() {
        var request = createDpProcessRequest();
        var resp = restTemplate.postForEntity("/dpprocess", request, DpProcessResponse.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertBody(resp.getBody());
    }

    @Test
    void getDpProcess() {
        var request = createDpProcessRequest();
        var resp = restTemplate.postForEntity("/dpprocess", request, DpProcessResponse.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(resp.getBody()).isNotNull();
        String id = resp.getBody().getId().toString();

        resp = restTemplate.getForEntity("/dpprocess/{id}", DpProcessResponse.class, id);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertBody(resp.getBody());
    }

    @Test
    void searchDpProcess() {
        restTemplate.postForEntity("/dpprocess", createDpProcessRequest(), DpProcessResponse.class);

        var resp = restTemplate.getForEntity("/dpprocess/search/{name}", DpProcessPage.class, "name");
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody()).isNotNull();
        assertThat(resp.getBody().getContent()).hasSize(1);
        assertBody(resp.getBody().getContent().get(0));
    }

    @Test
    void getAllDpProcess() {
        restTemplate.postForEntity("/dpprocess", createDpProcessRequest(), DpProcessResponse.class);

        var resp = restTemplate.getForEntity("/dpprocess", DpProcessPage.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody()).isNotNull();
        assertThat(resp.getBody().getContent()).hasSize(1);
        assertBody(resp.getBody().getContent().get(0));
    }

    @Test
    void updateDpProcess() {
        var request = createDpProcessRequest();
        var resp = restTemplate.postForEntity("/dpprocess", request, DpProcessResponse.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(resp.getBody()).isNotNull();
        String id = resp.getBody().getId().toString();

        request.setId(id);
        request.setName("name 2");
        resp = restTemplate.exchange("/dpprocess/{id}", HttpMethod.PUT, new HttpEntity<>(request), DpProcessResponse.class, id);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody()).isNotNull();
        assertThat(resp.getBody().getName()).isEqualTo("name 2");
    }

    @Test
    void deleteDpProcess() {
        var request = createDpProcessRequest();
        var resp = restTemplate.postForEntity("/dpprocess", request, DpProcessResponse.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(resp.getBody()).isNotNull();
        String id = resp.getBody().getId().toString();
        assertThat(dpProcessRepository.count()).isOne();

        restTemplate.delete("/dpprocess/{id}", id);
        assertThat(dpProcessRepository.count()).isZero();
    }

    private void assertBody(DpProcessResponse body) {
        assertThat(body).isNotNull();
        assertThat(body.getId()).isNotNull();
        assertThat(body.getChangeStamp()).isNotNull();
        // dont compare fluid values
        body.setId(null);
        body.setChangeStamp(null);
        assertThat(body).isEqualTo(DpProcessResponse.builder()
                .name("name")
                .dpProcessNumber(body.getDpProcessNumber())
                .affiliation(affiliationResponse())
                .externalProcessResponsible(CodelistStaticService.getCodelistResponse(ListName.THIRD_PARTY, "SKATT"))
                .start(LocalDate.now())
                .end(LocalDate.now().plusDays(1))
                .dataProcessingAgreement("Agreement 1")
                .subDataProcessing(dataProcessingResponse())
                .purposeDescription("purpose description")
                .description("description")
                .art9(true)
                .art10(true)
                .retention(dpRetentionResponse())
                .build());
    }

    private DpProcessRequest createDpProcessRequest() {
        return DpProcessRequest.builder()
                .name("name")
                .affiliation(affiliationRequest())
                .externalProcessResponsible("SKATT")
                .start(LocalDate.now().toString())
                .end(LocalDate.now().plusDays(1).toString())
                .dataProcessingAgreement("Agreement 1")
                .subDataProcessing(dataProcessingRequest())
                .purposeDescription("purpose description")
                .description("description")
                .art9(true)
                .art10(true)
                .retention(dpRetentionRequest())
                .build();
    }

    protected DpRetentionRequest dpRetentionRequest() {
        return DpRetentionRequest.builder().retentionMonths(24).retentionStart("Birth").build();
    }
}
