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
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;

import static org.assertj.core.api.Assertions.assertThat;

public class EventControllerIT extends IntegrationTestBase {

    @Autowired
    private TestRestTemplate template;
    @Autowired
    private AuditVersionRepository auditVersionRepository;

    @BeforeEach
    void setUp() {
        auditVersionRepository.deleteAll();
    }

    @Test
    void getAllChanges() {
        createAndSaveInformationType();

        var resp = template.getForEntity("/event?table={table}", EventPage.class, AuditVersion.tableName(InformationType.class));
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);

        assertThat(resp.getBody()).isNotNull();
        assertThat(resp.getBody().getNumberOfElements()).isEqualTo(1);
    }

    @Test
    void getProcessObject() {
        createAndSaveInformationType();
        createAndSaveProcess(PROCESS_NAME_1 + 1);
        var process = createAndSaveProcess(PURPOSE_CODE1);

        var resp = template.getForEntity("/event?table={table}&action={action}&tableId={id}", EventPage.class,
                AuditVersion.tableName(Process.class),
                Action.CREATE,
                process.getId()
        );

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody()).isNotNull();
        assertThat(resp.getBody().getNumberOfElements()).isEqualTo(1);
    }
}
