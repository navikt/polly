package no.nav.data.catalog.backend.app.informationtype;

import static no.nav.data.catalog.backend.app.codelist.CodelistService.codelists;

import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.catalog.backend.app.codelist.ListName;
import no.nav.data.catalog.backend.app.common.filterrequest.AbstractFilterRequest;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
public class FilterInformationTypeRequest extends AbstractFilterRequest<InformationType> {

	public FilterInformationTypeRequest mapFromQuery(Map<String, String> queryMap) {
		if (isQueryMapEmpty(queryMap)) {
			return this;
		}
		checkForAndSetPageable(queryMap);
		checkForAndSetSpecification(queryMap);
		return this;
	}

	private void checkForAndSetSpecification(Map<String, String> queryMap) {
		List<Specification<InformationType>> specificationList = new ArrayList<>();

		if (queryMap.get("name") != null) {
			specificationList.add(InformationTypeSpecification.hasName(queryMap.get("name")));
		}
		if (queryMap.get("description") != null) {
			specificationList.add(InformationTypeSpecification.hasDescription(queryMap.get("description")));
		}
		if (queryMap.get("personalData") != null && (
				queryMap.get("personalData").equalsIgnoreCase("true") ||
						queryMap.get("personalData").equalsIgnoreCase("false"))) {
			specificationList.add(InformationTypeSpecification.isPersonalData(queryMap.get("personalData")));
		}
		if (codeExistInCodelist(ListName.CATEGORY, queryMap.get("category"))) {
			specificationList.add(InformationTypeSpecification.hasCategoryCode(queryMap.get("category")));
		}
		if (codeExistInCodelist(ListName.SYSTEM, queryMap.get("system"))) {
			specificationList.add(InformationTypeSpecification.hasSystemCode(queryMap.get("system")));
		}
		if (queryMap.get("producer") != null) {
			// multiple producers possible, create one Specification for all producers
			Specification<InformationType> producerSpecification = checkForAndSetProducers(queryMap.get("producer"));
			if (producerSpecification != null) {
				specificationList.add(producerSpecification);
			}
		}

		this.specification = conjunctureSpecificationFromList(specificationList);
	}

	private Boolean codeExistInCodelist(ListName listName, String code) {
		if (code == null) {
			return false;
		} else {
			return codelists.get(listName).containsKey(code.toUpperCase().trim());
		}
	}

	private Specification<InformationType> checkForAndSetProducers(String commaSeparatedStringOfProducers) {
		List<String> allProducers = Arrays.asList(commaSeparatedStringOfProducers.split(","));
		List<Specification<InformationType>> prodSpecList = new ArrayList<>();

		allProducers.forEach(p -> {
			if (codeExistInCodelist(ListName.PRODUCER, p)) {
				prodSpecList.add(InformationTypeSpecification.hasProducerCode(p));
			}
		});

		return disjunctureSpecificationFromList(prodSpecList);
	}


}

