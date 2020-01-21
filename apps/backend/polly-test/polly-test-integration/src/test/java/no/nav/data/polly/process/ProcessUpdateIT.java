package no.nav.data.polly.process;

import no.nav.data.polly.KafkaIntegrationTestBase;
import no.nav.data.polly.avro.ProcessUpdate;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessDistributionRepository;
import org.apache.kafka.clients.consumer.Consumer;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.test.utils.KafkaTestUtils;

import java.time.Duration;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;
import static org.junit.jupiter.api.Assertions.assertEquals;

class ProcessUpdateIT extends KafkaIntegrationTestBase {

    @Autowired
    private ProcessService processService;
    @Autowired
    private DistributionScheduler distributionScheduler;
    @Autowired
    private ProcessDistributionRepository repository;
    private Consumer<String, ProcessUpdate> consumer;

    @BeforeEach
    void setUp() {
        repository.deleteAll();
        consumer = processUpdateConsumer();
        // Clean out topic
        KafkaTestUtils.getRecords(consumer, 0L);
    }

    @Test
    void produserBehandlingsgrunnlag() {
        Process process = createTestData();

        processService.scheduleDistributeForProcess(Process.builder().id(process.getId()).build());
        distributionScheduler.distributeAll();

        await().atMost(Duration.ofSeconds(10)).untilAsserted(() -> assertEquals(0L, repository.count()));

        ConsumerRecord<String, ProcessUpdate> singleRecord = KafkaTestUtils.getSingleRecord(consumer, topicProperties.getProcessUpdate());

        assertEquals(process.getName() + "-" + PURPOSE_CODE1, singleRecord.key());
        assertEquals(process.getName(), singleRecord.value().getProcessName());
        assertEquals(PURPOSE_CODE1, singleRecord.value().getPurposeCode());
        assertThat(singleRecord.value().getInformationTypes()).contains(INFORMATION_TYPE_NAME + 3, INFORMATION_TYPE_NAME + 4);
    }

    private Process createTestData() {
        var process1 = createAndSaveProcess(PURPOSE_CODE1);
        var process2 = createAndSaveProcess(PURPOSE_CODE1);

        var infoType1 = createAndSaveInformationType(UUID.randomUUID(), INFORMATION_TYPE_NAME + 1);
        var infoType2 = createAndSaveInformationType(UUID.randomUUID(), INFORMATION_TYPE_NAME + 2);
        var infoType3 = createAndSaveInformationType(UUID.randomUUID(), INFORMATION_TYPE_NAME + 3);
        var infoType4 = createAndSaveInformationType(UUID.randomUUID(), INFORMATION_TYPE_NAME + 4);

        Policy policy1 = createPolicy(PURPOSE_CODE1, "BRUKER", List.of(createLegalBasis()));
        policy1.getData().setEnd(LocalDate.now().minusDays(1));
        policy1.setProcess(process1);
        policy1.setInformationType(infoType1);

        Policy policy2 = createPolicy(PURPOSE_CODE1, "BRUKER", List.of(createLegalBasis()));
        policy2.setInformationType(infoType2);
        policy2.setProcess(process2);

        Policy policy3 = createPolicy(PURPOSE_CODE1, "BRUKER", List.of(createLegalBasis()));
        policy3.setInformationType(infoType3);
        policy3.setProcess(process1);

        Policy policy4 = createPolicy(PURPOSE_CODE1, "BRUKER", List.of(createLegalBasis()));
        policy4.setInformationType(infoType4);
        policy4.setProcess(process1);

        policyRepository.saveAll(List.of(policy1, policy2, policy3, policy4));
        return process1;
    }
}
