package no.nav.data.catalog.backend.test.integration.scheduler;

import no.nav.data.catalog.backend.app.AppStarter;
import no.nav.data.catalog.backend.app.informationtype.InformationTypeService;
import no.nav.data.catalog.backend.test.component.PostgresTestContainer;
import org.awaitility.Duration;
import org.junit.ClassRule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

import static org.awaitility.Awaitility.await;
import static org.mockito.Mockito.verify;
import static org.mockito.internal.verification.VerificationModeFactory.times;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = AppStarter.class)
@ActiveProfiles("test")
@ContextConfiguration(initializers = {PostgresTestContainer.Initializer.class})
public class ElasticsearchIndexingSchedulerConfigTest {

    @SpyBean
    private InformationTypeService service;

    @ClassRule
    public static PostgresTestContainer postgresTestContainer = PostgresTestContainer.getInstance();

    @Test
    public void jobRuns() {
        await().atMost(Duration.ONE_MINUTE)
                .untilAsserted(() -> verify(service, times(1)).synchToElasticsearch());
    }
}
