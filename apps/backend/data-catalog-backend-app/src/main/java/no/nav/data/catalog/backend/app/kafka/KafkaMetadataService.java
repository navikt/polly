package no.nav.data.catalog.backend.app.kafka;

import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannelRequest;
import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannelService;
import no.nav.data.catalog.backend.app.kafka.dto.GroupsResponse;
import no.nav.data.catalog.backend.app.kafka.schema.AvroSchemaParser;
import no.nav.data.catalog.backend.app.kafka.schema.SchemaRegistryConsumer;
import no.nav.data.catalog.backend.app.kafka.schema.domain.AvroSchema;
import no.nav.data.catalog.backend.app.kafka.schema.domain.AvroSchemaVersion;
import org.springframework.stereotype.Service;

@Service
public class KafkaMetadataService {

    private final KafkaAdminRestConsumer kafkaAdminRestConsumer;
    private final SchemaRegistryConsumer schemaRegistryConsumer;
    private final AvroSchemaParser avroSchemaParser;

    private final DistributionChannelService distributionChannelService;

    public KafkaMetadataService(KafkaAdminRestConsumer kafkaAdminRestConsumer,
            SchemaRegistryConsumer schemaRegistryConsumer,
            AvroSchemaParser avroSchemaParser,
            DistributionChannelService distributionChannelService) {
        this.kafkaAdminRestConsumer = kafkaAdminRestConsumer;
        this.schemaRegistryConsumer = schemaRegistryConsumer;
        this.avroSchemaParser = avroSchemaParser;
        this.distributionChannelService = distributionChannelService;
    }

    public void synchDistributions() {
        kafkaAdminRestConsumer.getAapenTopics()
                .stream()
                .map(this::getDistributionChannelsForTopic)
                .forEach(distributionChannelService::createOrUpdateDistributionChannelFromKafka);
    }

    public AvroSchema getSchemaForTopic(String topic) {
        AvroSchemaVersion schemaVersion = schemaRegistryConsumer.getAvroSchemaVersionForTopic(topic);
        if (schemaVersion == null) {
            return null;
        }
        return AvroSchemaParser.parseSchema(schemaVersion);
    }

    DistributionChannelRequest getDistributionChannelsForTopic(String topic) {
        GroupsResponse groupsResponse = kafkaAdminRestConsumer.getTopicGroups(topic);
        return groupsResponse.convertToDistributionChannelRequest();
    }
}
