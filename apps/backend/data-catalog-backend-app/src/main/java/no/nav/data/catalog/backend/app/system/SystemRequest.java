package no.nav.data.catalog.backend.app.system;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannel;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemRequest {

	private String name;
	private Set<DistributionChannel> producerDistributionChannels;
	private Set<DistributionChannel> consumerDistributionChannels;

}
