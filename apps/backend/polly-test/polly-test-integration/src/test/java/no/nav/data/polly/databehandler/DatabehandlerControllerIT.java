package no.nav.data.polly.databehandler;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.codelist.CodelistStaticService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.databehandler.DatabehandlerController.DatabehandlerPage;
import no.nav.data.polly.databehandler.domain.Databehandler;
import no.nav.data.polly.databehandler.dto.DatabehandlerResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import no.nav.data.polly.test.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class DatabehandlerControllerIT extends IntegrationTestBase {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void createDatabehandler() {
        var request = createDatabehandlerRequest();
        var resp = restTemplate.postForEntity("/databehandler", request, DatabehandlerResponse.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertBody(resp.getBody());
    }

    @Test
    void getDatabehandler() {
        var request = createDatabehandlerRequest();
        var resp = restTemplate.postForEntity("/databehandler", request, DatabehandlerResponse.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(resp.getBody()).isNotNull();
        String id = resp.getBody().getId().toString();

        resp = restTemplate.getForEntity("/databehandler/{id}", DatabehandlerResponse.class, id);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertBody(resp.getBody());
    }

    @Test
    void searchDatabehandler() {
        restTemplate.postForEntity("/databehandler", createDatabehandlerRequest(), DatabehandlerResponse.class);

        var resp = restTemplate.getForEntity("/databehandler/search/{navn}", DatabehandlerPage.class, "navn");
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody()).isNotNull();
        assertThat(resp.getBody().getContent()).hasSize(1);
        assertBody(resp.getBody().getContent().get(0));
    }

    @Test
    void getAllDatabehandler() {
        restTemplate.postForEntity("/databehandler", createDatabehandlerRequest(), DatabehandlerResponse.class);

        var resp = restTemplate.getForEntity("/databehandler", DatabehandlerPage.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody()).isNotNull();
        assertThat(resp.getBody().getContent()).hasSize(1);
        assertBody(resp.getBody().getContent().get(0));
    }

    @Test
    void updateDatabehandler() {
        var request = createDatabehandlerRequest();
        var resp = restTemplate.postForEntity("/databehandler", request, DatabehandlerResponse.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(resp.getBody()).isNotNull();
        String id = resp.getBody().getId().toString();

        request.setId(id);
        request.setNavn("navn 2");
        resp = restTemplate.exchange("/databehandler/{id}", HttpMethod.PUT, new HttpEntity<>(request), DatabehandlerResponse.class, id);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody()).isNotNull();
        assertThat(resp.getBody().getNavn()).isEqualTo("navn 2");
    }

    @Test
    void deleteDatabehandler() {
        var resp = restTemplate.postForEntity("/databehandler", createDatabehandlerRequest(), DatabehandlerResponse.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(resp.getBody()).isNotNull();
        assertThat(databehandlerRepository.count()).isOne();

        restTemplate.delete("/databehandler/{id}", resp.getBody().getId().toString());
        assertThat(databehandlerRepository.count()).isZero();
    }

    @Test
    void deleteDatabehandlerFail() {
        var d = new Databehandler().convertFromRequest(createDatabehandlerRequest());
        d.setId(DATABEHANDLER_ID1);
        databehandlerRepository.save(d);
        assertThat(databehandlerRepository.count()).isOne();
        var process = createAndSaveProcess(PURPOSE_CODE1);
        process.getData().getDataProcessing().setProcessors(List.of(d.getId())); // TODO: databehandler
        processRepository.save(process);

        restTemplate.delete("/databehandler/{id}", DATABEHANDLER_ID1);

        assertThat(databehandlerRepository.count()).isOne();
    }

    private void assertBody(DatabehandlerResponse body) {
        assertThat(body).isNotNull();
        assertThat(body.getId()).isNotNull();
        assertThat(body.getChangeStamp()).isNotNull();
        // dont compare fluid values
        body.setId(null);
        body.setChangeStamp(null);
        body.setVersion(null);
        assertThat(body).isEqualTo(DatabehandlerResponse.builder()
                .navn("navn")
                .avtalereferanse("avtalereferanse")
                .avtaleeier("A123456")
                .leggTilFagansvarlig("A123456")
                .leggTilFagansvarlig("A123457")
                .merknad("merknad")

                .behandlingUtenforEuEos(true)
                .overforingsgrunnlagUtenforEuEos(CodelistStaticService.getCodelistResponse(ListName.TRANSFER_GROUNDS_OUTSIDE_EU, "OTHER"))
                .overforingsgrunnlagUtenforEuEosAnnet("reason")
                .leggTilLandDataOverforesTil("FJI")
                .build());
    }

}
