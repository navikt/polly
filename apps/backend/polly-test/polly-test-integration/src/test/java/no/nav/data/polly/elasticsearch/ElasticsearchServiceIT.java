package no.nav.data.polly.elasticsearch;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.common.utils.JsonUtils;
import no.nav.data.polly.elasticsearch.domain.ElasticsearchRepository;
import no.nav.data.polly.elasticsearch.domain.ElasticsearchStatus;
import no.nav.data.polly.elasticsearch.dto.InformationTypeElasticsearch;
import no.nav.data.polly.elasticsearch.dto.PolicyElasticsearch;
import no.nav.data.polly.elasticsearch.dto.ProcessElasticsearch;
import no.nav.data.polly.informationtype.InformationTypeService;
import no.nav.data.polly.informationtype.domain.InformationType;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.Duration;
import java.util.List;

import static no.nav.data.polly.common.utils.StreamUtils.convert;
import static no.nav.data.polly.elasticsearch.domain.ElasticsearchDocument.newDocumentId;
import static no.nav.data.polly.elasticsearch.domain.ElasticsearchStatus.SYNCED;
import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;

class ElasticsearchServiceIT extends IntegrationTestBase {

    @Autowired
    private InformationTypeService informationTypeService;
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
        await().atMost(Duration.ofSeconds(5)).untilAsserted(() ->
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
        await().atMost(Duration.ofSeconds(5)).untilAsserted(() ->
                assertThat(esRepository.getAllInformationTypes("index").getHits().totalHits).isEqualTo(1L));

        assertThat(informationTypeRepository.findAll().size()).isEqualTo(1);
        InformationType informationType = informationTypeRepository.findAll().get(0);
        informationType.setElasticsearchStatus(ElasticsearchStatus.TO_BE_UPDATED);
        informationTypeRepository.save(informationType);
        service.synchToElasticsearch();

        await().atMost(Duration.ofSeconds(5)).untilAsserted(() ->
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

        await().atMost(Duration.ofSeconds(5)).untilAsserted(() ->
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
        await().atMost(Duration.ofSeconds(5)).untilAsserted(() ->
                assertThat(esRepository.getAllInformationTypes("index").getHits().totalHits).isEqualTo(1L));

        assertThat(informationTypeRepository.findAll().size()).isEqualTo(1);
        informationTypeService.deleteAll(convert(informationTypeRepository.findAll(), InformationType::getId));
        String json = esRepository.getById(newDocumentId(INFORMATION_TYPE_ID_1.toString(), "index"));
        assertInformationType(json);

        service.synchToElasticsearch();

        await().atMost(Duration.ofSeconds(5)).untilAsserted(() ->
                assertThat(esRepository.getAllInformationTypes("index").getHits().totalHits).isEqualTo(0L));
        assertThat(informationTypeRepository.count()).isEqualTo(0);
    }

    private void createTestData(ElasticsearchStatus esStatus) {
        InformationType informationType = createAndSaveInformationType();
        informationType.setElasticsearchStatus(esStatus);
        informationTypeRepository.save(informationType);
        createAndSavePolicy("KONTROLL", informationType);
        createAndSavePolicy("AAP", informationType);
    }

    private void assertInformationType(String json) {
        var informationType = JsonUtils.toObject(json, InformationTypeElasticsearch.class);

        assertThat(informationType.getName()).isEqualTo(INFORMATION_TYPE_NAME);
        assertThat(informationType.getDescription()).isEqualTo("desc");
        assertThat(informationType.getSources().get(0).getCode()).isEqualTo("SKATT");
        assertThat(informationType.getCategories().get(0).getCode()).isEqualTo("PERSONALIA");
        List<ProcessElasticsearch> processes = informationType.getProcesses();
        assertThat(processes).hasSize(2);
        assertProcess0(processes.get(0));
        assertProcess1(processes.get(1));
    }

    private void assertProcess0(ProcessElasticsearch process) {
        assertThat(process.getPurpose()).isEqualTo("AAP");
        assertThat(process.getPurposeDescription()).isEqualTo("Arbeidsavklaringspenger");
        List<PolicyElasticsearch> policies = process.getPolicies();
        assertThat(policies.size()).isEqualTo(1);
        assertThat(process.getPolicies().get(0).getLegalbases().get(0).getDescription()).isEqualTo("§ 2-1");
    }

    private void assertProcess1(ProcessElasticsearch process) {
        assertThat(process.getPurpose()).isEqualTo("KONTROLL");
        assertThat(process.getPurposeDescription()).isEqualTo("Kontrollering");
        List<PolicyElasticsearch> policies = process.getPolicies();
        assertThat(policies.size()).isEqualTo(1);
        assertThat(policies.get(0).getLegalbases().get(0).getDescription()).isEqualTo("§ 2-1");
    }
}
