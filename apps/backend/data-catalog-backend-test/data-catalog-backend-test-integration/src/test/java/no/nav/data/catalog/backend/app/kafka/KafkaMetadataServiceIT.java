package no.nav.data.catalog.backend.app.kafka;

import com.github.tomakehurst.wiremock.client.WireMock;
import no.nav.data.catalog.backend.app.IntegrationTestBase;
import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannel;
import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannelRequest;
import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannelType;
import no.nav.data.catalog.backend.app.system.System;
import no.nav.data.catalog.backend.app.system.SystemRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.okJson;
import static no.nav.data.catalog.backend.app.TestUtil.readFile;
import static org.assertj.core.api.Assertions.assertThat;

class KafkaMetadataServiceIT extends IntegrationTestBase {

    @Autowired
    private KafkaMetadataService kafkaMetadataService;


    @BeforeEach
    void setUp() {
        stubKafkaAdminRest();
    }

    @Test
    void syncKafka() {
        kafkaMetadataService.syncDistributionsFromKafkaAdmin();
        assertResults();
    }

    @Test
    void syncKafkaWithExistingElements() {
        System producer = systemRepository.save(new System().convertFromRequest(SystemRequest.builder().name("srvbruker-producer").build(), false));
        System producerToRemove = systemRepository.save(new System().convertFromRequest(SystemRequest.builder().name("srvbruker-producer-willberemoved").build(), false));
        DistributionChannel distributionChannel = new DistributionChannel()
                .convertFromRequest(DistributionChannelRequest.builder().name("aapen-topic1").type(DistributionChannelType.KAFKA).build(), false);
        distributionChannel.addProducer(producer);
        distributionChannel.addProducer(producerToRemove);
        distributionChannelRepository.save(distributionChannel);

        kafkaMetadataService.syncDistributionsFromKafkaAdmin();
        assertResults();
    }

    private void assertResults() {
        assertThat(distributionChannelRepository.count()).isEqualTo(2L);

        transactionTemplate.execute(t -> {
            DistributionChannel topic1 = distributionChannelRepository.findByName("aapen-topic1").orElse(null);

            assertThat(topic1).isNotNull();
            assertThat(topic1.getType()).isEqualTo(DistributionChannelType.KAFKA);
            assertThat(topic1.getProducers()).hasSize(1);
            assertThat(topic1.getProducers()).contains(systemRepository.findByName("srvbruker-producer").orElse(null));
            assertThat(topic1.getConsumers()).hasSize(1);
            assertThat(topic1.getConsumers()).contains(systemRepository.findByName("srvbruker-consumer").orElse(null));

            DistributionChannel topic2 = distributionChannelRepository.findByName("aapen-topic2").orElse(null);

            assertThat(topic2).isNotNull();
            assertThat(topic2.getType()).isEqualTo(DistributionChannelType.KAFKA);
            assertThat(topic2.getProducers()).hasSize(1);
            assertThat(topic2.getProducers()).contains(systemRepository.findByName("srvbruker-producer").orElse(null));
            assertThat(topic2.getConsumers()).hasSize(1);
            assertThat(topic2.getConsumers()).contains(systemRepository.findByName("srvbruker-consumer").orElse(null));

            return null;
        });
    }

    private static void stubKafkaAdminRest() {
        WireMock.stubFor(get("/api/v1/topics").willReturn(okJson("{\"topics\":[\"aapen-topic1\",\"privat-topic1\",\"aapen-topic2\"]}")));
        WireMock.stubFor(get("/api/v1/topics/aapen-topic1/groups").willReturn(okJson(readFile("kafka/topic_groups.json").replace("topicname", "topic1"))));
        WireMock.stubFor(get("/api/v1/topics/aapen-topic2/groups").willReturn(okJson(readFile("kafka/topic_groups.json").replace("topicname", "topic2"))));
    }
}
