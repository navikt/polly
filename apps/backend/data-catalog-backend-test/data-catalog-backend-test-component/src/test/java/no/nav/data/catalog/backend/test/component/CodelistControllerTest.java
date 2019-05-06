package no.nav.data.catalog.backend.test.component;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import no.nav.data.catalog.backend.app.AppStarter;
import no.nav.data.catalog.backend.app.codelist.CodelistRequest;
import no.nav.data.catalog.backend.app.codelist.CodelistService;
import no.nav.data.catalog.backend.app.codelist.ListName;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.HashMap;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = AppStarter.class)
@WebAppConfiguration
@ActiveProfiles("test")
public class CodelistControllerTest {

	private final String BASE_URI = "/backend/codelist";
	private MockMvc mvc;
	private ObjectMapper objectMapper;
	private HashMap<ListName, HashMap<String, String>> codelists;

	@Autowired
	WebApplicationContext webApplicationContext;

	@InjectMocks
	private CodelistService service;

	@Rule
	public ExpectedException expectedException = ExpectedException.none();

	@Before
	public void setUp() {
		mvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
		objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());
		codelists = service.codelists;
	}

	@Test
	public void findAll_shouldReturnCodelists() throws Exception {
		// when
		MockHttpServletResponse response = mvc.perform(MockMvcRequestBuilders.get(BASE_URI))
				.andReturn().getResponse();

		// then
		HashMap<ListName, HashMap<String, String>> returnedCodelist = objectMapper.readValue(response.getContentAsString(), HashMap.class);

		assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
		assertThat(returnedCodelist.values().size()).isEqualTo(3);
		assertThat(returnedCodelist.size()).isEqualTo(codelists.size());
	}

	@Test
	public void findByListName_shouldReturnList() throws Exception {
		String uri = BASE_URI + "/" + ListName.PRODUCER;

		// when
		MockHttpServletResponse response = mvc.perform(MockMvcRequestBuilders.get(uri))
				.andReturn().getResponse();

		HashMap<String, String> producerList = objectMapper.readValue(response.getContentAsString(), HashMap.class);

		// then
		assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
		assertThat(producerList).isEqualTo(codelists.get(ListName.PRODUCER));
	}

	@Test
	public void findByListNameAndCode_shouldReturnCodelistItem() throws Exception {
		String code = "REVISOR";
		String uri = BASE_URI + "/" + ListName.PRODUCER + "/" + code;

		// when
		MockHttpServletResponse response = mvc.perform(MockMvcRequestBuilders.get(uri))
				.andReturn().getResponse();

		// then
		assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
		assertThat(response.getContentAsString()).isEqualTo(codelists.get(ListName.PRODUCER).get(code));
	}

	@Test
	public void findByListNameAndCode_shouldReturnNotFound() throws Exception {
		String uri = BASE_URI + "/" + ListName.PRODUCER + "/UNKNOWN_CODE";

		// when
		MockHttpServletResponse response = mvc.perform(MockMvcRequestBuilders.get(uri))
				.andReturn().getResponse();

		// then
		assertThat(response.getStatus()).isEqualTo(HttpStatus.NOT_FOUND.value());
		assertThat(response.getContentAsString()).isEmpty();
	}

	@Test
	public void save_shouldSaveNewCodelist() throws Exception {
		CodelistRequest request = CodelistRequest.builder()
				.list(ListName.PRODUCER)
				.code("TEST")
				.description("Test save")
				.build();
		String inputJson = objectMapper.writeValueAsString(request);

		// when
		MockHttpServletResponse response = mvc.perform(
				MockMvcRequestBuilders.post(BASE_URI)
						.contentType(MediaType.APPLICATION_JSON_UTF8_VALUE)
						.content(inputJson))
				.andReturn().getResponse();

		// then
		assertThat(response.getStatus()).isEqualTo(HttpStatus.ACCEPTED.value());
		assertThat(response.getContentAsString()).isEqualTo(inputJson);
		assertThat(codelists.get(request.getList()).get(request.getCode())).isNotEmpty();
	}

	@Test
	public void save_shouldReturnBadRequest() throws Exception {
		HashMap<String, String> validationErrors = new HashMap<>();
		validationErrors.put("list", "The codelist must have a list name");
		validationErrors.put("code", "The code was null or missing");
		validationErrors.put("description", "The description was null or missing");

		CodelistRequest request = CodelistRequest.builder().build();
		String inputJson = objectMapper.writeValueAsString(request);

		// when
		MockHttpServletResponse response = mvc.perform(
				MockMvcRequestBuilders.post(BASE_URI)
						.contentType(MediaType.APPLICATION_JSON_UTF8_VALUE)
						.content(inputJson))
				.andReturn().getResponse();

		// then
		assertThat(response.getStatus()).isEqualTo(HttpStatus.BAD_REQUEST.value());
		assertThat(response.getContentAsString()).isEqualTo(objectMapper.writeValueAsString(validationErrors));
	}

	@Test
	public void update_shouldUpdateCodelist() throws Exception {
		// initialize
		CodelistRequest request = CodelistRequest.builder()
				.list(ListName.PRODUCER)
				.code("TEST_SAVE")
				.description("Test save")
				.build();
		String inputJson = objectMapper.writeValueAsString(request);
		mvc.perform(MockMvcRequestBuilders.post(BASE_URI)
				.contentType(MediaType.APPLICATION_JSON_UTF8_VALUE)
				.content(inputJson))
				.andExpect(status().isAccepted());
		assertThat(codelists.get(ListName.PRODUCER).get("TEST_SAVE")).isNotEmpty();
		assertThat(codelists.get(ListName.PRODUCER).get("TEST_SAVE")).isEqualTo("Test save");

		// given
		request = CodelistRequest.builder()
				.list(ListName.PRODUCER)
				.code("TEST_SAVE")
				.description("UPDATED!")
				.build();
		inputJson = objectMapper.writeValueAsString(request);

		// when
		MockHttpServletResponse response = mvc.perform(
				MockMvcRequestBuilders.put(BASE_URI)
						.contentType(MediaType.APPLICATION_JSON_UTF8_VALUE)
						.content(inputJson))
				.andReturn().getResponse();

		// then
		assertThat(response.getStatus()).isEqualTo(HttpStatus.ACCEPTED.value());
		assertThat(response.getContentAsString()).isEqualTo(inputJson);
		assertThat(codelists.get(ListName.PRODUCER).get("TEST_SAVE")).isEqualTo("UPDATED!");
	}

	@Test
	public void update_shouldReturnBadRequest() throws Exception {
		HashMap<String, String> validationErrors = new HashMap<>();
		validationErrors.put("list", "The codelist must have a list name");
		validationErrors.put("code", "The code was null or missing");
		validationErrors.put("description", "The description was null or missing");

		// given
		CodelistRequest request = CodelistRequest.builder().build();
		String inputJson = objectMapper.writeValueAsString(request);

		// when
		MockHttpServletResponse response = mvc.perform(
				MockMvcRequestBuilders.put(BASE_URI)
						.contentType(MediaType.APPLICATION_JSON_UTF8_VALUE)
						.content(inputJson))
				.andReturn().getResponse();

		// then
		assertThat(response.getStatus()).isEqualTo(HttpStatus.BAD_REQUEST.value());
		assertThat(response.getContentAsString()).isEqualTo(objectMapper.writeValueAsString(validationErrors));
	}

	@Test
	public void delete_shouldDeleteCodelistItem() throws Exception {
		// initialize
		String code = "TEST_DELETE";
		String uri = BASE_URI + "/" + ListName.PRODUCER + "/TEST_DELETE";

		CodelistRequest request = CodelistRequest.builder()
				.list(ListName.PRODUCER)
				.code(code)
				.description("Test delete")
				.build();
		String inputJson = objectMapper.writeValueAsString(request);

		mvc.perform(MockMvcRequestBuilders.post(BASE_URI)
				.contentType(MediaType.APPLICATION_JSON_UTF8_VALUE)
				.content(inputJson))
				.andExpect(status().isAccepted());
		assertThat(codelists.get(ListName.PRODUCER).get("TEST_DELETE")).isNotEmpty();

		// when
		MockHttpServletResponse response = mvc.perform(
				MockMvcRequestBuilders.delete(uri))
				.andReturn().getResponse();

		// then
		assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
		assertThat(codelists.get(ListName.PRODUCER).get(code)).isNull();
	}
}