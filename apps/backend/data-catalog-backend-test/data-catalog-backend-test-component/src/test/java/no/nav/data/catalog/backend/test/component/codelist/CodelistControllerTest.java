package no.nav.data.catalog.backend.test.component.codelist;

import static junit.framework.TestCase.assertNull;
import static junit.framework.TestCase.assertTrue;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import no.nav.data.catalog.backend.app.AppStarter;
import no.nav.data.catalog.backend.app.codelist.CodelistRepository;
import no.nav.data.catalog.backend.app.codelist.CodelistRequest;
import no.nav.data.catalog.backend.app.codelist.CodelistService;
import no.nav.data.catalog.backend.app.codelist.ListName;
import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
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

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = AppStarter.class)
@WebAppConfiguration
@ActiveProfiles("test")
public class CodelistControllerTest {

	private MockMvc mvc;
	private ObjectMapper objectMapper;
	private HashMap<ListName, HashMap<String, String>> codelists;

	@Autowired
	WebApplicationContext webApplicationContext;

	@InjectMocks
	private CodelistService service;

	@MockBean
	private CodelistRepository repository;

	@Rule
	public ExpectedException expectedException = ExpectedException.none();

	@Before
	public void setUp() {
		repository.deleteAll();
		mvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
		objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());
		initializeCodelist();
	}

	@After
	public void cleanUp() {
		repository.deleteAll();
	}

	private void initializeCodelist() {
		codelists = CodelistService.codelists;
		codelists.get(ListName.PRODUCER).put("ARBEIDSGIVER", "Arbeidsgiver");
		codelists.get(ListName.PRODUCER).put("SKATTEETATEN", "Skatteetaten");
		codelists.get(ListName.CATEGORY).put("PERSONALIA", "Personalia");
		codelists.get(ListName.CATEGORY).put("ARBEIDSFORHOLD", "Arbeidsforhold");
		codelists.get(ListName.CATEGORY).put("UTDANNING", "Utdanning");
		codelists.get(ListName.SYSTEM).put("TPS", "Tjenestebasert PersondataSystem");
	}

	@Test
	public void findAll_shouldReturnTheInitiatedCodelist() throws Exception {
		MockHttpServletResponse response = mvc.perform(get("/codelist"))
				.andReturn().getResponse();

		HashMap<String, HashMap<String, String>> returnedCodelist = objectMapper.readValue(response.getContentAsString(), HashMap.class);

		assertThat(response.getStatus(), is(HttpStatus.OK.value()));
		assertThat(returnedCodelist.size(), is(codelists.size()));
		assertThat(returnedCodelist.get("PRODUCER").size(), is(2));
		assertThat(returnedCodelist.get("CATEGORY").size(), is(3));
		assertThat(returnedCodelist.get("SYSTEM").size(), is(1));
	}

	@Test
	public void getCodelistByListName_shouldReturnCodelistForProducer() throws Exception {
		String uri = "/codelist/PRODUCER";

		MockHttpServletResponse response = mvc.perform(get(uri))
				.andExpect(status().isOk())
				.andReturn().getResponse();

		Map mappedResponse = objectMapper.readValue(response.getContentAsString(), HashMap.class);
		assertThat(mappedResponse, is(codelists.get(ListName.PRODUCER)));
	}

	@Test
	public void getCodelistByListName_shouldReturnNotFound_whenUnknownListName() throws Exception {
		String uri = "/codelist/UNKNOWN_LISTNAME";

		Exception exception = mvc.perform(get(uri))
				.andExpect(status().isNotFound())
				.andReturn().getResolvedException();

		assertThat(exception.getLocalizedMessage(), equalTo("Codelist with listName=UNKNOWN_LISTNAME does not exist"));
	}

	@Test
	public void getDescriptionByListNameAndCode_shouldReturnDescriptionForARBEIDSGIVER() throws Exception {
		String uri = "/codelist/PRODUCER/ARBEIDSGIVER";

		MockHttpServletResponse response = mvc.perform(get(uri))
				.andExpect(status().isOk())
				.andReturn().getResponse();

		assertThat(response.getContentAsString(), is("Arbeidsgiver"));
	}

	@Test
	public void getDescriptionByListNameAndCode_shouldReturnNotFound_whenUnknownCode() throws Exception {
		String uri = "/codelist/PRODUCER/UNKNOWN_CODE";

		Exception exception = mvc.perform(get(uri))
				.andExpect(status().isNotFound())
				.andReturn().getResolvedException();

		assertThat(exception.getLocalizedMessage(), equalTo("The code=UNKNOWN_CODE does not exist in the list=PRODUCER."));
	}

	@Test
	public void getDescriptionByListNameAndCode_shouldReturnNotFound_whenUnknownListName() throws Exception {
		String uri = "/codelist/UNKNOWN_LISTNAME/IRRELEVANT_CODE";

		Exception exception = mvc.perform(get(uri))
				.andExpect(status().isNotFound())
				.andReturn().getResolvedException();

		assertThat(exception.getLocalizedMessage(), equalTo("Codelist with listName=UNKNOWN_LISTNAME does not exist"));
	}

	@Test
	public void save_shouldSaveNewCodelist_whenRequestIsValid() throws Exception {
		int currentProducerListSize = codelists.get(ListName.PRODUCER).size();

		CodelistRequest request = CodelistRequest.builder()
				.list(ListName.PRODUCER)
				.code("TEST")
				.description("Test save")
				.build();
		String inputJson = objectMapper.writeValueAsString(List.of(request));

		MockHttpServletResponse response = mvc.perform(post("/codelist")
						.contentType(MediaType.APPLICATION_JSON_UTF8_VALUE)
						.content(inputJson))
				.andExpect(status().isCreated())
				.andReturn().getResponse();

		assertThat(codelists.get(ListName.PRODUCER).size(), is(currentProducerListSize + 1));
		assertThat(codelists.get(request.getList()).get(request.getCode()), is(request.getDescription()));
	}

	@Test
	public void save_shouldChangeCodeAndDescriptionInRequestToCorrectFormat() throws Exception {
		CodelistRequest request = CodelistRequest.builder()
				.list(ListName.SYSTEM)
				.code("    wEirdFOrmat        ")
				.description("   Trimmed description   ")
				.build();
		String inputJson = objectMapper.writeValueAsString(List.of(request));

		MockHttpServletResponse response = mvc.perform(
				post("/codelist")
						.contentType(MediaType.APPLICATION_JSON_UTF8_VALUE)
						.content(inputJson))
				.andReturn().getResponse();

		assertThat(response.getStatus(), is(HttpStatus.CREATED.value()));
		assertNull(codelists.get(request.getList()).get(request.getCode()));
		assertTrue(codelists.get(request.getList()).containsKey("WEIRDFORMAT"));
		assertTrue(codelists.get(request.getList()).containsValue("Trimmed description"));

	}

	@Test
	public void save_shouldSave10Codelists() throws Exception {
		int currentProducerListSize = codelists.get(ListName.PRODUCER).size();

		List<CodelistRequest> requests = IntStream.rangeClosed(1, 10)
				.mapToObj(i -> CodelistRequest.builder()
						.list(ListName.PRODUCER)
						.code("CODE_nr:" + i)
						.description("Description")
						.build())
				.collect(Collectors.toList());

		String inputJson = objectMapper.writeValueAsString(requests);

		MockHttpServletResponse response = mvc.perform(post("/codelist")
				.contentType(MediaType.APPLICATION_JSON_UTF8_VALUE)
				.content(inputJson))
				.andReturn().getResponse();

		assertThat(response.getStatus(), is(HttpStatus.CREATED.value()));
		assertThat(codelists.get(ListName.PRODUCER).size(), is(currentProducerListSize + 10));
	}

	@Test
	public void save_shouldReturnBadRequest_withEmptyListOfRequests() throws Exception {
		String errorMessage = "The request was not accepted because it is empty";

		String inputJson = objectMapper.writeValueAsString(Collections.emptyList());

		Exception exception = mvc.perform(post("/codelist").contentType(MediaType.APPLICATION_JSON_UTF8_VALUE)
				.content(inputJson))
				.andExpect(status().isBadRequest())
				.andReturn().getResolvedException();

		assertTrue(exception.getLocalizedMessage().contains(errorMessage));
	}

	@Test
	public void save_shouldReturnBadRequest_whenRequestHasEmptyValues() throws Exception {
		String errorMessage = "Request:1={code=The code was null or missing, description=The description was null or missing, list=The codelist must have a listName}";

		CodelistRequest request = CodelistRequest.builder().build();
		String inputJson = objectMapper.writeValueAsString(List.of(request));

		Exception exception = mvc.perform(post("/codelist").contentType(MediaType.APPLICATION_JSON_UTF8_VALUE)
				.content(inputJson))
				.andExpect(status().isBadRequest())
				.andReturn().getResolvedException();

		assertTrue(exception.getLocalizedMessage().contains(errorMessage));
	}

	@Test
	public void update_shouldUpdateCodelist() throws Exception {
		CodelistRequest request = CodelistRequest.builder()
				.list(ListName.SYSTEM)
				.code("TO_UPDATE")
				.description("Original despription")
				.build();
		codelists.get(request.getList()).put(request.getCode(), request.getDescription());

		CodelistRequest updateRequest = CodelistRequest.builder()
				.list(ListName.SYSTEM)
				.code("TO_UPDATE")
				.description("Updated description")
				.build();
		String inputJson = objectMapper.writeValueAsString(List.of(updateRequest));
		when(repository.findByListAndCode(any(ListName.class), anyString())).thenReturn(Optional.of(updateRequest.convert()));

		MockHttpServletResponse response = mvc.perform(
				MockMvcRequestBuilders.put("/codelist")
						.contentType(MediaType.APPLICATION_JSON_UTF8_VALUE)
						.content(inputJson))
				.andReturn().getResponse();

		assertThat(response.getStatus(), is(HttpStatus.ACCEPTED.value()));
		assertThat(codelists.get(ListName.SYSTEM).get("TO_UPDATE"), is("Updated description"));
	}

	@Test
	public void update_shouldReturnBadRequest_withEmptyListOfRequests() throws Exception {
		String errorMessage = "The request was not accepted because it is empty";

		String inputJson = objectMapper.writeValueAsString(Collections.emptyList());

		Exception exception = mvc.perform(
				MockMvcRequestBuilders.put("/codelist")
						.contentType(MediaType.APPLICATION_JSON_UTF8_VALUE)
						.content(inputJson))
				.andExpect(status().isBadRequest())
				.andReturn().getResolvedException();

		assertTrue(exception.getLocalizedMessage().contains(errorMessage));
	}

	@Test
	public void update_shouldReturnBadRequest_whenRequestHasEmptyValues() throws Exception {
		String errorMessage = "Request:1={code=The code was null or missing, description=The description was null or missing, list=The codelist must have a listName}";

		CodelistRequest request = CodelistRequest.builder().build();
		String inputJson = objectMapper.writeValueAsString(List.of(request));

		Exception exception = mvc.perform(
				MockMvcRequestBuilders.put("/codelist")
						.contentType(MediaType.APPLICATION_JSON_UTF8_VALUE)
						.content(inputJson))
				.andExpect(status().isBadRequest())
				.andReturn().getResolvedException();

		assertTrue(exception.getLocalizedMessage().contains(errorMessage));
	}

	@Test
	public void delete_shouldDeleteCodelistItem() throws Exception {
		String code = "TEST_DELETE";
		String description = "Test delete";
		String uri = "/codelist/PRODUCER/TEST_DELETE";
		CodelistRequest deleteRequest = CodelistRequest.builder()
				.list(ListName.PRODUCER)
				.code(code)
				.description(description)
				.build();

		codelists.get(ListName.PRODUCER).put(code, description);
		when(repository.findByListAndCode(any(ListName.class), anyString())).thenReturn(Optional.of(deleteRequest.convert()));

		MockHttpServletResponse response = mvc.perform(
				MockMvcRequestBuilders.delete(uri))
				.andReturn().getResponse();

		assertThat(response.getStatus(), is(HttpStatus.OK.value()));
		assertNull(codelists.get(ListName.PRODUCER).get(code));
	}

	@Test
	public void delete_shouldDelete_withoutCorrectFormat() throws Exception {
		String code = "TEST_DELETE";
		String description = "Delete description";
		CodelistRequest saveRequest = CodelistRequest.builder()
				.list(ListName.PRODUCER)
				.code(code)
				.description(description)
				.build();

		String inputJson = objectMapper.writeValueAsString(List.of(saveRequest));

		mvc.perform(post("/codelist")
				.contentType(MediaType.APPLICATION_JSON_UTF8_VALUE)
				.content(inputJson))
				.andExpect(status().isCreated());


		when(repository.findByListAndCode(any(ListName.class), anyString())).thenReturn(Optional.of(saveRequest.convert()));
		String uriThatNeedsFormatChanges = "/codelist/producer/test_DELETE";

		MockHttpServletResponse response = mvc.perform(
				MockMvcRequestBuilders.delete(uriThatNeedsFormatChanges))
				.andReturn().getResponse();

		assertThat(response.getStatus(), is(HttpStatus.OK.value()));
		assertNull(codelists.get(ListName.PRODUCER).get(code));
	}
}