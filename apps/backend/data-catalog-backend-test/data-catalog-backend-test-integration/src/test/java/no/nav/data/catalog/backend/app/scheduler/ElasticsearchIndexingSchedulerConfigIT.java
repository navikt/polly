package no.nav.data.catalog.backend.app.scheduler;

import no.nav.data.catalog.backend.app.IntegrationTestBase;
import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchDatasetService;
import org.awaitility.Duration;
import org.junit.Test;
import org.springframework.boot.test.mock.mockito.SpyBean;

import static org.awaitility.Awaitility.await;
import static org.mockito.Mockito.verify;
import static org.mockito.internal.verification.VerificationModeFactory.times;

public class ElasticsearchIndexingSchedulerConfigIT extends IntegrationTestBase {

    @SpyBean
    private ElasticsearchDatasetService service;

    @Test
    public void jobRuns() {
        await().atMost(Duration.ONE_MINUTE)
                .untilAsserted(() -> verify(service, times(1)).synchToElasticsearch());
    }
}
