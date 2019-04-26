package no.nav.data.catalog.backend.test.component;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThat;

import no.nav.data.catalog.backend.app.codelist.CodelistRepository;
import no.nav.data.catalog.backend.app.codelist.CodelistRequest;
import no.nav.data.catalog.backend.app.codelist.CodelistService;
import no.nav.data.catalog.backend.app.codelist.ListName;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.HashMap;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = ComponentTestConfig.class)
@ActiveProfiles("test")
public class CodelistControllerTest extends AbstractControllerTest {

	private final String BASE_URI = "/backend/codelist";

	@Mock
	private CodelistService codelistService;

	@Mock
	private CodelistRepository repository;

	@Override
	@Before
	public void setUp() {
		super.setUp();
	}

	@Test
	public void shouldFindAll() throws Exception {
		MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(BASE_URI)).andReturn();

		int status = mvcResult.getResponse().getStatus();
		assertEquals(200, status);
		String content = mvcResult.getResponse().getContentAsString();
		HashMap<ListName, HashMap<String, String>> codelists = super.mapFromJson(content, HashMap.class);
		assertThat(codelists.values().size(), is(3));
		assertThat(codelists.size(), is(codelistService.codelists.size()));
	}

	@Test
	public void shouldFindByListName() throws Exception {
		String uri = BASE_URI + "/" + ListName.PRODUCER;
		MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(uri)).andReturn();

		int status = mvcResult.getResponse().getStatus();
		assertEquals(200, status);
		String content = mvcResult.getResponse().getContentAsString();
		HashMap<String, String> producerList = super.mapFromJson(content, HashMap.class);
		assertFalse(producerList.isEmpty());
		assertThat(producerList.size(), is(codelistService.codelists.get(ListName.PRODUCER).size()));
	}

	@Test
	public void shouldFindByListNameAndCode() throws Exception {
		String code = "REVISOR";
		String uri = BASE_URI + "/" + ListName.PRODUCER + "/" + code;
		MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(uri)).andReturn();

		int status = mvcResult.getResponse().getStatus();
		assertEquals(200, status);
		String content = mvcResult.getResponse().getContentAsString();
		assertFalse(content.isEmpty());
		assertThat(content, is(codelistService.codelists.get(ListName.PRODUCER).get(code)));
	}


	@Test
	public void shouldSaveNewCodelist() throws Exception {
		CodelistRequest request = CodelistRequest.builder()
				.list(ListName.PRODUCER)
				.code("TEST")
				.description("Test av producer TEST")
				.build();
		String inputJson = super.mapToJson(request);
		MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.post(BASE_URI)
				.contentType(MediaType.APPLICATION_JSON_VALUE)
				.content(inputJson)).andReturn();

		int status = mvcResult.getResponse().getStatus();
		assertEquals(202, status);
		assertFalse(codelistService.codelists.get(request.getList()).get(request.getCode()).isEmpty());
		assertThat(codelistService.codelists.get(request.getList()).get(request.getCode()), is("Test av producer TEST"));
	}

	@Test
	public void shouldSaveUpdatedCodelist() throws Exception {
		CodelistRequest request = CodelistRequest.builder()
				.list(ListName.PRODUCER)
				.code("REVISOR")
				.description("Updated producer Revisor")
				.build();
		String inputJson = super.mapToJson(request);
		MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.put(BASE_URI)
				.contentType(MediaType.APPLICATION_JSON_VALUE)
				.content(inputJson)).andReturn();

		int status = mvcResult.getResponse().getStatus();
		assertEquals(202, status);
		assertFalse(codelistService.codelists.get(request.getList()).get(request.getCode()).isEmpty());
		assertThat(codelistService.codelists.get(request.getList()).get(request.getCode()), is("Updated producer Revisor"));
	}

	@Test
	public void shouldDeleteCodelist() throws Exception {
		String code = "REVISOR";
		assertFalse(codelistService.codelists.get(ListName.PRODUCER).get(code).isEmpty());

		String uri = BASE_URI + "/" + ListName.PRODUCER + "/" + code;
		MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.delete(uri)).andReturn();

		int status = mvcResult.getResponse().getStatus();
		assertEquals(200, status);
		assertNull(codelistService.codelists.get(ListName.PRODUCER).get(code));
	}

	@Test
	public void shouldRefresh() throws Exception {
		String uri = BASE_URI + "/refresh";

		MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(uri)).andReturn();

		int status = mvcResult.getResponse().getStatus();
		assertEquals(200, status);
	}

}
