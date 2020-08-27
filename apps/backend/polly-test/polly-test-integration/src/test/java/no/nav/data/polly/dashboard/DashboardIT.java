package no.nav.data.polly.dashboard;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.dashboard.dto.DashResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static no.nav.data.common.utils.StreamUtils.get;
import static org.assertj.core.api.Assertions.assertThat;

class DashboardIT extends IntegrationTestBase {

    @Autowired
    private TestRestTemplate restTemplate;

    @BeforeEach
    void setUp() {
        createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());
        var p2 = createAndSaveProcess(PURPOSE_CODE2);
        p2.getData().getDpia().setNeedForDpia(null);
        processRepository.save(p2);
    }

    @Test
    void getDash() {
        ResponseEntity<DashResponse> resp = restTemplate.getForEntity("/dash", DashResponse.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);

        DashResponse response = resp.getBody();
        assertThat(response).isNotNull();
        assertThat(get(response.getDepartmentProcesses(), d -> d.getDepartment().equals("DEP")).getProcessesInProgress()).isEqualTo(2L);
        assertThat(response.getAllProcesses().getProcessesInProgress()).isEqualTo(2L);
    }

    @Test
    void getDashNoSql() {
        ResponseEntity<DashResponse> resp = restTemplate.getForEntity("/dash/nosql", DashResponse.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);

        DashResponse response = resp.getBody();
        assertThat(response).isNotNull();
        assertThat(get(response.getDepartmentProcesses(), d -> d.getDepartment().equals("DEP")).getProcessesInProgress()).isEqualTo(2L);
        assertThat(response.getAllProcesses().getProcessesInProgress()).isEqualTo(2L);
    }

    @Test
    void getDashForProcessInProgress() {
        ResponseEntity<DashResponse> resp = restTemplate.getForEntity("/dash?filter=IN_PROGRESS", DashResponse.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);

        DashResponse response = resp.getBody();
        assertThat(response).isNotNull();
        assertThat(get(response.getDepartmentProcesses(), d -> d.getDepartment().equals("DEP")).getProcessesInProgress()).isEqualTo(2L);
        assertThat(response.getAllProcesses().getProcessesInProgress()).isEqualTo(2L);
    }

}
