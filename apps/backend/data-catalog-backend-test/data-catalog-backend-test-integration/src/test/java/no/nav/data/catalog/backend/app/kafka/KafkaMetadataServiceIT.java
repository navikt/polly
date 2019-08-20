package no.nav.data.catalog.backend.app.kafka;

import no.nav.data.catalog.backend.app.IntegrationTestBase;
import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannel;
import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannelRepository;
import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannelRequest;
import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannelType;
import no.nav.data.catalog.backend.app.system.System;
import no.nav.data.catalog.backend.app.system.SystemRepository;
import no.nav.data.catalog.backend.app.system.SystemRequest;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.okJson;
import static com.github.tomakehurst.wiremock.client.WireMock.stubFor;
import static no.nav.data.catalog.backend.app.TestUtil.readFile;
import static org.hamcrest.CoreMatchers.hasItem;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.junit.Assert.assertThat;

public class KafkaMetadataServiceIT extends IntegrationTestBase {

    @Autowired
    private KafkaMetadataService kafkaMetadataService;
    @Autowired
    private DistributionChannelRepository distributionChannelRepository;
    @Autowired
    private SystemRepository systemRepository;

    @Before
    public void setUp() {
        stubKafkaAdminRest();

        distributionChannelRepository.deleteAll();
        systemRepository.deleteAll();
    }

    @Test
    public void syncKafka() {
        kafkaMetadataService.synchDistributions();
        assertResults();
    }

    @Test
    public void syncKafkaWithExistingElements() {
        System producer = systemRepository.save(new System().convertFromRequest(SystemRequest.builder().name("srvbruker-producer").build(), false));
        DistributionChannel distributionChannel = new DistributionChannel()
                .convertFromRequest(DistributionChannelRequest.builder().name("aapen-topic1").type(DistributionChannelType.KAFKA).build(), false);
        distributionChannel.addProducer(producer);
        distributionChannelRepository.save(distributionChannel);

        kafkaMetadataService.synchDistributions();
        assertResults();
    }

    private void assertResults() {
        assertThat(distributionChannelRepository.count(), is(2L));
        assertThat(systemRepository.count(), is(2L));

        transactionTemplate.execute(t -> {
            DistributionChannel topic1 = distributionChannelRepository.findByName("aapen-topic1").orElse(null);

            assertThat(topic1, notNullValue());
            assertThat(topic1.getType(), is(DistributionChannelType.KAFKA));
            assertThat(topic1.getProducers(), hasItem(systemRepository.findByName("srvbruker-producer").orElse(null)));
            assertThat(topic1.getConsumers(), hasItem(systemRepository.findByName("srvbruker-consumer").orElse(null)));

            DistributionChannel topic2 = distributionChannelRepository.findByName("aapen-topic2").orElse(null);

            assertThat(topic2, notNullValue());
            assertThat(topic2.getType(), is(DistributionChannelType.KAFKA));
            assertThat(topic2.getProducers(), hasItem(systemRepository.findByName("srvbruker-producer").orElse(null)));
            assertThat(topic2.getConsumers(), hasItem(systemRepository.findByName("srvbruker-consumer").orElse(null)));

            return null;
        });
    }

    private void stubKafkaAdminRest() {
        stubFor(get("/api/v1/topics").willReturn(okJson("[\"aapen-topic1\",\"privat-topic1\",\"aapen-topic2\"]")));
        stubFor(get("/api/v1/topics/aapen-topic1/groups").willReturn(okJson(readFile("kafka/topic_groups.json").replace("topicname", "topic1"))));
        stubFor(get("/api/v1/topics/aapen-topic2/groups").willReturn(okJson(readFile("kafka/topic_groups.json").replace("topicname", "topic2"))));
    }
}
