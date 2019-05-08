package no.nav.data.catalog.backend.test.integration;

import no.nav.data.catalog.backend.app.AppStarter;
import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchRepository;
import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus;
import no.nav.data.catalog.backend.app.informationtype.InformationType;
import no.nav.data.catalog.backend.app.informationtype.InformationTypeRepository;
import no.nav.data.catalog.backend.app.informationtype.InformationTypeService;
import no.nav.data.catalog.backend.test.component.FixedElasticsearchContainer;
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
import org.testcontainers.containers.PostgreSQLContainer;

import java.time.Duration;
import java.util.Map;

import static no.nav.data.catalog.backend.app.common.utils.Constants.*;
import static no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus.SYNCED;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE,
        classes = {IntegrationTestConfig.class, AppStarter.class})
@ActiveProfiles("itest")
@ContextConfiguration(initializers = {InformationTypeServiceIT.Initializer.class})
public class InformationTypeServiceIT {
    @Autowired
    private InformationTypeService service;

    @Autowired
    private InformationTypeRepository repository;

    @Autowired
    private ElasticsearchRepository esRepository;

    @ClassRule
    public static PostgreSQLContainer postgreSQLContainer =
            (PostgreSQLContainer) new PostgreSQLContainer("postgres:10.4")
                    .withDatabaseName("sampledb")
                    .withUsername("sampleuser")
                    .withPassword("samplepwd")
                    .withStartupTimeout(Duration.ofSeconds(600));

    @ClassRule
    public static FixedElasticsearchContainer container = new FixedElasticsearchContainer("docker.elastic.co/elasticsearch/elasticsearch-oss:6.4.1");

    @Before
    public void init() {
        repository.deleteAll();
    }

    @Test
    public void syncNewInformationTypesToES() throws Exception {
        createTestData(ElasticsearchStatus.TO_BE_CREATED);
        service.synchToElasticsearch();
        // Let indexing finish
        Thread.sleep(1000L);
        assertThat(esRepository.getAllRecords().getHits().totalHits, is(1L));
        Map<String, Object> esMap = esRepository.getInformationTypeById("elasticSearchId");
        assertInformationType(esMap);
        InformationType informationType = repository.findAll().get(0);
        assertThat(informationType.getElasticsearchStatus(), is(SYNCED));
    }

    @Test
    public void syncUpdatedInformationTypesToES() throws Exception {
        createTestData(ElasticsearchStatus.TO_BE_CREATED);
        service.synchToElasticsearch();
        // Let indexing finish
        Thread.sleep(1000L);
        assertThat(esRepository.getAllRecords().getHits().totalHits, is(1L));

        assertThat(repository.findAll().size(), is(1));
        InformationType informationType = repository.findAll().get(0);
        informationType.setElasticsearchStatus(ElasticsearchStatus.TO_BE_UPDATED);
        repository.save(informationType);
        service.synchToElasticsearch();

        Thread.sleep(1000L);
        assertThat(esRepository.getAllRecords().getHits().totalHits, is(1L));
        Map<String, Object> esMap = esRepository.getInformationTypeById("elasticSearchId");
        assertInformationType(esMap);
        assertThat(repository.findAll().size(), is(1));
        informationType = repository.findAll().get(0);
        assertThat(informationType.getElasticsearchStatus(), is(SYNCED));
    }

    @Test
    public void syncNotExistingUpdatedInformationTypesToES() throws Exception {
        createTestData(ElasticsearchStatus.TO_BE_UPDATED);
        service.synchToElasticsearch();

        Thread.sleep(1000L);
        assertThat(esRepository.getAllRecords().getHits().totalHits, is(1L));
        Map<String, Object> esMap = esRepository.getInformationTypeById("elasticSearchId");
        assertInformationType(esMap);
        assertThat(repository.findAll().size(), is(1));
        InformationType informationType = repository.findAll().get(0);
        assertThat(informationType.getElasticsearchStatus(), is(SYNCED));
    }


    @Test
    public void syncDeletedInformationTypesToES() throws Exception {
        createTestData(ElasticsearchStatus.TO_BE_CREATED);
        service.synchToElasticsearch();
        // Let indexing finish
        Thread.sleep(1000L);
        assertThat(esRepository.getAllRecords().getHits().totalHits, is(1L));

        assertThat(repository.findAll().size(), is(1));
        InformationType informationType = repository.findAll().get(0);
        informationType.setElasticsearchStatus(ElasticsearchStatus.TO_BE_DELETED);
        repository.save(informationType);
        Map<String, Object> esMap = esRepository.getInformationTypeById("elasticSearchId");
        assertInformationType(esMap);

        service.synchToElasticsearch();

        Thread.sleep(1000L);
        assertThat(esRepository.getAllRecords().getHits().totalHits, is(0L));
        assertThat(repository.findAll().size(), is(0));
    }

    private void createTestData(ElasticsearchStatus esStatus) {
        InformationType informationType = InformationType.builder()
                .elasticsearchId("elasticSearchId")
                .category(INFORMATION_CATEGORY)
                .system(INFORMATION_SYSTEM)
                .elasticsearchStatus(esStatus)
                .name(INFORMATION_NAME)
                .description(INFORMATION_DESCRIPTION)
                .producer(INFORMATION_PRODUCER)
                .personalData(true).build();
        repository.save(informationType);
    }

    static class Initializer
            implements ApplicationContextInitializer<ConfigurableApplicationContext> {
        public void initialize(ConfigurableApplicationContext configurableApplicationContext) {
            TestPropertyValues.of(
                    "spring.datasource.url=" + postgreSQLContainer.getJdbcUrl(),
                    "spring.datasource.username=" + postgreSQLContainer.getUsername(),
                    "spring.datasource.password=" + postgreSQLContainer.getPassword()
            ).applyTo(configurableApplicationContext.getEnvironment());
        }
    }

    private void assertInformationType(Map<String, Object> esMap) {
        assertThat(esMap.get("informationProducer"), is(INFORMATION_PRODUCER));
        assertThat(esMap.get("informationSystem"), is(INFORMATION_SYSTEM));
        assertThat(esMap.get("personalData"), is(true));
        assertThat(esMap.get("name"), is(INFORMATION_NAME));
        assertThat(esMap.get("description"), is(INFORMATION_DESCRIPTION));
        assertThat(esMap.get("informationCategory"), is(INFORMATION_CATEGORY));
    }
}
