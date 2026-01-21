package no.nav.data.common.auditing.event;

import no.nav.data.common.auditing.domain.Action;
import no.nav.data.common.auditing.domain.AuditVersion;
import no.nav.data.common.auditing.domain.AuditVersionRepository;
import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.common.utils.JsonUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Map;
import java.util.List;

public class EventControllerIT extends IntegrationTestBase {

    @Autowired
    private AuditVersionRepository auditVersionRepository;

    @BeforeEach
    void setUp() {
        auditVersionRepository.deleteAll();
    }

    @Test
    void getAllChanges() {
        var infoType = createAndSaveInformationType();

        auditVersionRepository.save(AuditVersion.builder()
                .action(Action.CREATE)
                .table(AuditVersion.tableName(InformationType.class))
                .tableId(infoType.getId().toString())
                .user("test")
                .data(JsonUtils.toJson(Map.of(
                        "id", infoType.getId(),
                        "name", infoType.getData().getName(),
                        "data", Map.of("name", infoType.getData().getName())
                )))
                .build());

        webTestClient.get()
                .uri(uriBuilder -> uriBuilder.path("/event")
                        .queryParam("table", AuditVersion.tableName(InformationType.class))
                        .queryParam("action", Action.CREATE)
                        .build())
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.numberOfElements").isEqualTo(1);
    }

    @Test
    void getProcessObject() {
        createAndSaveInformationType();
        var process = createAndSaveProcess(PURPOSE_CODE1);
        processRepository.delete(createAndSaveProcess(PURPOSE_CODE1 + 2));

        auditVersionRepository.save(AuditVersion.builder()
                .action(Action.CREATE)
                .table(AuditVersion.tableName(Process.class))
                .tableId(process.getId().toString())
                .user("test")
                .data(JsonUtils.toJson(Map.of(
                        "id", process.getId(),
                        "purposeCode", PURPOSE_CODE1,
                        "data", Map.of(
                                "name", "Auto_" + PURPOSE_CODE1,
                                "purposes", List.of(PURPOSE_CODE1)
                        )
                )))
                .build());

        webTestClient.get()
                .uri(uriBuilder -> uriBuilder.path("/event")
                        .queryParam("table", AuditVersion.tableName(Process.class))
                        .queryParam("action", Action.CREATE)
                        .build())
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.numberOfElements").isEqualTo(1)
                .jsonPath("$.content[0].tableId").isEqualTo(process.getId().toString());
    }
}
