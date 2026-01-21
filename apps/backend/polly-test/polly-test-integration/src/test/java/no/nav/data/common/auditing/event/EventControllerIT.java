package no.nav.data.common.auditing.event;

import no.nav.data.common.auditing.domain.Action;
import no.nav.data.common.auditing.domain.AuditVersion;
import no.nav.data.common.auditing.domain.AuditVersionRepository;
import no.nav.data.common.auditing.event.EventController.EventPage;
import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.process.domain.Process;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static org.assertj.core.api.Assertions.assertThat;

public class EventControllerIT extends IntegrationTestBase {

    @Autowired
    private AuditVersionRepository auditVersionRepository;

    @BeforeEach
    void setUp() {
        auditVersionRepository.deleteAll();
    }

    @Test
    void getAllChanges() {
        createAndSaveInformationType();

        EventPage body = webTestClient.get()
                .uri(uriBuilder -> uriBuilder.path("/event")
                        .queryParam("table", AuditVersion.tableName(InformationType.class))
                        .queryParam("action", Action.CREATE)
                        .build())
                .exchange()
                .expectStatus().isOk()
                .expectBody(EventPage.class)
                .returnResult()
                .getResponseBody();

        assertThat(body).isNotNull();
        assertThat(body.getNumberOfElements()).isEqualTo(1);
    }

    @Test
    void getProcessObject() {
        createAndSaveInformationType();
        var process = createAndSaveProcess(PURPOSE_CODE1);
        processRepository.delete(createAndSaveProcess(PURPOSE_CODE1 + 2));

        EventPage body = webTestClient.get()
                .uri(uriBuilder -> uriBuilder.path("/event")
                        .queryParam("table", AuditVersion.tableName(Process.class))
                        .queryParam("action", Action.CREATE)
                        .build())
                .exchange()
                .expectStatus().isOk()
                .expectBody(EventPage.class)
                .returnResult()
                .getResponseBody();

        assertThat(body).isNotNull();
        assertThat(body.getNumberOfElements()).isEqualTo(1);
        assertThat(body.getContent().get(0).getTableId()).isEqualTo(process.getId().toString());
    }
}
