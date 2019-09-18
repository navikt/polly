package no.nav.data.catalog.backend.app.elasticsearch;

import no.nav.data.catalog.backend.app.codelist.CodeResponse;
import no.nav.data.catalog.backend.app.common.nais.LeaderElectionService;
import no.nav.data.catalog.backend.app.dataset.Dataset;
import no.nav.data.catalog.backend.app.dataset.DatasetData;
import no.nav.data.catalog.backend.app.dataset.repo.DatasetRepository;
import no.nav.data.catalog.backend.app.policy.PolicyConsumer;
import no.nav.data.catalog.backend.app.policy.PolicyResponse;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.UUID;

import static java.util.Collections.singletonList;
import static no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus.TO_BE_CREATED;
import static no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus.TO_BE_DELETED;
import static no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus.TO_BE_UPDATED;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class ElasticsearchDatasetServiceTest {

    private Dataset dataset;
    private PolicyResponse policy;


    @Mock
    private DatasetRepository repository;
    @Mock
    private PolicyConsumer policyConsumer;
    @Mock
    private ElasticsearchRepository elasticsearch;
    @Mock
    private ElasticsearchProperties properties;
    @Mock
    private LeaderElectionService leaderElectionService;
    @InjectMocks
    private ElasticsearchDatasetService service;

    private ArgumentCaptor<ElasticsearchDocument> captor = ArgumentCaptor.forClass(ElasticsearchDocument.class);

    @Before
    public void setUp() {
        policy = PolicyResponse.builder().policyId(1L).legalBasisDescription("Legal description")
                .purpose(new CodeResponse("purposeCode", "Purpose description"))
                .build();

        dataset = Dataset.builder()
                .id(UUID.randomUUID())
                .elasticsearchId("elasticId")
                .datasetData(DatasetData.builder().build())
                .build();

        when(policyConsumer.getPolicyForDataset(dataset.getId())).thenReturn(singletonList(policy));
        when(properties.getIndex()).thenReturn("index");
        when(leaderElectionService.isLeader()).thenReturn(true);
    }

    @Test
    public void shouldSyncCreatedDatasets() {
        when(repository.findByElasticsearchStatus(TO_BE_CREATED)).thenReturn(singletonList(dataset));
        service.synchToElasticsearch();
        verify(elasticsearch, times(1)).insert(captor.capture());
        verify(elasticsearch, times(0)).updateById(any());
        verify(elasticsearch, times(0)).deleteById(any());
        verify(repository, times(1)).save(dataset);
        verify(repository, times(0)).deleteById(any());

        verifyCapture(true);
    }

    @Test
    public void shouldSyncUpdatedDatasets() {
        when(repository.findByElasticsearchStatus(TO_BE_UPDATED)).thenReturn(singletonList(dataset));
        service.synchToElasticsearch();
        verify(elasticsearch, times(0)).insert(any());
        verify(elasticsearch, times(1)).updateById(captor.capture());
        verify(elasticsearch, times(0)).deleteById(any());
        verify(repository, times(1)).save(dataset);
        verify(repository, times(0)).deleteById(any());
        verifyCapture(true);
    }

    @Test
    public void shouldSyncDeletedDatasets() {
        when(repository.findByElasticsearchStatus(TO_BE_DELETED)).thenReturn(singletonList(dataset));
        service.synchToElasticsearch();
        verify(elasticsearch, times(0)).insert(any());
        verify(elasticsearch, times(0)).updateById(any());
        verify(elasticsearch, times(1)).deleteById(captor.capture());
        verify(repository, times(0)).save(any(Dataset.class));
        verify(repository, times(1)).deleteById(dataset.getId());
        verify(policyConsumer).deletePoliciesForDataset(dataset.getId());
        verifyCapture(false);
    }

    private void verifyCapture(boolean verifyJson) {
        ElasticsearchDocument document = captor.getValue();

        assertThat(document.getId(), is(dataset.getElasticsearchId()));
        assertThat(document.getIndex(), is("index"));
        if (verifyJson) {
            assertThat(document.getJson(), containsString(dataset.getElasticsearchId()));
            assertThat(document.getJson(), containsString(policy.getLegalBasisDescription()));
        }
    }

}