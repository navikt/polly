package no.nav.data.catalog.backend.app.distributionchannel;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.catalog.backend.app.system.System;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DistributionChannelRequest {

	private String name;
	private String description;
	private Set<System> producers;
	private Set<System> consumers;
}
