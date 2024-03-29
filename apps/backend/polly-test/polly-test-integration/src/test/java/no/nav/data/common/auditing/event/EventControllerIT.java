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

        var resp = template.getForEntity("/event?table={table}&action={action}", EventPage.class, AuditVersion.tableName(InformationType.class), Action.CREATE);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);

        assertThat(resp.getBody()).isNotNull();
        assertThat(resp.getBody().getNumberOfElements()).isEqualTo(1);
    }

    @Test
    void getProcessObject() {
        createAndSaveInformationType();
        var process = createAndSaveProcess(PURPOSE_CODE1);
        processRepository.delete(createAndSaveProcess(PURPOSE_CODE1 + 2));

        var resp = template.getForEntity("/event?table={table}&action={action}",
                EventPage.class, AuditVersion.tableName(Process.class), Action.CREATE);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody()).isNotNull();
        assertThat(resp.getBody().getNumberOfElements()).isEqualTo(1);
        assertThat(resp.getBody().getContent().get(0).getTableId()).isEqualTo(process.getId().toString());
    }
}
