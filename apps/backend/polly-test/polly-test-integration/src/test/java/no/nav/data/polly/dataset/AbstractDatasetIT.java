package no.nav.data.polly.dataset;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.dataset.repo.DatasetRelationRepository;
import no.nav.data.polly.dataset.repo.DatasetRepository;
import no.nav.data.polly.elasticsearch.ElasticsearchStatus;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import javax.persistence.EntityManager;

import static com.google.common.collect.Sets.newHashSet;
import static no.nav.data.polly.dataset.DatacatalogMaster.REST;

public abstract class AbstractDatasetIT extends IntegrationTestBase {

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

    @BeforeEach
    public void setUpAbstract() throws Exception {
        datasetRepository.deleteAll();
        entityManager.clear();
    }

    void saveDatasets() {
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
    LocalDateTime localDateTime = LocalDateTime.now();

    Dataset createDataset(String name) {
        return createDataset(name, Collections.emptySet());
    }

    private Dataset createDataset(String name, Set<Dataset> children) {
        return Dataset.builder()
                .id(UUID.randomUUID())
                .elasticsearchStatus(ElasticsearchStatus.SYNCED)
                .datasetData(DatasetData.builder()
                        .contentType(ContentType.DATASET)
                        .title(name)
                        .description("Description")
                        .categories(List.of("Category"))
                        .provenances(List.of("ARBEIDSGIVER"))
                        .pi(false)
                        .issued(localDateTime)
                        .keywords(List.of("Keywords"))
                        .themes(Collections.singletonList("Theme"))
                        .accessRights("AccessRights")
                        .publisher("Publisher")
                        .spatial("Spatial")
                        .haspart(List.of("Haspart"))
                        .datacatalogMaster(REST)
                        .build())
                .children(children)
                .build();
    }
}
