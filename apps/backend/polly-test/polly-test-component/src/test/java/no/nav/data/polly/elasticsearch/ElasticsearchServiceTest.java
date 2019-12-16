package no.nav.data.polly.elasticsearch;

import io.prometheus.client.CollectorRegistry;
import no.nav.data.polly.codelist.CodelistStub;
import no.nav.data.polly.common.nais.LeaderElectionService;
import no.nav.data.polly.elasticsearch.domain.ElasticsearchDocument;
import no.nav.data.polly.elasticsearch.domain.ElasticsearchRepository;
import no.nav.data.polly.informationtype.InformationTypeRepository;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.domain.InformationTypeData;
import no.nav.data.polly.legalbasis.domain.LegalBasis;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.policy.domain.PolicyRepository;
import no.nav.data.polly.process.domain.Process;
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
import static no.nav.data.polly.elasticsearch.domain.ElasticsearchStatus.SYNCED;
import static no.nav.data.polly.elasticsearch.domain.ElasticsearchStatus.TO_BE_CREATED;
import static no.nav.data.polly.elasticsearch.domain.ElasticsearchStatus.TO_BE_DELETED;
import static no.nav.data.polly.elasticsearch.domain.ElasticsearchStatus.TO_BE_UPDATED;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ElasticsearchServiceTest {

    private InformationType informationType;
    private Policy policy;

    @Mock
    private InformationTypeRepository repository;
    @Mock
    private PolicyRepository policyRepository;
    @Mock
    private ElasticsearchRepository elasticsearch;
    @Mock
    private ElasticsearchProperties properties;
    @Mock
    private LeaderElectionService leaderElectionService;
    @InjectMocks
    private ElasticsearchService service;

    private ArgumentCaptor<ElasticsearchDocument> captor = ArgumentCaptor.forClass(ElasticsearchDocument.class);

    @BeforeEach
    void setUp() {
        CodelistStub.initializeCodelist();
        policy = Policy.builder().id(UUID.randomUUID())
                .legalBasis(LegalBasis.builder().gdpr("6A").nationalLaw("FTRL").description("§4").build())
                .purposeCode("KONTROLL")
                .build();
        Process.builder().generateId().name("process").purposeCode("KONTROLL").build().addPolicy(policy);

        informationType = InformationType.builder()
                .id(UUID.randomUUID())
                .data(InformationTypeData.builder().name("hei").build())
                .termId("term")
                .build();

        lenient().when(policyRepository.findByInformationTypeId(informationType.getId())).thenReturn(singletonList(policy));
        when(properties.getIndex()).thenReturn("index");
        when(leaderElectionService.isLeader()).thenReturn(true);
    }

    @AfterEach
    void tearDown() {
        CollectorRegistry.defaultRegistry.clear();
    }

    @Test
    void shouldSyncCreatedInformationTypes() {
        lenient().when(repository.findByElasticsearchStatus(TO_BE_CREATED)).thenReturn(singletonList(informationType));
        service.synchToElasticsearch();
        verify(elasticsearch, times(1)).insert(captor.capture());
        verify(elasticsearch, times(0)).updateById(any());
        verify(elasticsearch, times(0)).deleteById(any());
        verify(repository, times(1)).updateStatusForInformationType(informationType.getId(), SYNCED);
        verify(repository, times(0)).deleteById(any());

        verifyCapture(true);
    }

    @Test
    void shouldSyncUpdatedInformationTypes() {
        lenient().when(repository.findByElasticsearchStatus(TO_BE_UPDATED)).thenReturn(singletonList(informationType));
        service.synchToElasticsearch();
        verify(elasticsearch, times(0)).insert(any());
        verify(elasticsearch, times(1)).updateById(captor.capture());
        verify(elasticsearch, times(0)).deleteById(any());
        verify(repository, times(1)).updateStatusForInformationType(informationType.getId(), SYNCED);
        verify(repository, times(0)).deleteById(any());
        verifyCapture(true);
    }

    @Test
    void shouldSyncDeletedInformationTypes() {
        lenient().when(repository.findByElasticsearchStatus(TO_BE_DELETED)).thenReturn(singletonList(informationType));
        service.synchToElasticsearch();
        verify(elasticsearch, times(0)).insert(any());
        verify(elasticsearch, times(0)).updateById(any());
        verify(elasticsearch, times(1)).deleteById(captor.capture());
        verify(repository, times(0)).save(any(InformationType.class));
        verify(repository, times(1)).deleteById(informationType.getId());
        verifyCapture(false);
    }

    private void verifyCapture(boolean verifyJson) {
        ElasticsearchDocument document = captor.getValue();

        assertThat(document.getId()).isEqualTo(informationType.getId().toString());
        assertThat(document.getIndex()).isEqualTo("index");
        if (verifyJson) {
            assertThat(document.getJson()).contains(informationType.getId().toString());
            assertThat(document.getJson()).contains(policy.getPurposeCode());
        }
    }

}