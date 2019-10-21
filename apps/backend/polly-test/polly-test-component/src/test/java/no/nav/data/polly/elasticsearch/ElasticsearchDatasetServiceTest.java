package no.nav.data.polly.elasticsearch;

import io.prometheus.client.CollectorRegistry;
import no.nav.data.polly.common.nais.LeaderElectionService;
import no.nav.data.polly.dataset.Dataset;
import no.nav.data.polly.dataset.DatasetData;
import no.nav.data.polly.dataset.repo.DatasetRepository;
import no.nav.data.polly.policy.entities.Policy;
import no.nav.data.polly.policy.repository.PolicyRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.UUID;

import static java.util.Collections.singletonList;
import static no.nav.data.polly.elasticsearch.ElasticsearchStatus.SYNCED;
import static no.nav.data.polly.elasticsearch.ElasticsearchStatus.TO_BE_CREATED;
import static no.nav.data.polly.elasticsearch.ElasticsearchStatus.TO_BE_DELETED;
import static no.nav.data.polly.elasticsearch.ElasticsearchStatus.TO_BE_UPDATED;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ElasticsearchDatasetServiceTest {

    private Dataset dataset;
    private Policy policy;

    @Mock
    private DatasetRepository repository;
    @Mock
    private PolicyRepository policyRepository;
    @Mock
    private ElasticsearchRepository elasticsearch;
    @Mock
    private ElasticsearchProperties properties;
    @Mock
    private LeaderElectionService leaderElectionService;
    @InjectMocks
    private ElasticsearchDatasetService service;

    private ArgumentCaptor<ElasticsearchDocument> captor = ArgumentCaptor.forClass(ElasticsearchDocument.class);

    @BeforeEach
    void setUp() {
        policy = Policy.builder().policyId(1L).legalBasisDescription("Legal description")
                .purposeCode("Kontroll")
                .build();

        dataset = Dataset.builder()
                .id(UUID.randomUUID())
                .datasetData(DatasetData.builder().build())
                .build();

        lenient().when(policyRepository.findByDatasetId(dataset.getId().toString())).thenReturn(singletonList(policy));
        when(properties.getIndex()).thenReturn("index");
        when(leaderElectionService.isLeader()).thenReturn(true);
    }

    @AfterEach
    void tearDown() {
        CollectorRegistry.defaultRegistry.clear();
    }

    @Test
    void shouldSyncCreatedDatasets() {
        lenient().when(repository.findByElasticsearchStatus(TO_BE_CREATED)).thenReturn(singletonList(dataset));
        service.synchToElasticsearch();
        verify(elasticsearch, times(1)).insert(captor.capture());
        verify(elasticsearch, times(0)).updateById(any());
        verify(elasticsearch, times(0)).deleteById(any());
        verify(repository, times(1)).updateStatusForDataset(dataset.getId(), SYNCED);
        verify(repository, times(0)).deleteById(any());

        verifyCapture(true);
    }

    @Test
    void shouldSyncUpdatedDatasets() {
        lenient().when(repository.findByElasticsearchStatus(TO_BE_UPDATED)).thenReturn(singletonList(dataset));
        service.synchToElasticsearch();
        verify(elasticsearch, times(0)).insert(any());
        verify(elasticsearch, times(1)).updateById(captor.capture());
        verify(elasticsearch, times(0)).deleteById(any());
        verify(repository, times(1)).updateStatusForDataset(dataset.getId(), SYNCED);
        verify(repository, times(0)).deleteById(any());
        verifyCapture(true);
    }

    @Test
    void shouldSyncDeletedDatasets() {
        lenient().when(repository.findByElasticsearchStatus(TO_BE_DELETED)).thenReturn(singletonList(dataset));
        service.synchToElasticsearch();
        verify(elasticsearch, times(0)).insert(any());
        verify(elasticsearch, times(0)).updateById(any());
        verify(elasticsearch, times(1)).deleteById(captor.capture());
        verify(repository, times(0)).save(any(Dataset.class));
        verify(repository, times(1)).deleteById(dataset.getId());
        verify(policyRepository).deleteAll(anyList());
        verifyCapture(false);
    }

    private void verifyCapture(boolean verifyJson) {
        ElasticsearchDocument document = captor.getValue();

        assertThat(document.getId()).isEqualTo(dataset.getId().toString());
        assertThat(document.getIndex()).isEqualTo("index");
        if (verifyJson) {
            assertThat(document.getJson()).contains(dataset.getId().toString());
            assertThat(document.getJson()).contains(policy.getLegalBasisDescription());
        }
    }

}