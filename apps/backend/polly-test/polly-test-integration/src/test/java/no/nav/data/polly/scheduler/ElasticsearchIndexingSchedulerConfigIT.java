package no.nav.data.polly.scheduler;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.elasticsearch.ElasticsearchService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.mock.mockito.SpyBean;

import java.time.Duration;

import static org.awaitility.Awaitility.await;
import static org.mockito.Mockito.verify;
import static org.mockito.internal.verification.VerificationModeFactory.times;

public class ElasticsearchIndexingSchedulerConfigIT extends IntegrationTestBase {

    @SpyBean
    private ElasticsearchService service;

    @Test
    void jobRuns() {
        await().atMost(Duration.ofSeconds(10))
                .untilAsserted(() -> verify(service, times(1)).synchToElasticsearch());
    }
}
