package no.nav.data.catalog.backend.app.distributionchannel;


import org.springframework.data.jpa.domain.Specification;

public class DistributionChannelSpecification {

	private DistributionChannelSpecification() {
		throw new IllegalStateException("Utility class");
	}

	static Specification<DistributionChannel> hasName(String name) {
		return (root, query, cb) ->
				cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase().trim() + "%");
	}

	static Specification<DistributionChannel> hasDescription(String description) {
		return (root, query, cb) ->
				cb.like(cb.lower(root.get("description")), "%" + description.toLowerCase().trim() + "%");
	}

	static Specification<DistributionChannel> hasProducer(String producerId) {
		return (root, query, cb) ->
				cb.equal(root.get("producers").get("systemId"), producerId.trim());
	}

	static Specification<DistributionChannel> hasConsumer(String consumerId) {
		return (root, query, cb) ->
				cb.equal(root.get("consumers").get("systemId"), consumerId.trim());
	}
}
