package no.nav.data.catalog.backend.test.integration.dataset;

import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;

import javax.persistence.EntityManager;
import no.nav.data.catalog.backend.app.AppStarter;
import no.nav.data.catalog.backend.app.dataset.Dataset;
import no.nav.data.catalog.backend.app.dataset.DatasetData;
import no.nav.data.catalog.backend.app.dataset.DatasetRepository;
import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus;
import no.nav.data.catalog.backend.test.integration.IntegrationTestConfig;
import org.junit.ClassRule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.internal.util.collections.Sets;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.util.TestPropertyValues;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;
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
    private JdbcTemplate jdbcTemplate;
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

    @Test
    public void testSave() {
        var dataset0 = Dataset.builder()
                .id(UUID.randomUUID())
                .elasticsearchStatus(ElasticsearchStatus.TO_BE_CREATED)
                .datasetData(DatasetData.builder()
                        .name("foo").build())
                .build();
        var dataset1 = Dataset.builder()
                .id(UUID.randomUUID())
                .elasticsearchStatus(ElasticsearchStatus.TO_BE_CREATED)
                .datasetData(DatasetData.builder()
                        .name("bar").build())
                .build();
        var dataset2 = Dataset.builder()
                .id(UUID.randomUUID())
                .elasticsearchStatus(ElasticsearchStatus.TO_BE_CREATED)
                .datasetData(DatasetData.builder()
                        .name("hei").build())
                .children(Sets.newSet(dataset0, dataset1))
                .build();

        datasetRepository.saveAll(Sets.newSet(dataset0, dataset1, dataset2));
        datasetRepository.flush();
        entityManager.clear();

        var children = transactionTemplate.execute((status) -> {
            Optional<Dataset> byId = datasetRepository.findById(dataset2.getId());
            assertTrue(byId.isPresent());
            return new ArrayList<>(byId.get().getChildren());
        });

        System.out.println(children);
        assertThat(children, hasSize(2));
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
