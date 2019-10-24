package no.nav.data.polly.elasticsearch;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.common.utils.JsonUtils;
import no.nav.data.polly.dataset.Dataset;
import no.nav.data.polly.elasticsearch.domain.DatasetElasticsearch;
import no.nav.data.polly.elasticsearch.domain.PolicyElasticsearch;
import no.nav.data.polly.informationtype.domain.InformationType;
import org.awaitility.Duration;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

import static no.nav.data.polly.elasticsearch.ElasticsearchDocument.newDatasetDocumentId;
import static no.nav.data.polly.elasticsearch.ElasticsearchStatus.SYNCED;
import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;

@Disabled
class ElasticsearchDatasetServiceIT extends IntegrationTestBase {

    @Autowired
    private ElasticsearchDatasetService service;

    @Autowired
    private ElasticsearchRepository esRepository;

    private static FixedElasticsearchContainer container = new FixedElasticsearchContainer("docker.elastic.co/elasticsearch/elasticsearch-oss:6.6.1", ELASTICSEARCH_PORT);

    @BeforeAll
    static void setUpAll() {
        container.start();
    }

    @AfterAll
    static void cleanUpAll() {
        container.stop();
    }

    @Test
    void syncNewDatasetsToES() {
        createTestData(ElasticsearchStatus.TO_BE_CREATED);
        service.synchToElasticsearch();
        await().atMost(Duration.FIVE_SECONDS).untilAsserted(() ->
                assertThat(esRepository.getAllDatasets("index").getHits().totalHits).isEqualTo(1L));
        String json = esRepository.getById(newDatasetDocumentId(DATASET_ID_1.toString(), "index"));
        assertDataset(json);
        Dataset dataset = datasetRepository.findAll().get(0);
        assertThat(dataset.getElasticsearchStatus()).isEqualTo(SYNCED);
    }

    @Test
    void syncUpdatedDatasetsToES() {
        createTestData(ElasticsearchStatus.TO_BE_CREATED);
        service.synchToElasticsearch();
        await().atMost(Duration.FIVE_SECONDS).untilAsserted(() ->
                assertThat(esRepository.getAllDatasets("index").getHits().totalHits).isEqualTo(1L));

        assertThat(datasetRepository.findAll().size()).isEqualTo(1);
        Dataset dataset = datasetRepository.findAll().get(0);
        dataset.setElasticsearchStatus(ElasticsearchStatus.TO_BE_UPDATED);
        datasetRepository.save(dataset);
        service.synchToElasticsearch();

        await().atMost(Duration.FIVE_SECONDS).untilAsserted(() ->
                assertThat(esRepository.getAllDatasets("index").getHits().totalHits).isEqualTo(1L));
        String json = esRepository.getById(newDatasetDocumentId(DATASET_ID_1.toString(), "index"));
        assertDataset(json);

        assertThat(datasetRepository.findAll().size()).isEqualTo(1);
        dataset = datasetRepository.findAll().get(0);
        assertThat(dataset.getElasticsearchStatus()).isEqualTo(SYNCED);
    }

    @Test
    void syncNotExistingUpdatedDatasetsToES() {
        createTestData(ElasticsearchStatus.TO_BE_UPDATED);
        service.synchToElasticsearch();

        await().atMost(Duration.FIVE_SECONDS).untilAsserted(() ->
                assertThat(esRepository.getAllDatasets("index").getHits().totalHits).isEqualTo(1L));
        String json = esRepository.getById(newDatasetDocumentId(DATASET_ID_1.toString(), "index"));
        assertDataset(json);

        assertThat(datasetRepository.findAll().size()).isEqualTo(1);
        Dataset dataset = datasetRepository.findAll().get(0);
        assertThat(dataset.getElasticsearchStatus()).isEqualTo(SYNCED);
    }

    @Test
    void syncDeletedDatasetsToES() {
        createTestData(ElasticsearchStatus.TO_BE_CREATED);
        service.synchToElasticsearch();
        await().atMost(Duration.FIVE_SECONDS).untilAsserted(() ->
                assertThat(esRepository.getAllDatasets("index").getHits().totalHits).isEqualTo(1L));

        assertThat(datasetRepository.findAll().size()).isEqualTo(1);
        Dataset dataset = datasetRepository.findAll().get(0);
        dataset.setElasticsearchStatus(ElasticsearchStatus.TO_BE_DELETED);
        datasetRepository.save(dataset);
        String json = esRepository.getById(newDatasetDocumentId(DATASET_ID_1.toString(), "index"));
        assertDataset(json);

        service.synchToElasticsearch();

        await().atMost(Duration.FIVE_SECONDS).untilAsserted(() ->
                assertThat(esRepository.getAllDatasets("index").getHits().totalHits).isEqualTo(0L));
        assertThat(datasetRepository.count()).isEqualTo(0);
        assertThat(policyRepository.count()).isEqualTo(0);
    }

    private void createTestData(ElasticsearchStatus esStatus) {
        InformationType informationType = createInformationType();
        informationType.setElasticsearchStatus(esStatus);
        informationTypeRepository.save(informationType);
        createPolicy("Kontroll", informationType);
        createPolicy("AAP", informationType);
    }

    private void assertDataset(String json) {
        var dataset = JsonUtils.toObject(json, DatasetElasticsearch.class);

        assertThat(dataset.getTitle()).isEqualTo(DATASET_TITLE);
        assertThat(dataset.getDescription()).isEqualTo("desc");
        assertThat(dataset.getPi()).isEqualTo(1);
        assertThat(dataset.getProvenance()).isEqualTo(List.of("Arbeidsgiver"));
        assertThat(dataset.getCategory()).isEqualTo(List.of("Personalia"));
        List<PolicyElasticsearch> policies = dataset.getPolicy();
        assertThat(policies.size()).isEqualTo(2);
        assertPolicies0(policies.get(0));
        assertPolicies1(policies.get(1));
    }

    private void assertPolicies0(PolicyElasticsearch policy) {
        assertThat(policy.getPurpose()).isEqualTo("Kontroll");
        assertThat(policy.getDescription()).isEqualTo("Kontrollering");
        assertThat(policy.getLegalBasis()).isEqualTo("legal");
    }

    private void assertPolicies1(PolicyElasticsearch policy) {
        assertThat(policy.getPurpose()).isEqualTo("AAP");
        assertThat(policy.getDescription()).isEqualTo("Arbeidsavklaringspenger");
        assertThat(policy.getLegalBasis()).isEqualTo("legal");
    }
}
