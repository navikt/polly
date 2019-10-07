package no.nav.data.catalog.backend.app.elasticsearch;

import com.github.tomakehurst.wiremock.client.WireMock;
import no.nav.data.catalog.backend.app.IntegrationTestBase;
import no.nav.data.catalog.backend.app.codelist.CodelistService;
import no.nav.data.catalog.backend.app.codelist.CodelistStub;
import no.nav.data.catalog.backend.app.common.utils.JsonUtils;
import no.nav.data.catalog.backend.app.dataset.Dataset;
import no.nav.data.catalog.backend.app.dataset.DatasetData;
import no.nav.data.catalog.backend.app.dataset.repo.DatasetRepository;
import no.nav.data.catalog.backend.app.elasticsearch.domain.DatasetElasticsearch;
import no.nav.data.catalog.backend.app.elasticsearch.domain.PolicyElasticsearch;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

import static com.github.tomakehurst.wiremock.client.WireMock.deleteRequestedFor;
import static com.github.tomakehurst.wiremock.client.WireMock.equalTo;
import static com.github.tomakehurst.wiremock.client.WireMock.urlPathEqualTo;
import static no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchDocument.newDatasetDocumentId;
import static no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus.SYNCED;
import static org.assertj.core.api.Assertions.assertThat;

class ElasticsearchDatasetServiceIT extends IntegrationTestBase {

    private static final String TITLE = "title";
    private static final String DESCRIPTION = "desc";


    @Autowired
    private ElasticsearchDatasetService service;

    @Autowired
    private DatasetRepository repository;

    @Autowired
    private ElasticsearchRepository esRepository;

    @Autowired
    protected CodelistService codelistService;

    private static FixedElasticsearchContainer container = new FixedElasticsearchContainer("docker.elastic.co/elasticsearch/elasticsearch-oss:6.6.1", ELASTICSEARCH_PORT);

    @BeforeAll
    static void setUpAll() {
        container.start();
    }

    @BeforeEach
    void setUp() {
        repository.deleteAll();
        initializeCodelists();
        policyStubbing();
    }

    @AfterEach
    void cleanUp() {
        repository.deleteAll();
    }

    @AfterAll
    static void cleanUpAll() {
        container.stop();
    }

    private void initializeCodelists() {
        CodelistStub.initializeCodelist();
    }

    @Test
    void syncNewDatasetsToES() throws Exception {
        createTestData(ElasticsearchStatus.TO_BE_CREATED);
        service.synchToElasticsearch();
        // Let indexing finish
        Thread.sleep(1000L);
        assertThat(esRepository.getAllDatasets("index").getHits().totalHits).isEqualTo(1L);
        String json = esRepository.getById(newDatasetDocumentId(DATASET_ID_1.toString(), "index"));
        assertDataset(json);
        Dataset dataset = repository.findAll().get(0);
        assertThat(dataset.getElasticsearchStatus()).isEqualTo(SYNCED);
    }

    @Test
    void syncUpdatedDatasetsToES() throws Exception {
        createTestData(ElasticsearchStatus.TO_BE_CREATED);
        service.synchToElasticsearch();
        // Let indexing finish
        Thread.sleep(1000L);
        assertThat(esRepository.getAllDatasets("index").getHits().totalHits).isEqualTo(1L);

        assertThat(repository.findAll().size()).isEqualTo(1);
        Dataset dataset = repository.findAll().get(0);
        dataset.setElasticsearchStatus(ElasticsearchStatus.TO_BE_UPDATED);
        repository.save(dataset);
        service.synchToElasticsearch();

        Thread.sleep(1000L);
        assertThat(esRepository.getAllDatasets("index").getHits().totalHits).isEqualTo(1L);
        String json = esRepository.getById(newDatasetDocumentId(DATASET_ID_1.toString(), "index"));
        assertDataset(json);

        assertThat(repository.findAll().size()).isEqualTo(1);
        dataset = repository.findAll().get(0);
        assertThat(dataset.getElasticsearchStatus()).isEqualTo(SYNCED);
    }

    @Test
    void syncNotExistingUpdatedDatasetsToES() throws Exception {
        createTestData(ElasticsearchStatus.TO_BE_UPDATED);
        service.synchToElasticsearch();

        Thread.sleep(1000L);
        assertThat(esRepository.getAllDatasets("index").getHits().totalHits).isEqualTo(1L);
        String json = esRepository.getById(newDatasetDocumentId(DATASET_ID_1.toString(), "index"));
        assertDataset(json);

        assertThat(repository.findAll().size()).isEqualTo(1);
        Dataset dataset = repository.findAll().get(0);
        assertThat(dataset.getElasticsearchStatus()).isEqualTo(SYNCED);
    }


    @Test
    void syncDeletedDatasetsToES() throws Exception {
        createTestData(ElasticsearchStatus.TO_BE_CREATED);
        service.synchToElasticsearch();
        // Let indexing finish
        Thread.sleep(1000L);
        assertThat(esRepository.getAllDatasets("index").getHits().totalHits).isEqualTo(1L);

        assertThat(repository.findAll().size()).isEqualTo(1);
        Dataset dataset = repository.findAll().get(0);
        dataset.setElasticsearchStatus(ElasticsearchStatus.TO_BE_DELETED);
        repository.save(dataset);
        String json = esRepository.getById(newDatasetDocumentId(DATASET_ID_1.toString(), "index"));
        assertDataset(json);

        service.synchToElasticsearch();

        Thread.sleep(1000L);
        assertThat(esRepository.getAllDatasets("index").getHits().totalHits).isEqualTo(0L);
        assertThat(repository.findAll().size()).isEqualTo(0);
        WireMock.verify(deleteRequestedFor(urlPathEqualTo("/policy/policy")).withQueryParam("datasetId", equalTo(DATASET_ID_1.toString())));
    }

    private void createTestData(ElasticsearchStatus esStatus) {
        Dataset dataset = Dataset.builder()
                .id(DATASET_ID_1)
                .elasticsearchStatus(esStatus)
                .datasetData(DatasetData.builder()
                        .title(TITLE)
                        .description(DESCRIPTION)
                        .provenances(List.of("ARBEIDSGIVER"))
                        .categories(List.of("PERSONALIA"))
                        .pi(true)
                        .build())
                .build();
        repository.save(dataset);
    }

    private void assertDataset(String json) {
        var dataset = JsonUtils.toObject(json, DatasetElasticsearch.class);

        assertThat(dataset.getTitle()).isEqualTo(TITLE);
        assertThat(dataset.getDescription()).isEqualTo(DESCRIPTION);
        assertThat(dataset.getPi()).isEqualTo(1);
        assertThat(dataset.getProvenance()).isEqualTo(List.of("Arbeidsgiver"));
        assertThat(dataset.getCategory()).isEqualTo(List.of("Personalia"));
        List<PolicyElasticsearch> policies = dataset.getPolicy();
        assertThat(policies.size()).isEqualTo(2);
        assertPolicies0(policies.get(0));
        assertPolicies1(policies.get(1));
    }

    private void assertPolicies0(PolicyElasticsearch policy) {
        assertThat(policy.getPurpose()).isEqualTo("KTR");
        assertThat(policy.getDescription()).isEqualTo("Kontroll");
        assertThat(policy.getLegalBasis()).isEqualTo("LB description");
    }

    private void assertPolicies1(PolicyElasticsearch policy) {
        assertThat(policy.getPurpose()).isEqualTo("AAP");
        assertThat(policy.getDescription()).isEqualTo("Arbeidsavklaringspenger");
        assertThat(policy.getLegalBasis()).isEqualTo("Ftrl. § 11-20");
    }
}
