package no.nav.data.catalog.backend.test.component.scheduler;

import no.nav.data.catalog.backend.app.informationtype.InformationTypeService;
import no.nav.data.catalog.backend.test.component.ComponentTestConfig;
import org.awaitility.Duration;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.test.context.junit4.SpringRunner;

import static org.awaitility.Awaitility.await;
import static org.mockito.Mockito.verify;
import static org.mockito.internal.verification.VerificationModeFactory.times;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = ComponentTestConfig.class)
public class ElasticsearchIndexingSchedulerConfigTest {
    @SpyBean
    private InformationTypeService service;

    @Test
    public void jobRuns() {
        await().atMost(Duration.TEN_SECONDS)
                .untilAsserted(() -> verify(service, times(1)).synchToElasticsearch());
    }
}
