package no.nav.data.catalog.backend.app.kafka;

import no.nav.data.catalog.backend.app.common.utils.JsonUtils;
import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannelRequest;
import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannelType;
import no.nav.data.catalog.backend.app.kafka.dto.GroupsResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static no.nav.data.catalog.backend.app.TestUtil.readFile;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class KafkaMetadataServiceTest {

    @Mock
    private KafkaAdminRestConsumer kafkaAdminRestConsumer;

    @InjectMocks
    private KafkaMetadataService kafkaMetadataService;

    @Test
    void getDistributionChannelsForTopic() {
        when(kafkaAdminRestConsumer.getTopicGroups("aapen-topicname"))
                .thenReturn(JsonUtils.toObject(readFile("kafka/topic_groups.json"), GroupsResponse.class));

        DistributionChannelRequest request = kafkaMetadataService.getDistributionChannelsForTopic("aapen-topicname");

        assertThat(request.getName()).isEqualTo("aapen-topicname");
        assertThat(request.getType()).isEqualTo(DistributionChannelType.KAFKA);
        assertThat(request.getConsumers()).contains("srvbruker-consumer");
        assertThat(request.getProducers()).contains("srvbruker-producer");
    }
}