package no.nav.data.catalog.backend.app.system;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannel;
import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannelShort;

import java.util.List;
import java.util.UUID;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class SystemResponse {

    private UUID id;
    private String name;
    private List<DistributionChannelShort> producerDistributionChannels;
    private List<DistributionChannelShort> consumerDistributionChannels;

    SystemResponse(System system) {
        this.id = system.getId();
        this.name = system.getName();
        this.producerDistributionChannels = DistributionChannel.distributionChannelShorts(system.getProducerDistributionChannels());
        this.consumerDistributionChannels = DistributionChannel.distributionChannelShorts(system.getConsumerDistributionChannels());
    }

}
