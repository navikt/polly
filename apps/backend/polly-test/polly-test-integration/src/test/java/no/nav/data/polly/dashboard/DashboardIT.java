package no.nav.data.polly.dashboard;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.dashboard.dto.DashResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static no.nav.data.common.utils.StreamUtils.get;
import static org.assertj.core.api.Assertions.assertThat;

class DashboardIT extends IntegrationTestBase {

    @BeforeEach
    void setUp() {
        createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());
        var p2 = createAndSaveProcess(PURPOSE_CODE2);
        p2.getData().getDpia().setNeedForDpia(null);
        processRepository.save(p2);
    }

    @Test
    void getDash() {
        DashResponse response = webTestClient.get()
                .uri("/dash")
                .exchange()
                .expectStatus().isOk()
                .expectBody(DashResponse.class)
                .returnResult()
                .getResponseBody();

        assertThat(response).isNotNull();
        assertThat(get(response.getDepartments(), d -> d.getDepartment().equals("DEP")).getProcessesInProgress()).isEqualTo(2L);
        assertThat(response.getAll().getProcessesInProgress()).isEqualTo(2L);
    }

    @Test
    void getDashForProcessInProgress() {
        DashResponse response = webTestClient.get()
                .uri("/dash?filter=IN_PROGRESS")
                .exchange()
                .expectStatus().isOk()
                .expectBody(DashResponse.class)
                .returnResult()
                .getResponseBody();

        assertThat(response).isNotNull();
        assertThat(get(response.getDepartments(), d -> d.getDepartment().equals("DEP")).getProcessesInProgress()).isEqualTo(2L);
        assertThat(response.getAll().getProcessesInProgress()).isEqualTo(2L);
    }

}
