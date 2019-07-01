package no.nav.data.catalog.backend.app.informationtype;

import static java.lang.Boolean.parseBoolean;
import static no.nav.data.catalog.backend.app.codelist.CodelistService.codelists;

import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.catalog.backend.app.codelist.ListName;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;

@Data
@NoArgsConstructor
public class FilterRequest {
	private Specification<InformationType> specification;
	private Pageable pageable;

	public FilterRequest mapFromQuery(Map<String, String> queryMap) {

		if (queryMap.isEmpty()) {
			this.specification = null;
			this.pageable = PageRequest.of(0, 20);
			return this;
		}
		checkForAndSetPageable(queryMap);
		checkForAndSetSpecification(queryMap);
		return this;
	}

	private void checkForAndSetPageable(Map<String, String> queryMap) {
		int page = queryMap.get("page") == null ? 0 : Integer.parseInt(queryMap.get("page"));
		int pageSize = queryMap.get("pageSize") == null ? 20 : Integer.parseInt(queryMap.get("pageSize"));

		if (queryMap.get("sort") != null) {
			Queue<String> queue = new LinkedList<>(Arrays.asList(queryMap.get("sort").split(",")));
			Sort sort = getSortQuery(queue);
			this.pageable = PageRequest.of(page, pageSize, sort);
		} else {
			this.pageable = PageRequest.of(page, pageSize);
		}
	}

	private Sort getSortQuery(Queue<String> queue) {
		String current = queue.remove();
		String next = queue.peek();

		if (next == null) {
			if (current.equalsIgnoreCase("asc")) {
				return Sort.unsorted();
			}
			if (current.equalsIgnoreCase("desc")) {
				return Sort.unsorted().descending();
			}
			return Sort.by(current);
		} else if (next.equalsIgnoreCase("asc")) {
			queue.remove(); // removes direction from queue
			next = queue.peek();
			if (next == null) {  // check if end of queue
				return Sort.by(current).ascending();
			}
			return Sort.by(current).ascending().and(getSortQuery(queue));
		} else if (next.equalsIgnoreCase("desc")) {
			queue.remove(); // removes direction from queue
			next = queue.peek();
			if (next == null) {  // check if end of queue
				return Sort.by(current).descending();
			}
			return Sort.by(current).descending().and(getSortQuery(queue));
		} else {
			return Sort.by(current).and(getSortQuery(queue));
		}
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

		if (specificationList.isEmpty()) {
			this.specification = null;
		} else {
			this.specification = Specification.where(specificationList.get(0));
			for (int i = 1; i < specificationList.size(); i++) {
				this.specification = this.specification.and(specificationList.get(i));
			}
		}
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
		Specification<InformationType> producerSpecification = null;

		allProducers.forEach(p -> {
			if (codeExistInCodelist(ListName.PRODUCER, p)) {
				prodSpecList.add(InformationTypeSpecification.hasProducerCode(p));
			}
		});

		if (!prodSpecList.isEmpty()) {
			producerSpecification = Specification.where(prodSpecList.get(0));
			for (int i = 1; i < prodSpecList.size(); i++) {
				producerSpecification = producerSpecification.or(prodSpecList.get(i));
			}
		}
		return producerSpecification;
	}


}

