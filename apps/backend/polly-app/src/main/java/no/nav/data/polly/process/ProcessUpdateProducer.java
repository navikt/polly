package no.nav.data.polly.process;

import io.prometheus.client.Collector;
import io.prometheus.client.Counter;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.avro.ProcessUpdate;
import no.nav.data.polly.kafka.KafkaTopicProperties;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

import static no.nav.data.common.utils.MetricUtils.counter;


@Slf4j
@Component
public class ProcessUpdateProducer {

    private final Counter counter;
    private final String topic;
    private final KafkaTemplate<String, ProcessUpdate> kafkaTemplate;

    @SuppressWarnings("unchecked")
    public ProcessUpdateProducer(
            KafkaTopicProperties topics,
            KafkaTemplate<?, ?> kafkaTemplate
    ) {
        this.topic = topics.getProcessUpdate();
        this.kafkaTemplate = (KafkaTemplate<String, ProcessUpdate>) kafkaTemplate;

        counter = initMetrics();
    }

    boolean sendProcess(String processName, String purposeCode, List<String> informationTypeNames) {
        var process = new ProcessUpdate(processName, purposeCode, new ArrayList<>(informationTypeNames));
        log.info("Sender behandlingsgrunnlag {} på topic {}", process, topic);

        try {
            kafkaTemplate.send(topic, processName + "-" + purposeCode, process).get();
            counter.labels("ok").inc();
            return true;
        } catch (Exception e) {
            log.error("Failed to send message to topic " + topic, e);
            counter.labels("feil").inc();
            return false;
        }
    }

    private Counter initMetrics() {
        return counter()
                .labels("feil").labels("ok")
                .name(Collector.sanitizeMetricName(String.format("polly_kafka_producer_%s_counter", topic)))
                .help(String.format("Kafka melding lagt på topic %s", topic))
                .labelNames("resultat")
                .register();
    }

}
