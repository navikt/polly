package no.nav.data.catalog.backend.app.dataset;

import no.nav.data.catalog.backend.app.IntegrationTestBase;
import no.nav.data.catalog.backend.app.PostgresTestContainer;
import no.nav.data.catalog.backend.app.dataset.repo.DatasetRelationRepository;
import no.nav.data.catalog.backend.app.dataset.repo.DatasetRepository;
import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannelRepository;
import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus;
import org.junit.Before;
import org.junit.ClassRule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.support.TransactionTemplate;

import java.util.Collections;
import java.util.Set;
import java.util.UUID;
import javax.persistence.EntityManager;

import static com.google.common.collect.Sets.newHashSet;

public abstract class AbstractDatasetIT extends IntegrationTestBase {

    @Autowired
    DatasetRepository datasetRepository;
    @Autowired
    DistributionChannelRepository distributionChannelRepository;
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

    @Before
    public void setUpAbstract() throws Exception {
        datasetRepository.deleteAll();
        entityManager.clear();
        dataset111 = datasetRepository.save(dataset111);
        dataset11 = datasetRepository.save(dataset11);
        dataset12 = datasetRepository.save(dataset12);
        dataset1 = datasetRepository.save(dataset1);
        unrelated = datasetRepository.save(unrelated);
    }

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
                .generateElasticsearchId()
                .elasticsearchStatus(ElasticsearchStatus.TO_BE_CREATED)
                .datasetData(DatasetData.builder()
                        .title(name).build())
                .children(children)
                .build();
    }
}
