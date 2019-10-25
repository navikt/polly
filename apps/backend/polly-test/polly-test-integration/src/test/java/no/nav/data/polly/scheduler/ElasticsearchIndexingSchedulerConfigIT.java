package no.nav.data.polly.scheduler;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.elasticsearch.ElasticsearchService;
import org.awaitility.Duration;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.mock.mockito.SpyBean;

import static org.awaitility.Awaitility.await;
import static org.mockito.Mockito.verify;
import static org.mockito.internal.verification.VerificationModeFactory.times;

public class ElasticsearchIndexingSchedulerConfigIT extends IntegrationTestBase {

    @SpyBean
    private ElasticsearchService service;

    @Test
    void jobRuns() {
        await().atMost(Duration.ONE_MINUTE)
                .untilAsserted(() -> verify(service, times(1)).synchToElasticsearch());
    }
}
