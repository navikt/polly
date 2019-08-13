package no.nav.data.catalog.backend.app.informationtype;

import no.nav.data.catalog.backend.app.AppStarter;
import no.nav.data.catalog.backend.app.IntegrationTestConfig;
import no.nav.data.catalog.backend.app.codelist.CodelistService;
import no.nav.data.catalog.backend.app.codelist.ListName;
import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchRepository;
import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus;
import no.nav.data.catalog.backend.app.PostgresTestContainer;
import no.nav.data.catalog.backend.app.elasticsearch.FixedElasticsearchContainer;
import no.nav.data.catalog.backend.app.IntegrationTestBase;
import org.junit.After;
import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cloud.contract.wiremock.AutoConfigureWireMock;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.Map;

import static no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus.SYNCED;
import static no.nav.data.catalog.backend.app.informationtype.TestdataInformationTypes.CATEGORY_CODE;
import static no.nav.data.catalog.backend.app.informationtype.TestdataInformationTypes.CATEGORY_DESCRIPTION;
import static no.nav.data.catalog.backend.app.informationtype.TestdataInformationTypes.CATEGORY_MAP;
import static no.nav.data.catalog.backend.app.informationtype.TestdataInformationTypes.DESCRIPTION;
import static no.nav.data.catalog.backend.app.informationtype.TestdataInformationTypes.LIST_PRODUCER_MAP;
import static no.nav.data.catalog.backend.app.informationtype.TestdataInformationTypes.NAME;
import static no.nav.data.catalog.backend.app.informationtype.TestdataInformationTypes.PRODUCER_CODE_LIST;
import static no.nav.data.catalog.backend.app.informationtype.TestdataInformationTypes.PRODUCER_CODE_STRING;
import static no.nav.data.catalog.backend.app.informationtype.TestdataInformationTypes.PRODUCER_DESCRIPTION_LIST;
import static no.nav.data.catalog.backend.app.informationtype.TestdataInformationTypes.SYSTEM_CODE;
import static no.nav.data.catalog.backend.app.informationtype.TestdataInformationTypes.SYSTEM_DESCRIPTION;
import static no.nav.data.catalog.backend.app.informationtype.TestdataInformationTypes.SYSTEM_MAP;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE,
        classes = {IntegrationTestConfig.class, AppStarter.class})
@ActiveProfiles("test")
@ContextConfiguration(initializers = {PostgresTestContainer.Initializer.class})
@AutoConfigureWireMock(port = 0)
@Ignore
public class InformationTypeServiceIT extends IntegrationTestBase {
    @Autowired
    private InformationTypeService service;

    @Autowired
    private InformationTypeRepository repository;

    @Autowired
    private ElasticsearchRepository esRepository;

    @Autowired
    protected CodelistService codelistService;

    private static Map<ListName, Map<String, String>> codelists;

    @ClassRule
    public static PostgresTestContainer postgreSQLContainer = PostgresTestContainer.getInstance();

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
