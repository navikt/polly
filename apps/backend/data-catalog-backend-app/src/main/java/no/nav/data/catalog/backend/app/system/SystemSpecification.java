package no.nav.data.catalog.backend.app.system;

import org.springframework.data.jpa.domain.Specification;

public class SystemSpecification {

	private SystemSpecification() {
		throw new IllegalStateException("Utility class");
	}

	static Specification<System> hasName(String name) {
		return (root, query, criteriaBuilder) ->
				criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + name.toLowerCase().trim() + "%");
	}

	static Specification<System> hasProducerDistributionChannels(String producer) {
		return (root, query, cb) ->
				cb.equal(root.get("producerDistributionChannels"), producer.toUpperCase().trim());
	}

	static Specification<System> hasConsumerDistributionChannels(String consumer) {
		return (root, query, cb) ->
				cb.equal(root.get("consumerDistributionChannels"), consumer.toUpperCase().trim());
	}
}