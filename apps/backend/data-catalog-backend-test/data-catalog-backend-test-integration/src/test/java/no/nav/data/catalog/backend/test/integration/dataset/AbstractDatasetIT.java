package no.nav.data.catalog.backend.test.integration.dataset;

import no.nav.data.catalog.backend.app.AppStarter;
import no.nav.data.catalog.backend.app.dataset.Dataset;
import no.nav.data.catalog.backend.app.dataset.DatasetData;
import no.nav.data.catalog.backend.app.dataset.DatasetService;
import no.nav.data.catalog.backend.app.dataset.repo.DatasetRelationRepository;
import no.nav.data.catalog.backend.app.dataset.repo.DatasetRepository;
import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus;
import no.nav.data.catalog.backend.test.component.PostgresTestContainer;
import no.nav.data.catalog.backend.test.integration.IntegrationTestConfig;
import org.junit.ClassRule;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.support.TransactionTemplate;

import java.util.Collections;
import java.util.Set;
import java.util.UUID;
import javax.persistence.EntityManager;

import static com.google.common.collect.Sets.newHashSet;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        classes = {IntegrationTestConfig.class, AppStarter.class})
@ActiveProfiles("test")
@ContextConfiguration(initializers = {PostgresTestContainer.Initializer.class})
public abstract class AbstractDatasetIT {

    @Autowired
    DatasetRepository datasetRepository;
    @Autowired
    DatasetRelationRepository datasetRelationRepository;
    @Autowired
    DatasetService datasetService;
    @Autowired
    EntityManager entityManager;
    @Autowired
    TransactionTemplate transactionTemplate;

    @ClassRule
    public static PostgresTestContainer postgreSQLContainer = PostgresTestContainer.getInstance();

    Dataset unrelated = createDataset("unrelated");
    Dataset dataset111 = createDataset("111");
    Dataset dataset12 = createDataset("12");
    Dataset dataset11 = createDataset("11", newHashSet(dataset111));
    Dataset dataset1 = createDataset("1", newHashSet(dataset11, dataset12));

    private Dataset createDataset(String name) {
        return createDataset(name, Collections.emptySet());
    }

    private Dataset createDataset(String name, Set<Dataset> children) {
        return Dataset.builder()
                .id(UUID.randomUUID())
                .elasticsearchStatus(ElasticsearchStatus.TO_BE_CREATED)
                .datasetData(DatasetData.builder()
                        .title(name).build())
                .children(children)
                .build();
    }
}
