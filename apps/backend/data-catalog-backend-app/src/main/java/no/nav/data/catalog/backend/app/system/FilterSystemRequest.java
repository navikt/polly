package no.nav.data.catalog.backend.app.system;

import no.nav.data.catalog.backend.app.common.filterrequest.AbstractFilterRequest;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class FilterSystemRequest extends AbstractFilterRequest<System> {

	public FilterSystemRequest mapFromQuery(Map<String, String> queryMap) {
		if (isQueryMapEmpty(queryMap)) {
			return this;
		}
		checkForAndSetPageable(queryMap);
		checkForAndSetSpecification(queryMap);
		return this;
	}

	private void checkForAndSetSpecification(Map<String, String> queryMap) {
		List<Specification<System>> specificationList = new ArrayList<>();

		if (queryMap.get("name") != null) {
			specificationList.add(SystemSpecification.hasName(queryMap.get("name")));
		}
		if (queryMap.get("producerDistributionChannels") != null) {
			specificationList.add(SystemSpecification.hasProducerDistributionChannels(queryMap.get("producerDistributionChannels")));
		}
		if (queryMap.get("consumerDistributionChannels") != null) {
			specificationList.add(SystemSpecification.hasConsumerDistributionChannels(queryMap.get("consumerDistributionChannels")));
		}
	}
}
