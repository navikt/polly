package no.nav.data.catalog.backend.app.distributionchannel;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.catalog.backend.app.system.System;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DistributionChannelResponse {

    private UUID id;
    private String name;
    private String description;
    private List<String> producers;
    private List<String> consumers;

    DistributionChannelResponse(DistributionChannel distributionChannel) {
        this.id = distributionChannel.getId();
        this.name = distributionChannel.getName();
        this.description = distributionChannel.getDescription();
        this.producers = System.names(distributionChannel.getProducers());
        this.consumers = System.names(distributionChannel.getConsumers());
    }
}
