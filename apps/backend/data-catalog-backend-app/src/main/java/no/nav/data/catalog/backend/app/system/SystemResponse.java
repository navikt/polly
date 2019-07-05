package no.nav.data.catalog.backend.app.system;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannel;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class SystemResponse {

	private UUID id;
	private String name;
	private Set<DistributionChannel> producerDistributionChannels;
	private Set<DistributionChannel> consumerDistributionChannels;

	SystemResponse(System system) {
		this.id = system.getId();
		this.name = system.getName();
		this.producerDistributionChannels = system.getProducerDistributionChannels();
		this.consumerDistributionChannels = system.getConsumerDistributionChannels();
	}

	Map<String, Object> convertToMap() {
		Map<String, Object> jsonMap = new HashMap<>();
		jsonMap.put("systemId", this.id);
		jsonMap.put("name", this.name);
		jsonMap.put("producerDistributionChannels", this.producerDistributionChannels);
		jsonMap.put("consumerDistributionChannels", this.consumerDistributionChannels);

		return jsonMap;
	}

}
