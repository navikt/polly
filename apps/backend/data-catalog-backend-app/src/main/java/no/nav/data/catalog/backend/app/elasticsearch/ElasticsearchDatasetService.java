package no.nav.data.catalog.backend.app.elasticsearch;

import lombok.extern.slf4j.Slf4j;
import no.nav.data.catalog.backend.app.common.nais.LeaderElectionService;
import no.nav.data.catalog.backend.app.dataset.Dataset;
import no.nav.data.catalog.backend.app.dataset.repo.DatasetRepository;
import no.nav.data.catalog.backend.app.elasticsearch.domain.DatasetElasticsearch;
import no.nav.data.catalog.backend.app.policy.PolicyConsumer;
import no.nav.data.catalog.backend.app.policy.PolicyResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import static no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus.SYNCED;
import static no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus.TO_BE_CREATED;
import static no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus.TO_BE_DELETED;
import static no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus.TO_BE_UPDATED;

@Slf4j
@Service
public class ElasticsearchDatasetService {

    private final DatasetRepository repository;
    private final PolicyConsumer policyConsumer;
    private final ElasticsearchRepository elasticsearch;
    private final ElasticsearchProperties elasticsearchProperties;
    private final LeaderElectionService leaderElectionService;

    public ElasticsearchDatasetService(DatasetRepository repository, PolicyConsumer policyConsumer, ElasticsearchRepository elasticsearch,
            ElasticsearchProperties elasticsearchProperties, LeaderElectionService leaderElectionService) {
        this.repository = repository;
        this.policyConsumer = policyConsumer;
        this.elasticsearch = elasticsearch;
        this.elasticsearchProperties = elasticsearchProperties;
        this.leaderElectionService = leaderElectionService;
    }

    public void synchToElasticsearch() {
        if (!leaderElectionService.isLeader()) {
            log.info("Skip sync to ElasticSearch, not leader");
            return;
        }
        log.info("Starting sync to ElasticSearch");
        var created = createDatasetsInElasticsearch();
        var updated = updateDatasetsInElasticsearch();
        var deleted = deleteDatasetsInElasticsearchAndInPostgres();
        log.info("Finished sync to ElasticSearch created={} updated={} deleted={}", created, updated, deleted);
    }

    private int createDatasetsInElasticsearch() {
        List<Dataset> datasets = repository.findByElasticsearchStatus(TO_BE_CREATED);
        for (Dataset dataset : datasets) {
            DatasetElasticsearch datasetES = mapDataset(dataset);
            elasticsearch.insert(ElasticsearchDocument.newDatasetDocument(datasetES, elasticsearchProperties.getIndex()));

            dataset.setElasticsearchStatus(SYNCED);
            repository.save(dataset);
        }
        return datasets.size();
    }

    private int updateDatasetsInElasticsearch() {
        List<Dataset> datasets = repository.findByElasticsearchStatus(TO_BE_UPDATED);
        for (Dataset dataset : datasets) {
            DatasetElasticsearch datasetES = mapDataset(dataset);
            elasticsearch.updateById(ElasticsearchDocument.newDatasetDocument(datasetES, elasticsearchProperties.getIndex()));

            dataset.setElasticsearchStatus(SYNCED);
            repository.save(dataset);
        }
        return datasets.size();
    }

    private int deleteDatasetsInElasticsearchAndInPostgres() {
        List<Dataset> datasets = repository.findByElasticsearchStatus(TO_BE_DELETED);
        for (Dataset dataset : datasets) {
            elasticsearch.deleteById(ElasticsearchDocument.newDatasetDocumentId(dataset.getElasticsearchId(), elasticsearchProperties.getIndex()));
            repository.deleteById(dataset.getId());
        }
        return datasets.size();
    }

    public DatasetElasticsearch mapDataset(Dataset dataset) {
        List<PolicyResponse> policies = policyConsumer.getPolicyForDataset(dataset.getId());
        var policiesES = policies.stream().map(PolicyResponse::convertToElasticsearch).collect(Collectors.toList());
        return dataset.convertToElasticsearch(policiesES);
    }

}
