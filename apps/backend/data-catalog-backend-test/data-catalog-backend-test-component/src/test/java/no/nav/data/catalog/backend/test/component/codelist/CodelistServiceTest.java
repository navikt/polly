package no.nav.data.catalog.backend.test.component.codelist;

import static no.nav.data.catalog.backend.app.codelist.CodelistService.codelists;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import no.nav.data.catalog.backend.app.codelist.Codelist;
import no.nav.data.catalog.backend.app.codelist.CodelistRepository;
import no.nav.data.catalog.backend.app.codelist.CodelistRequest;
import no.nav.data.catalog.backend.app.codelist.CodelistService;
import no.nav.data.catalog.backend.app.codelist.ListName;
import no.nav.data.catalog.backend.app.common.exceptions.CodelistNotFoundException;
import no.nav.data.catalog.backend.app.common.exceptions.ValidationException;
import no.nav.data.catalog.backend.test.component.ComponentTestConfig;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = ComponentTestConfig.class)
@ActiveProfiles("test")
public class CodelistServiceTest {

	@Mock
	private CodelistRepository repository;

	@InjectMocks
	private CodelistService service;

	@Test
	public void save_shouldCreateRequest_whenRequestIsValid() {
		CodelistRequest request = CodelistRequest.builder()
				.list(ListName.CATEGORY)
				.code("TEST_CREATE")
				.description("Test av kategorien TEST_CREATE")
				.build();
		service.save(List.of(request));
		verify(repository, times(1)).saveAll(anyList());
		assertThat(codelists.get(ListName.CATEGORY).get("TEST_CREATE"), is("Test av kategorien TEST_CREATE"));
	}

	@Test
	public void update_shouldUpdateRequest_whenRequestIsValid() {
		codelists.get(ListName.PRODUCER).put("TEST_UPDATE", "Original description");

		CodelistRequest request = CodelistRequest.builder()
				.list(ListName.PRODUCER)
				.code("TEST_UPDATE")
				.description("Updated description")
				.build();

		when(repository.findByListAndCode(request.getList(), request.getCode())).thenReturn(Optional.of(request.convert()));

		service.update(List.of(request));

		verify(repository, times(1)).saveAll(anyList());
		verify(repository, times(1)).findByListAndCode(any(ListName.class), anyString());
		assertThat(codelists.get(request.getList()).get(request.getCode()), is("Updated description"));
	}

	@Test
	public void update_shouldThrowNotFound_whenCodeDoesNotExist() {
		CodelistRequest request = CodelistRequest.builder()
				.list(ListName.PRODUCER)
				.code("UNKNOWN_CODE")
				.description("Updated description")
				.build();

		when(repository.findByListAndCode(ListName.PRODUCER, "UNKNOWN_CODE")).thenReturn(Optional.empty());

		try {
			service.update(List.of(request));
		} catch (CodelistNotFoundException e) {
			assertThat(e.getLocalizedMessage(), is("Cannot find codelist with code=UNKNOWN_CODE in list=PRODUCER"));
		}
	}

	@Test
	public void delete_shouldDelete_whenListAndCodeExists() {
		ListName listName = ListName.CATEGORY;
		String code = "TEST_DELETE";
		String description = "Test delete description";

		codelists.get(listName).put(code, description);
		Codelist codelist = Codelist.builder()
				.list(listName)
				.code(code)
				.description(description)
				.build();
		when(repository.findByListAndCode(listName, code)).thenReturn(Optional.of(codelist));

		service.delete(listName, code);

		verify(repository, times(1)).findByListAndCode(any(ListName.class), anyString());
		verify(repository, times(1)).delete(any(Codelist.class));
		assertNull(codelists.get(listName).get(code));
	}

	@Test
	public void delete_shouldThrowIllegalArgumentException_whenCodeDoesNotExist() {
		when(repository.findByListAndCode(ListName.PRODUCER, "UNKNOWN_CODE")).thenReturn(Optional.empty());


		try {
			service.delete(ListName.PRODUCER, "UNKNOWN_CODE");
		} catch (IllegalArgumentException e) {
			assertThat(e.getLocalizedMessage(), is("Cannot find a codelist to delete with code=UNKNOWN_CODE and listName=PRODUCER"));
		}
	}

	@Test
	public void validateListNameExistsANDvalidateListNameAndCodeExists_nothingShouldHappen_whenValuesExists() {
		codelists.get(ListName.PURPOSE).put("CODE", "Description");

		service.validateListNameExists("PURPOSE");
		service.validateListNameAndCodeExists("PURPOSE", "CODE");
	}

	@Test
	public void validateListNameExists_shouldThrowNotFound_whenListNameDoesNotExists() {
		try {
			service.validateListNameExists("UNKNOWN_LISTNAME");
		} catch (CodelistNotFoundException e) {
			assertThat(e.getLocalizedMessage(), is("Codelist with listName=UNKNOWN_LISTNAME does not exist"));
		}
	}

	@Test
	public void validateListNameAndCodeExists_shouldThrowNotFound_whenCodeDoesNotExists() {
		try {
			service.validateListNameAndCodeExists("PRODUCER", "unknownCode");
		} catch (CodelistNotFoundException e) {
			assertThat(e.getLocalizedMessage(), is("The code=unknownCode does not exist in the list=PRODUCER."));
		}
	}

	@Test
	public void isListNamePresentInCodelist_shouldReturnOptionalEmpty_whenListNameDoesNotExist() {
		boolean unknownListName = service.isListNamePresentInCodelist("UnknownListName");

		assertFalse(unknownListName);
	}

	@Test
	public void validateRequestsCreate_shouldValidateListOfCodelistRequests() {
		List<CodelistRequest> requests = new ArrayList<>();
		requests.add(CodelistRequest.builder()
				.list(ListName.PRODUCER)
				.code("TEST")
				.description("Informasjon oppgitt av tester")
				.build());
		requests.add(CodelistRequest.builder()
				.list(ListName.SYSTEM)
				.code("TEST")
				.description("Informasjon oppgitt av tester")
				.build());
		requests.add(CodelistRequest.builder()
				.list(ListName.CATEGORY)
				.code("TEST")
				.description("Informasjon oppgitt av tester")
				.build());

		service.validateRequests(requests, false);
	}

	@Test
	public void validateRequestsCreate_shouldThrowValidationException_withEmptyListOfRequests() {
		List<CodelistRequest> requests = Collections.emptyList();
		try {
			service.validateRequests(requests, false);
		} catch (ValidationException e) {
			assertThat(e.getLocalizedMessage(), is("The request was not accepted because it is empty"));
		}
	}

	@Test
	public void validateRequestsCreate_shouldThrowValidationException_whenRequestHasEmptyValues() {
		CodelistRequest request = CodelistRequest.builder().build();
		try {
			service.validateRequests(List.of(request), false);
		} catch (ValidationException e) {
			assertThat(e.get().size(), is(1));
			assertThat(e.get().get("Request:1").size(), is(3));
			assertThat(e.get().get("Request:1").get("list"), is("The codelist must have a listName"));
			assertThat(e.get().get("Request:1").get("code"), is("The code was null or missing"));
			assertThat(e.get().get("Request:1").get("description"), is("The description was null or missing"));
		}
	}

	@Test
	public void validateRequestsCreate_shouldThrowValidationException_whenCodelistExistsInRepository() {
		CodelistRequest request = CodelistRequest.builder().list(ListName.PRODUCER).code("BRUKER").description("Test").build();
		service.save(List.of(request));
		try {
			service.validateRequests(List.of(request), false);
		} catch (ValidationException e) {
			assertThat(e.get().size(), is(1));
			assertThat(e.get().get("Request:1").size(), is(1));
			assertThat(e.get().get("Request:1").get("code"),
					is("The code BRUKER already exists in the codelist(PRODUCER) and therefore cannot be created"));
		}
	}

	@Test
	public void validateRequestsCreate_shouldThrowValidationException_whenCodelistExistsInRequest() {
		List<CodelistRequest> requests = new ArrayList<>();
		requests.add(CodelistRequest.builder()
				.list(ListName.PRODUCER)
				.code("TEST")
				.description("Informasjon oppgitt av tester")
				.build());
		requests.add(CodelistRequest.builder()
				.list(ListName.SYSTEM)
				.code("TEST")
				.description("Informasjon oppgitt av tester")
				.build());
		requests.add(CodelistRequest.builder()
				.list(ListName.CATEGORY)
				.code("TEST")
				.description("Informasjon oppgitt av tester")
				.build());
		requests.add(CodelistRequest.builder()
				.list(ListName.PRODUCER)
				.code("TEST")
				.description("Informasjon oppgitt av tester")
				.build());

		try {
			service.validateRequests(requests, false);
		} catch (ValidationException e) {
			assertThat(e.get().size(), is(1));
			assertThat(e.get().get("NotUniqueRequests").size(), is(1));
			assertThat(e.get().get("NotUniqueRequests").get("PRODUCER-TEST"),
					is("Request:4 - The codelist PRODUCER-TEST is not unique because it has already been used in this request (see request:1)"));
		}
	}

	@Test
	public void validateRequestUpdate_shouldValidate_whenCodelistsExists() {
		List<CodelistRequest> requests = new ArrayList<>();
		requests.add(CodelistRequest.builder()
				.list(ListName.PRODUCER)
				.code("TEST")
				.description("Informasjon oppgitt av tester")
				.build());
		service.save(requests);

		service.validateRequests(requests, true);
	}

	@Test
	public void validateRequestsUpdate_shouldThrowValidationException_whenRequestHasEmptyValues() {
		CodelistRequest request = CodelistRequest.builder().build();
		try {
			service.validateRequests(List.of(request), true);
		} catch (ValidationException e) {
			assertThat(e.get().size(), is(1));
			assertThat(e.get().get("Request:1").size(), is(3));
			assertThat(e.get().get("Request:1").get("list"), is("The codelist must have a listName"));
			assertThat(e.get().get("Request:1").get("code"), is("The code was null or missing"));
			assertThat(e.get().get("Request:1").get("description"), is("The description was null or missing"));
		}
	}

	@Test
	public void shouldThrowValidationExceptionOnUpdate_whenCodelistDoesNotExist() {
		CodelistRequest request = CodelistRequest.builder()
				.list(ListName.PRODUCER)
				.code("unknownCode")
				.description("Test")
				.build();
		try {
			service.validateRequests(List.of(request), true);
		} catch (ValidationException e) {
			assertThat(e.get().size(), is(1));
			assertThat(e.get().get("Request:1").size(), is(1));
			assertThat(e.get().get("Request:1").get("code"),
					is("The code UNKNOWNCODE does not exist in the codelist(PRODUCER) and therefore cannot be updated"));
		}
	}

	@Test
	public void validateRequest_shouldChangeCodeAndDescriptionInRequestToCorrectFormat() {
		List<CodelistRequest> requests = List.of(CodelistRequest.builder()
				.list(ListName.CATEGORY)
				.code("    cOrRecTFormAT  ")
				.description("   Trim av description                      ")
				.build());
		service.validateRequests(requests, false);
		service.save(requests);
		assertTrue(codelists.get(ListName.CATEGORY).containsKey("CORRECTFORMAT"));
		assertTrue(codelists.get(ListName.CATEGORY).containsValue("Trim av description"));
	}
}
