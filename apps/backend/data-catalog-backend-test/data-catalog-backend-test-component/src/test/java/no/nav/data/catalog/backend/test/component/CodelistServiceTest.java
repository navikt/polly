package no.nav.data.catalog.backend.test.component;

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
				.code("TEST")
				.description("Test av kategorien TEST")
				.build();
		codelistService.save(request);
		verify(repository, times(1)).save(any(Codelist.class));
		assertFalse(codelistService.codelists.get(request.getList()).get(request.getCode()).isEmpty());
		assertThat(codelistService.codelists.get(request.getList()).get(request.getCode()), is("Test av kategorien TEST"));
	}

	@Test
	public void shouldSaveUpdateRequest() {
		CodelistRequest request = CodelistRequest.builder()
				.list(ListName.PRODUCER)
				.code("BRUKER")
				.description("Update av kategorien BRUKER")
				.build();
		assertFalse(codelistService.codelists.get(request.getList()).get(request.getCode()).isEmpty());
		assertThat(codelistService.codelists.get(request.getList())
				.get(request.getCode()), is("Informasjon oppgitt av bruker"));

		codelistService.save(request);

		verify(repository, times(1)).save(any(Codelist.class));
		assertThat(codelistService.codelists.get(request.getList()).get(request.getCode()), is("Update av kategorien BRUKER"));
	}

	@Test
	public void shouldDelete() {
		ListName listName = ListName.CATEGORY;
		String code = "TEST";
		Codelist codelist = Codelist.builder()
				.list(listName)
				.code(code)
				.description("Test av kategorien TEST")
				.build();
		when(repository.findByListAndCode(listName, code)).thenReturn(Optional.of(codelist));
		repository.save(codelist);

		codelistService.delete(listName, code);
		verify(repository, times(1)).findByListAndCode(any(ListName.class), anyString());
		verify(repository, times(1)).delete(any(Codelist.class));
		assertNull(codelistService.codelists.get(listName).get(code));
	}

	@Test
	public void shouldValidateCodelistRequest() {
		CodelistRequest request = CodelistRequest.builder()
				.list(ListName.PRODUCER)
				.code("TEST")
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
