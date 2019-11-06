package no.nav.data.polly.elasticsearch;

import io.prometheus.client.Counter;
import io.prometheus.client.Summary;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.common.nais.LeaderElectionService;
import no.nav.data.polly.common.utils.MetricUtils;
import no.nav.data.polly.elasticsearch.domain.ElasticsearchDocument;
import no.nav.data.polly.elasticsearch.domain.ElasticsearchRepository;
import no.nav.data.polly.elasticsearch.dto.InformationTypeElasticsearch;
import no.nav.data.polly.elasticsearch.dto.ProcessElasticsearch;
import no.nav.data.polly.informationtype.InformationTypeRepository;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.policy.domain.PolicyRepository;
import no.nav.data.polly.process.domain.Process;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static java.util.Comparator.comparing;
import static java.util.stream.Collectors.toList;
import static no.nav.data.polly.elasticsearch.domain.ElasticsearchStatus.SYNCED;
import static no.nav.data.polly.elasticsearch.domain.ElasticsearchStatus.TO_BE_CREATED;
import static no.nav.data.polly.elasticsearch.domain.ElasticsearchStatus.TO_BE_DELETED;
import static no.nav.data.polly.elasticsearch.domain.ElasticsearchStatus.TO_BE_UPDATED;

@Slf4j
@Service
public class ElasticsearchService {

    private final InformationTypeRepository repository;
    private final PolicyRepository policyRepository;
    private final ElasticsearchRepository elasticsearch;
    private final ElasticsearchProperties elasticsearchProperties;
    private final LeaderElectionService leaderElectionService;
    private final Counter counter;
    private final Summary summary;

    public ElasticsearchService(InformationTypeRepository repository, PolicyRepository policyRepository, ElasticsearchRepository elasticsearch,
            ElasticsearchProperties elasticsearchProperties, LeaderElectionService leaderElectionService) {
        this.repository = repository;
        this.policyRepository = policyRepository;
        this.elasticsearch = elasticsearch;
        this.elasticsearchProperties = elasticsearchProperties;
        this.leaderElectionService = leaderElectionService;
        this.counter = initCounter();
        this.summary = MetricUtils.summary().name("polly_elasticsearch_sync_summary").help("runtime es-sync")
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
            var created = createInformationTypesInElasticsearch();
            var updated = updateInformationTypesInElasticsearch();
            var deleted = deleteInformationTypesInElasticsearchAndInPostgres();
            log.info("Finished sync to ElasticSearch created={} updated={} deleted={}", created, updated, deleted);
        });
    }

    private int createInformationTypesInElasticsearch() {
        List<InformationType> informationTypes = repository.findByElasticsearchStatus(TO_BE_CREATED);
        for (InformationType informationType : informationTypes) {
            InformationTypeElasticsearch informationTypeES = mapInformationType(informationType);
            elasticsearch.insert(ElasticsearchDocument.newDocument(informationTypeES, elasticsearchProperties.getIndex()));

            repository.updateStatusForInformationType(informationType.getId(), SYNCED);
            counter.labels("create").inc();
        }
        return informationTypes.size();
    }

    private int updateInformationTypesInElasticsearch() {
        List<InformationType> informationTypes = repository.findByElasticsearchStatus(TO_BE_UPDATED);
        for (InformationType informationType : informationTypes) {
            InformationTypeElasticsearch informationTypeES = mapInformationType(informationType);
            elasticsearch.updateById(ElasticsearchDocument.newDocument(informationTypeES, elasticsearchProperties.getIndex()));

            repository.updateStatusForInformationType(informationType.getId(), SYNCED);
            counter.labels("update").inc();
        }
        return informationTypes.size();
    }

    private int deleteInformationTypesInElasticsearchAndInPostgres() {
        List<InformationType> informationTypes = repository.findByElasticsearchStatus(TO_BE_DELETED);
        for (InformationType informationType : informationTypes) {
            elasticsearch.deleteById(ElasticsearchDocument.newDocumentId(informationType.getId().toString(), elasticsearchProperties.getIndex()));
            repository.deleteById(informationType.getId());
            counter.labels("delete").inc();
        }
        return informationTypes.size();
    }

    public InformationTypeElasticsearch mapInformationType(InformationType informationType) {
        List<Policy> policies = policyRepository.findByInformationTypeId(informationType.getId());
        return informationType.convertToElasticsearch(convertToElasticsearchProcess(policies));
    }

    private List<ProcessElasticsearch> convertToElasticsearchProcess(List<Policy> policies) {
        Map<Process, List<Policy>> processes = policies.stream().collect(Collectors.groupingBy(Policy::getProcess));
        return processes.keySet().stream()
                .map(process -> process.convertToElasticsearch(processes.get(process)))
                .sorted(comparing(ProcessElasticsearch::getName))
                .collect(toList());
    }

    private static Counter initCounter() {
        return MetricUtils.counter()
                .labels("sync").labels("create").labels("update").labels("delete")
                .name("polly_elasticsearch_sync")
                .help("Sync stats for InformationTypes")
                .labelNames("action")
                .register();
    }
}
