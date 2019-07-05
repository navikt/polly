package no.nav.data.catalog.backend.app.distributionchannel;

import static no.nav.data.catalog.backend.app.distributionchannel.DistributionChannelSpecification.hasConsumer;
import static no.nav.data.catalog.backend.app.distributionchannel.DistributionChannelSpecification.hasDescription;
import static no.nav.data.catalog.backend.app.distributionchannel.DistributionChannelSpecification.hasName;
import static no.nav.data.catalog.backend.app.distributionchannel.DistributionChannelSpecification.hasProducer;

import no.nav.data.catalog.backend.app.common.filterrequest.AbstractFilterRequest;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

public class FilterDistributionChannelRequest extends AbstractFilterRequest<DistributionChannel> {

	public FilterDistributionChannelRequest mapFromQuery(Map<String, String> queryMap) {
		if (isQueryMapEmpty(queryMap)) {
			return this;
		}
		checkForAndSetPageable(queryMap);
		checkForAndSetSpecification(queryMap);
		return this;
	}

	private void checkForAndSetSpecification(Map<String, String> queryMap) {
		List<Specification<DistributionChannel>> specificationList = new ArrayList<>();

		if (queryMap.get("name") != null) {
			specificationList.add(hasName(queryMap.get("name")));
		}
		if (queryMap.get("description") != null) {
			specificationList.add(hasDescription(queryMap.get("description")));
		}
		if (queryMap.get("producers") != null) {
			// multiple producers possible, create one Specification for all producers
			Specification<DistributionChannel> producerSpecification = checkForAndSetSystem(queryMap.get("producer"), true);
			if (producerSpecification != null) {
				specificationList.add(producerSpecification);
			}
		}
		if (queryMap.get("consumers") != null) {
			// multiple consumers possible, create one Specification for all consumers
			Specification<DistributionChannel> consumerSpecification = checkForAndSetSystem(queryMap.get("consumer"), false);
			if (consumerSpecification != null) {
				specificationList.add(consumerSpecification);
			}
		}

		this.specification = conjunctureSpecificationFromList(specificationList);
	}

	private Specification<DistributionChannel> checkForAndSetSystem(String listOfSystemIdAsAString, boolean isProducer) {
		List<String> listOfSystemId = Collections.singletonList(listOfSystemIdAsAString);
		List<Specification<DistributionChannel>> specificationList = new ArrayList<>();

		if (isProducer) {
			listOfSystemId.forEach(producer -> specificationList.add(hasProducer(producer)));
		} else {
			listOfSystemId.forEach(consumer -> specificationList.add(hasConsumer(consumer)));
		}

		return disjunctureSpecificationFromList(specificationList);
	}
}
