package no.nav.data.polly.process;

import no.nav.data.polly.KafkaIntegrationTestBase;
import no.nav.data.polly.avro.ProcessUpdate;
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

import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;
import static org.junit.jupiter.api.Assertions.assertEquals;

class ProcessUpdateIT extends KafkaIntegrationTestBase {

    @Autowired
    private ProcessService processService;
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
        createAndSavePolicy(4, (index, policy) -> {
            policy.setInformationTypeName(INFORMATION_TYPE_NAME + index);
            policy.getProcess().setName(PROCESS_NAME_1);
            if (index == 0) {
                // Inactive policy should not be sent
                policy.setEnd(LocalDate.now().minusDays(1));
            } else if (index == 1) {
                policy.getProcess().setName("ignored process");
            }
        });

        processService.scheduleDistributeForProcess(Process.builder().name(PROCESS_NAME_1).purposeCode(PURPOSE_CODE1).build());
        processService.distributeAll();

        await().atMost(Duration.ofSeconds(10)).untilAsserted(() -> assertEquals(0L, repository.count()));

        ConsumerRecord<String, ProcessUpdate> singleRecord = KafkaTestUtils.getSingleRecord(consumer, topicProperties.getProcessUpdate());

        assertEquals(PROCESS_NAME_1 + "-" + PURPOSE_CODE1, singleRecord.key());
        assertEquals(PROCESS_NAME_1, singleRecord.value().getProcessName());
        assertEquals(PURPOSE_CODE1, singleRecord.value().getPurposeCode());
        assertThat(singleRecord.value().getInformationTypes()).contains(INFORMATION_TYPE_NAME + 2, INFORMATION_TYPE_NAME + 3);
    }
}
