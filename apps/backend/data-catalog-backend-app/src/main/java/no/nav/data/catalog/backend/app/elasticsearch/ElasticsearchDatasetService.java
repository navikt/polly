package no.nav.data.catalog.backend.app.elasticsearch;

import io.prometheus.client.Counter;
import io.prometheus.client.Summary;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.catalog.backend.app.common.nais.LeaderElectionService;
import no.nav.data.catalog.backend.app.common.utils.MetricUtils;
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
    private final Counter counter;
    private final Summary summary;

    public ElasticsearchDatasetService(DatasetRepository repository, PolicyConsumer policyConsumer, ElasticsearchRepository elasticsearch,
            ElasticsearchProperties elasticsearchProperties, LeaderElectionService leaderElectionService) {
        this.repository = repository;
        this.policyConsumer = policyConsumer;
        this.elasticsearch = elasticsearch;
        this.elasticsearchProperties = elasticsearchProperties;
        this.leaderElectionService = leaderElectionService;
        this.counter = initCounter();
        this.summary = MetricUtils.summary().name("elasticsearch_sync_summary").help("runtime es-sync")
                .quantile(.5, .05).quantile(.9, .01).quantile(.95, .005).quantile(.99, .001)
                .register();
    }

    public void synchToElasticsearch() {
        if (!leaderElectionService.isLeader()) {
            log.info("Skip sync to ElasticSearch, not leader");
            return;
        }
        counter.labels("sync").inc();
        summary.time(() -> {
            log.info("Starting sync to ElasticSearch");
            var created = createDatasetsInElasticsearch();
            var updated = updateDatasetsInElasticsearch();
            var deleted = deleteDatasetsInElasticsearchAndInPostgres();
            log.info("Finished sync to ElasticSearch created={} updated={} deleted={}", created, updated, deleted);
        });
    }

    private int createDatasetsInElasticsearch() {
        List<Dataset> datasets = repository.findByElasticsearchStatus(TO_BE_CREATED);
        for (Dataset dataset : datasets) {
            DatasetElasticsearch datasetES = mapDataset(dataset);
            elasticsearch.insert(ElasticsearchDocument.newDatasetDocument(datasetES, elasticsearchProperties.getIndex()));

            repository.updateStatusForDataset(dataset.getId(), SYNCED);
            counter.labels("create").inc();
        }
        return datasets.size();
    }

    private int updateDatasetsInElasticsearch() {
        List<Dataset> datasets = repository.findByElasticsearchStatus(TO_BE_UPDATED);
        for (Dataset dataset : datasets) {
            DatasetElasticsearch datasetES = mapDataset(dataset);
            elasticsearch.updateById(ElasticsearchDocument.newDatasetDocument(datasetES, elasticsearchProperties.getIndex()));

            repository.updateStatusForDataset(dataset.getId(), SYNCED);
            counter.labels("update").inc();
        }
        return datasets.size();
    }

    private int deleteDatasetsInElasticsearchAndInPostgres() {
        List<Dataset> datasets = repository.findByElasticsearchStatus(TO_BE_DELETED);
        for (Dataset dataset : datasets) {
            elasticsearch.deleteById(ElasticsearchDocument.newDatasetDocumentId(dataset.getId().toString(), elasticsearchProperties.getIndex()));
            repository.deleteById(dataset.getId());
            // As we share a schema, perhpas do a scheduled task to delete orphan policies instead
            try {
                policyConsumer.deletePoliciesForDataset(dataset.getId());
            } catch (Exception e) {
                log.warn(String.format("Failed to delete policies for datasetId=%s", dataset.getId()), e);
            }
            counter.labels("delete").inc();
        }
        return datasets.size();
    }

    public DatasetElasticsearch mapDataset(Dataset dataset) {
        List<PolicyResponse> policies = policyConsumer.getPolicyForDataset(dataset.getId());
        var policiesES = policies.stream().map(PolicyResponse::convertToElasticsearch).collect(Collectors.toList());
        return dataset.convertToElasticsearch(policiesES);
    }

    private static Counter initCounter() {
        return MetricUtils.counter()
                .labels("sync").labels("create").labels("update").labels("delete")
                .name("datacatalog_elasticsearch_sync")
                .help("Sync stats for datacatalog")
                .labelNames("action")
                .register();
    }
}
