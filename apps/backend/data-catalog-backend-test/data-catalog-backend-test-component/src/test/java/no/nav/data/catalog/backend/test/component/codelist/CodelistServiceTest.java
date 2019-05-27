package no.nav.data.catalog.backend.test.component.codelist;

import static no.nav.data.catalog.backend.app.codelist.CodelistService.codelists;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import no.nav.data.catalog.backend.app.codelist.Codelist;
import no.nav.data.catalog.backend.app.codelist.CodelistRepository;
import no.nav.data.catalog.backend.app.codelist.CodelistRequest;
import no.nav.data.catalog.backend.app.codelist.CodelistService;
import no.nav.data.catalog.backend.app.codelist.ListName;
import no.nav.data.catalog.backend.app.common.exceptions.ValidationException;
import no.nav.data.catalog.backend.test.component.ComponentTestConfig;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Optional;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = ComponentTestConfig.class)
@ActiveProfiles("test")
public class CodelistServiceTest {

	@Mock
	private CodelistRepository repository;

	@InjectMocks
	private CodelistService codelistService;

	@Test
	public void shouldSaveCreateRequest() {
		CodelistRequest request = CodelistRequest.builder()
				.list(ListName.CATEGORY)
				.code("TEST_CREATE")
				.description("Test av kategorien TEST_CREATE")
				.build();
		codelistService.save(request);
		verify(repository, times(1)).save(any(Codelist.class));
		assertFalse(codelists.get(request.getList()).get(request.getCode()).isEmpty());
		assertThat(codelists.get(request.getList())
				.get(request.getCode()), is("Test av kategorien TEST_CREATE"));
	}

	@Test
	public void shouldSaveUpdateRequest() {
		codelists.get(ListName.PRODUCER).put("TEST", "Original description");

		CodelistRequest request = CodelistRequest.builder()
				.list(ListName.PRODUCER)
				.code("TEST")
				.description("Updated description")
				.build();

		codelistService.save(request);

		verify(repository, times(1)).save(any(Codelist.class));
		assertThat(codelists.get(request.getList()).get(request.getCode()), is("Updated description"));
	}

	@Test
	public void shouldDelete() {
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

		codelistService.delete(listName, code);

		verify(repository, times(1)).findByListAndCode(any(ListName.class), anyString());
		verify(repository, times(1)).delete(any(Codelist.class));
		assertNull(codelists.get(listName).get(code));
	}

	@Test
	public void shouldValidateCodelistRequest() {
		CodelistRequest request = CodelistRequest.builder()
				.list(ListName.PRODUCER)
				.code("TEST_VALIDATEREQUEST")
				.description("Informasjon oppgitt av tester")
				.build();
		codelistService.validateRequest(request, false);
	}

	@Test
	public void shouldThrowValidationExceptionsOnCreate() {
		CodelistRequest request = CodelistRequest.builder().build();
		try {
			codelistService.validateRequest(request, false);
		} catch (ValidationException e) {
			assertThat(e.get().size(), is(3));
			assertThat(e.get().get("list"), is("The codelist must have a list name"));
			assertThat(e.get().get("code"), is("The code was null or missing"));
			assertThat(e.get().get("description"), is("The description was null or missing"));
		}
	}

	@Test
	public void shouldThrowValidationExceptionsOnUpdate() {
		CodelistRequest request = CodelistRequest.builder().build();
		try {
			codelistService.validateRequest(request, true);
		} catch (ValidationException e) {
			assertThat(e.get().size(), is(3));
			assertThat(e.get().get("list"), is("The codelist must have a list name"));
			assertThat(e.get().get("code"), is("The code was null or missing"));
			assertThat(e.get().get("description"), is("The description was null or missing"));
		}
	}

	@Test
	public void shouldThrowValidationExceptionsOnCreateWhenCodeExist() {
		CodelistRequest request = CodelistRequest.builder().list(ListName.PRODUCER).code("BRUKER").description("Test").build();
		try {
			codelistService.validateRequest(request, false);
		} catch (ValidationException e) {
			assertThat(e.get().size(), is(1));
			assertThat(e.get().get("code"), is("The code BRUKER already exists in PRODUCER"));
		}
	}

	@Test
	public void shouldValidateOnUpdateWhenCodeExist() {
		CodelistRequest request = CodelistRequest.builder().list(ListName.PRODUCER).code("BRUKER").description("Test").build();
		codelistService.validateRequest(request, true);
	}

}
