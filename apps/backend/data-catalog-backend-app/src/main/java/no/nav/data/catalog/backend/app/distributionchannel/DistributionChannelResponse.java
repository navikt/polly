package no.nav.data.catalog.backend.app.distributionchannel;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.catalog.backend.app.common.utils.JsonUtils;
import no.nav.data.catalog.backend.app.system.System;

import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DistributionChannelResponse {

	private UUID id;
	private String name;
	private String description;
	private Set<System> producers;
	private Set<System> consumers;

	DistributionChannelResponse(DistributionChannel distributionChannel) {
		this.id = distributionChannel.getId();
		this.name = distributionChannel.getName();
		this.description = distributionChannel.getDescription();
		this.producers = distributionChannel.getProducers();
		this.consumers = distributionChannel.getConsumers();
	}

    public Map toMap() {
        return JsonUtils.toMap(this);
	}
}
