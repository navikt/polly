package no.nav.data.catalog.backend.app.kafka;

import lombok.extern.slf4j.Slf4j;
import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannelRequest;
import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannelService;
import no.nav.data.catalog.backend.app.kafka.dto.GroupsResponse;
import no.nav.data.catalog.backend.app.kafka.schema.AvroSchemaParser;
import no.nav.data.catalog.backend.app.kafka.schema.SchemaRegistryConsumer;
import no.nav.data.catalog.backend.app.kafka.schema.domain.AvroSchema;
import no.nav.data.catalog.backend.app.kafka.schema.domain.AvroSchemaVersion;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class KafkaMetadataService {

    private final KafkaAdminRestConsumer kafkaAdminRestConsumer;
    private final SchemaRegistryConsumer schemaRegistryConsumer;

    private final DistributionChannelService distributionChannelService;

    public KafkaMetadataService(KafkaAdminRestConsumer kafkaAdminRestConsumer,
            SchemaRegistryConsumer schemaRegistryConsumer,
            DistributionChannelService distributionChannelService) {
        this.kafkaAdminRestConsumer = kafkaAdminRestConsumer;
        this.schemaRegistryConsumer = schemaRegistryConsumer;
        this.distributionChannelService = distributionChannelService;
    }

    public void syncDistributionsFromKafkaAdmin() {
        log.info("Starting kafka distribution sync");
        List<DistributionChannelRequest> requests = kafkaAdminRestConsumer.getAapenTopics()
                .stream()
                .map(this::getDistributionChannelsForTopic)
                .collect(Collectors.toList());

        requests.forEach(distributionChannelService::createOrUpdateDistributionChannelFromKafka);
        log.info("Finished kafka distribution sync of {} topics", requests.size());
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
