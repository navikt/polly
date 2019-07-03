package no.nav.data.catalog.backend.test.integration.dataset;

import static com.google.common.collect.Sets.newHashSet;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import javax.persistence.EntityManager;
import no.nav.data.catalog.backend.app.AppStarter;
import no.nav.data.catalog.backend.app.dataset.Dataset;
import no.nav.data.catalog.backend.app.dataset.DatasetData;
import no.nav.data.catalog.backend.app.dataset.DatasetRelation;
import no.nav.data.catalog.backend.app.dataset.DatasetRelationRepository;
import no.nav.data.catalog.backend.app.dataset.DatasetRepository;
import no.nav.data.catalog.backend.app.dataset.DatasetResponse;
import no.nav.data.catalog.backend.app.dataset.DatasetService;
import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus;
import no.nav.data.catalog.backend.test.integration.IntegrationTestConfig;
import org.jetbrains.annotations.NotNull;
import org.junit.After;
import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.util.TestPropertyValues;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.support.TransactionTemplate;
import org.testcontainers.containers.PostgreSQLContainer;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        classes = {IntegrationTestConfig.class, AppStarter.class})
@ActiveProfiles("itest")
@ContextConfiguration(initializers = {DatasetIT.Initializer.class})
public class DatasetIT {

    @Autowired
    private DatasetRepository datasetRepository;
    @Autowired
    private DatasetRelationRepository datasetRelationRepository;
    @Autowired
    private DatasetService datasetService;
    @Autowired
    private EntityManager entityManager;
    @Autowired
    private TransactionTemplate transactionTemplate;

    @ClassRule
    public static PostgreSQLContainer postgreSQLContainer =
            (PostgreSQLContainer) new PostgreSQLContainer("postgres:10.4")
                    .withDatabaseName("sampledb")
                    .withUsername("sampleuser")
                    .withPassword("samplepwd")
                    .withStartupTimeout(Duration.ofSeconds(600));

    private Dataset unrelated = createDataset("unrelated");
    private Dataset dataset111 = createDataset("111");
    private Dataset dataset12 = createDataset("12");
    private Dataset dataset11 = createDataset("11", newHashSet(dataset111));
    private Dataset dataset1 = createDataset("1", newHashSet(dataset11, dataset12));

    @Before
    public void setUp() {
        datasetRepository.deleteAll();
        datasetRepository.saveAll(Arrays.asList(dataset111, dataset11, dataset12, dataset1, unrelated));
        entityManager.clear();
    }

    @After
    public void tearDown() {
        datasetRepository.deleteAll();
    }

    @Test
    public void testLoad() {
        assertThat(datasetRepository.getOne(unrelated.getId()).getId(), is(unrelated.getId()));
    }

    @Test
    public void testRelations() {
        var children = transactionTemplate.execute((status) -> {
            Optional<Dataset> byId = datasetRepository.findById(dataset1.getId());
            assertTrue(byId.isPresent());
            return new ArrayList<>(byId.get().getChildren());
        });
        assertThat(children, hasSize(2));

        Set<DatasetRelation> allChildren = datasetRelationRepository.findAllChildrenOf(dataset1.getId());
        assertThat(allChildren, hasSize(3));
        assertThat(allChildren, containsInAnyOrder(
                new DatasetRelation(dataset1.getId(), dataset11.getId()),
                new DatasetRelation(dataset1.getId(), dataset12.getId()),
                new DatasetRelation(dataset11.getId(), dataset111.getId())
        ));

        Set<DatasetRelation> allParents = datasetRelationRepository.findAllParentsOf(dataset111.getId());
        assertThat(allParents, hasSize(2));
        assertThat(allParents, containsInAnyOrder(
                new DatasetRelation(dataset1.getId(), dataset11.getId()),
                new DatasetRelation(dataset11.getId(), dataset111.getId())
        ));
    }

    @Test
    public void getDatasetResponseTree() {
        Optional<DatasetResponse> datasetResponseOptional = datasetService.findDatasetWithChildren(dataset1.getId());
        assertTrue(datasetResponseOptional.isPresent());
        DatasetResponse datasetResponse = datasetResponseOptional.get();

        assertThat(datasetResponse.getId(), is(dataset1.getId()));
        assertThat(datasetResponse.getChildren(), hasSize(2));
        DatasetResponse datasetResponse11 = findChildByTitle(datasetResponse, "11");
        DatasetResponse datasetResponse12 = findChildByTitle(datasetResponse, "12");
        assertThat(datasetResponse11.getChildren(), hasSize(1));
        assertThat(datasetResponse12.getChildren(), hasSize(0));
        assertThat(findChildByTitle(datasetResponse11, "111").getChildren(), hasSize(0));
    }

    @Test
    public void findRootDataset() {
        List<Dataset> allRootDatasets = datasetRepository.findAllRootDatasets();
        assertThat(allRootDatasets, hasSize(2));
    }

    @NotNull
    private DatasetResponse findChildByTitle(DatasetResponse dataset, String title) {
        Optional<DatasetResponse> optional = dataset.getChildren().stream().filter(ds -> ds.getTitle().equals(title)).findFirst();
        assertTrue(title + " child missing from " + dataset.getTitle(), optional.isPresent());
        return optional.get();
    }

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

    static class Initializer
            implements ApplicationContextInitializer<ConfigurableApplicationContext> {

        public void initialize(ConfigurableApplicationContext configurableApplicationContext) {
            TestPropertyValues.of(
                    "spring.datasource.url=" + postgreSQLContainer.getJdbcUrl(),
                    "spring.datasource.username=" + postgreSQLContainer.getUsername(),
                    "spring.datasource.password=" + postgreSQLContainer.getPassword(),
                    "spring.jpa.show-sql=true",
                    "spring.jpa.properties.hibernate.use_sql_comments=true",
                    "logging.level.org.hibernate.type=TRACE",
                    "spring.jpa.properties.hibernate.format_sql=true"
            ).applyTo(configurableApplicationContext.getEnvironment());
        }
    }
}
