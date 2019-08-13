package no.nav.data.catalog.backend.test.component.informationtype;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.instanceOf;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

import no.nav.data.catalog.backend.app.informationtype.FilterInformationTypeRequest;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.util.Collections;
import java.util.Map;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.instanceOf;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

@RunWith(MockitoJUnitRunner.class)
public class InformationTypeSpecificationTest {

	private Pageable defaultPageable = PageRequest.of(0, 20);

	@Test
	public void mapFromQuery_withEmptyQuery_willReturnDefaultRestResponsePage() {
		Map<String, String> queryMap = Collections.emptyMap();

		FilterInformationTypeRequest filterRequest = new FilterInformationTypeRequest().mapFromQuery(queryMap);

		assertNull(filterRequest.getSpecification());
		assertThat(filterRequest.getPageable(), is(defaultPageable));
	}

	@Test
	public void mapFromQuery_withPageableNumber_willNotBeDefaultPageable() {
		Map<String, String> queryMap = Map.of("page", "1");

		FilterInformationTypeRequest filterRequest = new FilterInformationTypeRequest().mapFromQuery(queryMap);

		assertNull(filterRequest.getSpecification());
		assertNotEquals(defaultPageable, filterRequest.getPageable());
		assertThat(filterRequest.getPageable().getPageNumber(), is(1));
	}

	@Test
	public void mapFromQuery_withPageable_willBePage3WithPageSize25() {
		Map<String, String> queryMap = Map.of("page", "3", "pageSize", "25");

		FilterInformationTypeRequest filterRequest = new FilterInformationTypeRequest().mapFromQuery(queryMap);

		assertNull(filterRequest.getSpecification());
		assertNotEquals(defaultPageable, filterRequest.getPageable());
		assertThat(filterRequest.getPageable().getPageNumber(), is(3));
		assertThat(filterRequest.getPageable().getPageSize(), is(25));
	}

	@Test
	public void mapFromQuery_withSortById_willHaveSortInPageable() {
		Map<String, String> queryMap = Map.of("sort", "id");

		FilterInformationTypeRequest filterRequest = new FilterInformationTypeRequest().mapFromQuery(queryMap);

		assertNull(filterRequest.getSpecification());
		assertNotEquals(defaultPageable, filterRequest.getPageable());
		assertThat(filterRequest.getPageable().getPageNumber(), is(0));
		assertThat(filterRequest.getPageable().getPageSize(), is(20));
		assertThat(filterRequest.getPageable().getSort(), is(Sort.by("id")));
	}

	@Test
	public void mapFromQuery_withSortByIdDescending_willHaveSortInPageable() {
		Map<String, String> queryMap = Map.of("sort", "id,desc");

		FilterInformationTypeRequest filterRequest = new FilterInformationTypeRequest().mapFromQuery(queryMap);

		assertNull(filterRequest.getSpecification());
		assertNotEquals(defaultPageable, filterRequest.getPageable());
		assertThat(filterRequest.getPageable().getPageNumber(), is(0));
		assertThat(filterRequest.getPageable().getPageSize(), is(20));
		assertThat(filterRequest.getPageable().getSort(), is(Sort.by("id").descending()));
	}

	@Test
	public void mapFromQuery_withName_willHaveSpecificationHasName() {
		Map<String, String> queryMap = Map.of("name", "Sivilstand");

		FilterInformationTypeRequest filterRequest = new FilterInformationTypeRequest().mapFromQuery(queryMap);

		assertNotNull(filterRequest.getSpecification());
		assertThat(filterRequest.getSpecification(), instanceOf(Specification.class));
		assertEquals(defaultPageable, filterRequest.getPageable());
	}

}
