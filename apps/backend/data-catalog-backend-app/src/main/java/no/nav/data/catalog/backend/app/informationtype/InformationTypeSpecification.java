package no.nav.data.catalog.backend.app.informationtype;

import org.springframework.data.jpa.domain.Specification;


class InformationTypeSpecification {

	private InformationTypeSpecification() {
		throw new IllegalStateException("Utility class");
	}

	static Specification<InformationType> hasName(String name) {
		return (root, query, cb) ->
				cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase().trim() + "%");
	}

	static Specification<InformationType> hasDescription(String description) {
		return (root, query, cb) ->
				cb.like(cb.lower(root.get("description")), "%" + description.toLowerCase().trim() + "%");
	}

	static Specification<InformationType> isPersonalData(String personalData) {
		return (root, query, cb) ->
				cb.equal(root.get("personalData").as(String.class), personalData.toLowerCase().trim());
	}

	static Specification<InformationType> hasCategoryCode(String categoryCode) {
		return (root, query, cb) ->
				cb.equal(root.get("categoryCode"), categoryCode.toUpperCase().trim());
	}

	static Specification<InformationType> hasSystemCode(String systemCode) {
		return (root, query, cb) ->
				cb.equal(root.get("systemCode"), systemCode.toUpperCase().trim());
	}

	static Specification<InformationType> hasProducerCode(String producerCode) {
		return (root, query, cb) ->
				cb.like(root.get("producerCode"), "%" + producerCode.toUpperCase().trim() + "%");
	}

}
