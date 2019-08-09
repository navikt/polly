package no.nav.data.catalog.backend.test.integration.scheduler;

import no.nav.data.catalog.backend.app.informationtype.InformationTypeService;
import no.nav.data.catalog.backend.test.integration.IntegrationTestBase;
import org.awaitility.Duration;
import org.junit.Test;
import org.springframework.boot.test.mock.mockito.SpyBean;

import static org.awaitility.Awaitility.await;
import static org.mockito.Mockito.verify;
import static org.mockito.internal.verification.VerificationModeFactory.times;

public class ElasticsearchIndexingSchedulerConfigTest extends IntegrationTestBase {

    @SpyBean
    private InformationTypeService service;

    @Test
    public void jobRuns() {
        await().atMost(Duration.ONE_MINUTE)
                .untilAsserted(() -> verify(service, times(1)).synchToElasticsearch());
    }
}
