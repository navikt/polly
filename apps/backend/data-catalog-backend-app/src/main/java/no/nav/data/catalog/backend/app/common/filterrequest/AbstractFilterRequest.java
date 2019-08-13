package no.nav.data.catalog.backend.app.common.filterrequest;

import lombok.Data;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;

@Data
public abstract class AbstractFilterRequest<T> {
	protected Specification<T> specification;
	protected Pageable pageable;
	private static final int DEFAULT_PAGE_NUMBER = 0;
	private static final int DEFAULT_PAGE_SIZE = 20;

	protected boolean isQueryMapEmpty(Map<String, String> queryMap) {
		if (queryMap.isEmpty()) {
			this.specification = null;        // Specification = null -> no filter applied
			this.pageable = PageRequest.of(DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE);
			return true;
		}
		return false;
	}

	protected void checkForAndSetPageable(Map<String, String> queryMap) {
		int page = queryMap.get("page") == null ? DEFAULT_PAGE_NUMBER : Integer.parseInt(queryMap.get("page"));
		int pageSize = queryMap.get("pageSize") == null ? DEFAULT_PAGE_SIZE : Integer.parseInt(queryMap.get("pageSize"));

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

	// Join Specifications with AND
	protected Specification<T> conjunctureSpecificationFromList(List<Specification<T>> specificationList) {
		Specification<T> buildSpecification = null;
		if (!specificationList.isEmpty()) {
			buildSpecification = Specification.where(specificationList.get(0));
			for (int i = 1; i < specificationList.size(); i++) {
				buildSpecification = buildSpecification.and(specificationList.get(i));  // AND
			}
		}
		return buildSpecification;
	}

	// Join Specifications with OR
	protected Specification<T> disjunctureSpecificationFromList(List<Specification<T>> specificationList) {
		Specification<T> buildSpecification = null;
		if (!specificationList.isEmpty()) {
			buildSpecification = Specification.where(specificationList.get(0));
			for (int i = 1; i < specificationList.size(); i++) {
				buildSpecification = buildSpecification.or(specificationList.get(i));  // OR
			}
		}
		return buildSpecification;
	}
}
