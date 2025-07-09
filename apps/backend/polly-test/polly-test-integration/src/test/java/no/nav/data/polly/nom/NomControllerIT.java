package no.nav.data.polly.nom;

import no.nav.data.integration.nom.NomController.AvdelingList;
import no.nav.data.polly.IntegrationTestBase;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

public class NomControllerIT extends IntegrationTestBase {
    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void getNomAvdelinger() {
        ResponseEntity<AvdelingList> avdelinger = restTemplate.getForEntity("/nom/avdelinger", AvdelingList.class);
        assertThat(avdelinger.getBody()).isNotNull();
        assertThat(avdelinger.getBody().getContent()).hasSize(2);
    }



}
