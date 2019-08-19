package no.nav.data.catalog.backend.app.kafka;

import no.nav.data.catalog.backend.app.common.utils.JsonUtils;
import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannelRequest;
import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannelType;
import no.nav.data.catalog.backend.app.kafka.dto.GroupsResponse;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import static no.nav.data.catalog.backend.app.TestUtil.readFile;
import static org.hamcrest.CoreMatchers.hasItem;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class KafkaMetadataServiceTest {

    @Mock
    private KafkaAdminRestConsumer kafkaAdminRestConsumer;

    @InjectMocks
    private KafkaMetadataService kafkaMetadataService;

    @Test
    public void getDistributionChannelsForTopic() {
        when(kafkaAdminRestConsumer.getTopicAcl("aapen-topicname"))
                .thenReturn(JsonUtils.toObject(readFile("kafka/topic_acl.json"), GroupsResponse.class));

        DistributionChannelRequest request = kafkaMetadataService.getDistributionChannelsForTopic("aapen-topicname");

        assertThat(request.getName(), is("aapen-topicname"));
        assertThat(request.getType(), is(DistributionChannelType.KAFKA));
        assertThat(request.getConsumers(), hasItem("srvbruker-consumer"));
        assertThat(request.getProducers(), hasItem("srvbruker-producer"));
    }
}