package no.nav.data.catalog.backend.app.kafka;

import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannelRequest;
import no.nav.data.catalog.backend.app.kafka.dto.GroupsResponse;
import no.nav.data.catalog.backend.app.kafka.schema.AvroSchemaParser;
import no.nav.data.catalog.backend.app.kafka.schema.SchemaRegistryConsumer;
import org.springframework.stereotype.Service;

@Service
public class KafkaMetadataService {

    private final KafkaAdminRestConsumer kafkaAdminRestConsumer;
    private final SchemaRegistryConsumer schemaRegistryConsumer;
    private final AvroSchemaParser avroSchemaParser;

    public KafkaMetadataService(KafkaAdminRestConsumer kafkaAdminRestConsumer, SchemaRegistryConsumer schemaRegistryConsumer,
            AvroSchemaParser avroSchemaParser) {
        this.kafkaAdminRestConsumer = kafkaAdminRestConsumer;
        this.schemaRegistryConsumer = schemaRegistryConsumer;
        this.avroSchemaParser = avroSchemaParser;
    }

    public DistributionChannelRequest getDistributionChannelsForTopic(String topic) {
        GroupsResponse groupsResponse = kafkaAdminRestConsumer.getTopicAcl(topic);
        return groupsResponse.convertToDistributionChannelRequest();
    }
}
