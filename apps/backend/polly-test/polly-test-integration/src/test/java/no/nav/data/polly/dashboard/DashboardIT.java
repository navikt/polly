package no.nav.data.polly.dashboard;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.dashboard.dto.DashResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

public class DashboardIT extends IntegrationTestBase {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void getProcess() {
        createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());

        ResponseEntity<DashResponse> resp = restTemplate.getForEntity("/dash", DashResponse.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

}
