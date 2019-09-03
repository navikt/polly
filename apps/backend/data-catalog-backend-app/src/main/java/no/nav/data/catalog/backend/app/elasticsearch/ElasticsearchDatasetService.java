package no.nav.data.catalog.backend.app.elasticsearch;

import lombok.extern.slf4j.Slf4j;
import no.nav.data.catalog.backend.app.dataset.Dataset;
import no.nav.data.catalog.backend.app.dataset.DatasetResponse;
import no.nav.data.catalog.backend.app.dataset.repo.DatasetRepository;
import no.nav.data.catalog.backend.app.policy.PolicyConsumer;
import no.nav.data.catalog.backend.app.policy.PolicyResponse;
import org.springframework.stereotype.Service;

import java.util.List;

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

    public ElasticsearchDatasetService(DatasetRepository repository, PolicyConsumer policyConsumer, ElasticsearchRepository elasticsearch,
            ElasticsearchProperties elasticsearchProperties) {
        this.repository = repository;
        this.policyConsumer = policyConsumer;
        this.elasticsearch = elasticsearch;
        this.elasticsearchProperties = elasticsearchProperties;
    }

    public void synchToElasticsearch() {
        log.info("Starting sync to ElasticSearch");
        createDatasetsInElasticsearch();
        updateDatasetsInElasticsearch();
        deleteDatasetsInElasticsearchAndInPostgres();
        log.info("Finished sync to ElasticSearch");
    }

    private void createDatasetsInElasticsearch() {
        List<Dataset> datasets = repository.findByElasticsearchStatus(TO_BE_CREATED);
        for (Dataset dataset : datasets) {
            DatasetResponse datasetResponse = dataset.convertToResponse();
            List<PolicyResponse> policies = policyConsumer.getPolicyForDataset(dataset.getId());
            datasetResponse.setPolicies(policies);

            elasticsearch.insert(ElasticsearchDocument.newDatasetDocument(datasetResponse, elasticsearchProperties.getIndex()));

            dataset.setElasticsearchStatus(SYNCED);
            repository.save(dataset);
        }
        log.info("created {}", datasets.size());
    }

    private void updateDatasetsInElasticsearch() {
        List<Dataset> datasets = repository.findByElasticsearchStatus(TO_BE_UPDATED);
        for (Dataset dataset : datasets) {
            DatasetResponse datasetResponse = dataset.convertToResponse();
            List<PolicyResponse> policies = policyConsumer.getPolicyForDataset(dataset.getId());
            datasetResponse.setPolicies(policies);

            elasticsearch.updateById(ElasticsearchDocument.newDatasetDocument(datasetResponse, elasticsearchProperties.getIndex()));

            dataset.setElasticsearchStatus(SYNCED);
            repository.save(dataset);
        }
        log.info("updated {}", datasets.size());
    }

    private void deleteDatasetsInElasticsearchAndInPostgres() {
        List<Dataset> datasets = repository.findByElasticsearchStatus(TO_BE_DELETED);
        for (Dataset dataset : datasets) {
            elasticsearch.deleteById(ElasticsearchDocument.newDatasetDocumentId(dataset.getElasticsearchId(), elasticsearchProperties.getIndex()));
            repository.deleteById(dataset.getId());
        }
        log.info("deleted {}", datasets.size());
    }
}
