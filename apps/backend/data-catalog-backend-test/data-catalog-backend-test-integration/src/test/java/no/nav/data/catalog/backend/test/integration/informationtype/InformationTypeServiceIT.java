package no.nav.data.catalog.backend.test.integration.informationtype;

import no.nav.data.catalog.backend.app.AppStarter;
import no.nav.data.catalog.backend.app.codelist.CodelistService;
import no.nav.data.catalog.backend.app.codelist.ListName;
import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchRepository;
import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus;
import no.nav.data.catalog.backend.app.informationtype.InformationType;
import no.nav.data.catalog.backend.app.informationtype.InformationTypeRepository;
import no.nav.data.catalog.backend.app.informationtype.InformationTypeService;
import no.nav.data.catalog.backend.test.component.elasticsearch.FixedElasticsearchContainer;
import no.nav.data.catalog.backend.test.integration.IntegrationTestBase;
import no.nav.data.catalog.backend.test.integration.IntegrationTestConfig;
import org.junit.After;
import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.util.TestPropertyValues;
import org.springframework.cloud.contract.wiremock.AutoConfigureWireMock;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.testcontainers.containers.PostgreSQLContainer;

import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import static no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus.SYNCED;
import static no.nav.data.catalog.backend.test.integration.informationtype.TestdataInformationTypes.*;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE,
        classes = {IntegrationTestConfig.class, AppStarter.class})
@ActiveProfiles("itest")
@ContextConfiguration(initializers = {InformationTypeServiceIT.Initializer.class})
@AutoConfigureWireMock(port = 0)
public class InformationTypeServiceIT extends IntegrationTestBase {
    @Autowired
    private InformationTypeService service;

    @Autowired
    private InformationTypeRepository repository;

    @Autowired
    private ElasticsearchRepository esRepository;

    @Autowired
    protected CodelistService codelistService;

    private static HashMap<ListName, HashMap<String, String>> codelists;

    @ClassRule
    public static PostgreSQLContainer postgreSQLContainer =
            (PostgreSQLContainer) new PostgreSQLContainer("postgres:10.4")
                    .withDatabaseName("sampledb")
                    .withUsername("sampleuser")
                    .withPassword("samplepwd")
                    .withStartupTimeout(Duration.ofSeconds(600));

    @ClassRule
    public static FixedElasticsearchContainer container = new FixedElasticsearchContainer("docker.elastic.co/elasticsearch/elasticsearch-oss:6.6.1");

    @Before
    public void setUp() {
        repository.deleteAll();
        initializeCodelists();
        policyStubbing();
    }

    @After
    public void cleanUp() {
        repository.deleteAll();
    }

    private void initializeCodelists() {
        codelists = CodelistService.codelists;
        codelists.get(ListName.CATEGORY).put(CATEGORY_CODE, CATEGORY_DESCRIPTION);
        codelists.get(ListName.PRODUCER).put(PRODUCER_CODE_LIST.get(0), PRODUCER_DESCRIPTION_LIST.get(0));
        codelists.get(ListName.PRODUCER).put(PRODUCER_CODE_LIST.get(1), PRODUCER_DESCRIPTION_LIST.get(1));
        codelists.get(ListName.SYSTEM).put(SYSTEM_CODE, SYSTEM_DESCRIPTION);
    }

    @Test
    public void syncNewInformationTypesToES() throws Exception {
        createTestData(ElasticsearchStatus.TO_BE_CREATED);
        service.synchToElasticsearch();
        // Let indexing finish
        Thread.sleep(1000L);
        assertThat(esRepository.getAllInformationTypes().getHits().totalHits, is(1L));
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
        assertThat(esRepository.getAllInformationTypes().getHits().totalHits, is(1L));

        assertThat(repository.findAll().size(), is(1));
        InformationType informationType = repository.findAll().get(0);
        informationType.setElasticsearchStatus(ElasticsearchStatus.TO_BE_UPDATED);
        repository.save(informationType);
        service.synchToElasticsearch();

        Thread.sleep(1000L);
        assertThat(esRepository.getAllInformationTypes().getHits().totalHits, is(1L));
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
        assertThat(esRepository.getAllInformationTypes().getHits().totalHits, is(1L));
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
        assertThat(esRepository.getAllInformationTypes().getHits().totalHits, is(1L));

        assertThat(repository.findAll().size(), is(1));
        InformationType informationType = repository.findAll().get(0);
        informationType.setElasticsearchStatus(ElasticsearchStatus.TO_BE_DELETED);
        repository.save(informationType);
        Map<String, Object> esMap = esRepository.getInformationTypeById("elasticSearchId");
        assertInformationType(esMap);

        service.synchToElasticsearch();

        Thread.sleep(1000L);
        assertThat(esRepository.getAllInformationTypes().getHits().totalHits, is(0L));
        assertThat(repository.findAll().size(), is(0));
    }

    private void createTestData(ElasticsearchStatus esStatus) {
        InformationType informationType = InformationType.builder()
                .elasticsearchId("elasticSearchId")
                .categoryCode(CATEGORY_CODE)
                .systemCode(SYSTEM_CODE)
                .elasticsearchStatus(esStatus)
                .name(NAME)
                .description(DESCRIPTION)
                .producerCode(PRODUCER_CODE_STRING)
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
        assertThat(esMap.get("name"), is(NAME));
        assertThat(esMap.get("description"), is(DESCRIPTION));
        assertThat(esMap.get("personalData"), is(true));
        assertThat(esMap.get("category"), is(CATEGORY_MAP));
        assertThat(esMap.get("producer"), is(LIST_PRODUCER_MAP));
        assertThat(esMap.get("system"), is(SYSTEM_MAP));
        ArrayList<Map<String, Object>> policies = (ArrayList<Map<String, Object>>) esMap.get("policies");
        assertThat(policies.size(), is(2));
        assertPolicies0(policies.get(0));
        assertPolicies1(policies.get(1));
    }

    private void assertPolicies0(Map<String, Object> policyMap) {
        assertThat(policyMap.get("policyId"),is(1));
        assertThat(policyMap.get("purpose"),is(Map.of("code", "KTR", "description", "Kontroll")));
        assertThat(policyMap.get("legalBasisDescription"),is("LB description"));
    }

    private void assertPolicies1(Map<String, Object> policyMap) {
        assertThat(policyMap.get("policyId"),is(2));
        assertThat(policyMap.get("purpose"),is(Map.of("code", "AAP", "description", "Arbeidsavklaringspenger")));
        assertThat(policyMap.get("legalBasisDescription"),is("Ftrl. § 11-20"));
    }
}
