package no.nav.data.polly.elasticsearch;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.common.utils.JsonUtils;
import no.nav.data.polly.elasticsearch.domain.ElasticsearchRepository;
import no.nav.data.polly.elasticsearch.domain.ElasticsearchStatus;
import no.nav.data.polly.elasticsearch.dto.InformationTypeElasticsearch;
import no.nav.data.polly.elasticsearch.dto.PolicyElasticsearch;
import no.nav.data.polly.informationtype.domain.InformationType;
import org.awaitility.Duration;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

import static no.nav.data.polly.elasticsearch.domain.ElasticsearchDocument.newDocumentId;
import static no.nav.data.polly.elasticsearch.domain.ElasticsearchStatus.SYNCED;
import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;

class ElasticsearchServiceIT extends IntegrationTestBase {

    @Autowired
    private ElasticsearchService service;

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
    void syncNewInformationTypesToES() {
        createTestData(ElasticsearchStatus.TO_BE_CREATED);
        service.synchToElasticsearch();
        await().atMost(Duration.FIVE_SECONDS).untilAsserted(() ->
                assertThat(esRepository.getAllInformationTypes("index").getHits().totalHits).isEqualTo(1L));
        String json = esRepository.getById(newDocumentId(INFORMATION_TYPE_ID_1.toString(), "index"));
        assertInformationType(json);
        InformationType informationType = informationTypeRepository.findAll().get(0);
        assertThat(informationType.getElasticsearchStatus()).isEqualTo(SYNCED);
    }

    @Test
    void syncUpdatedInformationTypesToES() {
        createTestData(ElasticsearchStatus.TO_BE_CREATED);
        service.synchToElasticsearch();
        await().atMost(Duration.FIVE_SECONDS).untilAsserted(() ->
                assertThat(esRepository.getAllInformationTypes("index").getHits().totalHits).isEqualTo(1L));

        assertThat(informationTypeRepository.findAll().size()).isEqualTo(1);
        InformationType informationType = informationTypeRepository.findAll().get(0);
        informationType.setElasticsearchStatus(ElasticsearchStatus.TO_BE_UPDATED);
        informationTypeRepository.save(informationType);
        service.synchToElasticsearch();

        await().atMost(Duration.FIVE_SECONDS).untilAsserted(() ->
                assertThat(esRepository.getAllInformationTypes("index").getHits().totalHits).isEqualTo(1L));
        String json = esRepository.getById(newDocumentId(INFORMATION_TYPE_ID_1.toString(), "index"));
        assertInformationType(json);

        assertThat(informationTypeRepository.findAll().size()).isEqualTo(1);
        informationType = informationTypeRepository.findAll().get(0);
        assertThat(informationType.getElasticsearchStatus()).isEqualTo(SYNCED);
    }

    @Test
    void syncNotExistingUpdatedInformationTypesToES() {
        createTestData(ElasticsearchStatus.TO_BE_UPDATED);
        service.synchToElasticsearch();

        await().atMost(Duration.FIVE_SECONDS).untilAsserted(() ->
                assertThat(esRepository.getAllInformationTypes("index").getHits().totalHits).isEqualTo(1L));
        String json = esRepository.getById(newDocumentId(INFORMATION_TYPE_ID_1.toString(), "index"));
        assertInformationType(json);

        assertThat(informationTypeRepository.findAll().size()).isEqualTo(1);
        InformationType informationType = informationTypeRepository.findAll().get(0);
        assertThat(informationType.getElasticsearchStatus()).isEqualTo(SYNCED);
    }

    @Test
    void syncDeletedInformationTypesToES() {
        createTestData(ElasticsearchStatus.TO_BE_CREATED);
        service.synchToElasticsearch();
        await().atMost(Duration.FIVE_SECONDS).untilAsserted(() ->
                assertThat(esRepository.getAllInformationTypes("index").getHits().totalHits).isEqualTo(1L));

        assertThat(informationTypeRepository.findAll().size()).isEqualTo(1);
        InformationType informationType = informationTypeRepository.findAll().get(0);
        informationType.setElasticsearchStatus(ElasticsearchStatus.TO_BE_DELETED);
        informationTypeRepository.save(informationType);
        String json = esRepository.getById(newDocumentId(INFORMATION_TYPE_ID_1.toString(), "index"));
        assertInformationType(json);

        service.synchToElasticsearch();

        await().atMost(Duration.FIVE_SECONDS).untilAsserted(() ->
                assertThat(esRepository.getAllInformationTypes("index").getHits().totalHits).isEqualTo(0L));
        assertThat(informationTypeRepository.count()).isEqualTo(0);
        assertThat(policyRepository.count()).isEqualTo(0);
    }

    private void createTestData(ElasticsearchStatus esStatus) {
        InformationType informationType = createInformationType();
        informationType.setElasticsearchStatus(esStatus);
        informationTypeRepository.save(informationType);
        createPolicy("Kontroll", informationType);
        createPolicy("AAP", informationType);
    }

    private void assertInformationType(String json) {
        var informationType = JsonUtils.toObject(json, InformationTypeElasticsearch.class);

        assertThat(informationType.getName()).isEqualTo(INFORMATION_TYPE_NAME);
        assertThat(informationType.getDescription()).isEqualTo("desc");
        assertThat(informationType.getPii()).isEqualTo("true");
        assertThat(informationType.getSources().get(0).getCode()).isEqualTo("Skatt");
        assertThat(informationType.getCategories().get(0).getCode()).isEqualTo("Personalia");
        List<PolicyElasticsearch> policies = informationType.getPolicies();
        assertThat(policies.size()).isEqualTo(2);
        assertPolicies0(policies.get(0));
        assertPolicies1(policies.get(1));
    }

    private void assertPolicies0(PolicyElasticsearch policy) {
        assertThat(policy.getPurpose()).isEqualTo("Kontroll");
        assertThat(policy.getDescription()).isEqualTo("Kontrollering");
        assertThat(policy.getLegalbases().get(0).getDescription()).isEqualTo("desc");
    }

    private void assertPolicies1(PolicyElasticsearch policy) {
        assertThat(policy.getPurpose()).isEqualTo("AAP");
        assertThat(policy.getDescription()).isEqualTo("Arbeidsavklaringspenger");
        assertThat(policy.getLegalbases().get(0).getDescription()).isEqualTo("desc");
    }
}
