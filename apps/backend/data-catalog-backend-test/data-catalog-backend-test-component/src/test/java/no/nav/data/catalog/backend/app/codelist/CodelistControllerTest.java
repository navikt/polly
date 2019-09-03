package no.nav.data.catalog.backend.app.codelist;

import com.fasterxml.jackson.databind.ObjectMapper;
import no.nav.data.catalog.backend.app.AppStarter;
import no.nav.data.catalog.backend.app.common.exceptions.CodelistNotFoundException;
import no.nav.data.catalog.backend.app.common.utils.JsonUtils;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.mockito.AdditionalAnswers;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(CodelistController.class)
@ContextConfiguration(classes = AppStarter.class)
@WebAppConfiguration
@ActiveProfiles("test")
public class CodelistControllerTest {

    private final ObjectMapper objectMapper = JsonUtils.getObjectMapper();

    @Autowired
    private MockMvc mvc;

    @MockBean
    private CodelistService service;

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    @Before
    public void setUp() {
        CodelistStub.initializeCodelist();
    }

    @Test
    public void findAll_shouldReturnTheInitiatedCodelist() throws Exception {
        MockHttpServletResponse response = mvc.perform(get("/codelist"))
                .andReturn().getResponse();

        HashMap<String, HashMap<String, String>> returnedCodelist = objectMapper.readValue(response.getContentAsString(), HashMap.class);

        assertThat(response.getStatus(), is(HttpStatus.OK.value()));
        assertThat(returnedCodelist.size(), is(CodelistService.codelists.size()));
        assertThat(returnedCodelist.get("PRODUCER").size(), is(3));
        assertThat(returnedCodelist.get("CATEGORY").size(), is(3));
        assertThat(returnedCodelist.get("SYSTEM").size(), is(2));
    }

    @Test
    public void getCodelistByListName_shouldReturnCodelistForProducer() throws Exception {
        String uri = "/codelist/PRODUCER";

        MockHttpServletResponse response = mvc.perform(get(uri))
                .andExpect(status().isOk())
                .andReturn().getResponse();

        Map mappedResponse = objectMapper.readValue(response.getContentAsString(), HashMap.class);
        assertThat(mappedResponse, is(CodelistService.codelists.get(ListName.PRODUCER)));
    }

    @Test
    public void getCodelistByListName_shouldReturnNotFound_whenUnknownListName() throws Exception {
        String uri = "/codelist/UNKNOWN_LISTNAME";
        doThrow(new CodelistNotFoundException("Codelist with listName=UNKNOWN_LISTNAME does not exist"))
                .when(service).validateListNameExists(anyString());

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
        doThrow(new CodelistNotFoundException("The code=UNKNOWN_CODE does not exist in the list=PRODUCER."))
                .when(service).validateListNameAndCodeExists(anyString(), anyString());

        Exception exception = mvc.perform(get(uri))
                .andExpect(status().isNotFound())
                .andReturn().getResolvedException();

        assertThat(exception.getLocalizedMessage(), equalTo("The code=UNKNOWN_CODE does not exist in the list=PRODUCER."));
    }

    @Test
    public void save_shouldSave10Codelists() throws Exception {
        when(service.save(ArgumentMatchers.anyList())).thenAnswer(AdditionalAnswers.returnsFirstArg());

        List<CodelistRequest> requests = IntStream.rangeClosed(1, 10)
                .mapToObj(i -> CodelistRequest.builder()
                        .list("PRODUCER")
                        .code("CODE_nr:" + i)
                        .description("Description")
                        .build())
                .collect(Collectors.toList());

        String inputJson = objectMapper.writeValueAsString(requests);

        mvc.perform(post("/codelist")
                .contentType(MediaType.APPLICATION_JSON_UTF8_VALUE)
                .content(inputJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.length()", is(10)));
    }

    @Test
    public void update_shouldUpdateCodelist() throws Exception {
        when(service.update(ArgumentMatchers.anyList())).thenAnswer(AdditionalAnswers.returnsFirstArg());

        List<CodelistRequest> requests = IntStream.rangeClosed(1, 10)
                .mapToObj(i -> CodelistRequest.builder()
                        .list("PRODUCER")
                        .code("CODE_nr:" + i)
                        .description("Description")
                        .build())
                .collect(Collectors.toList());

        String inputJson = objectMapper.writeValueAsString(requests);

        mvc.perform(put("/codelist")
                .contentType(MediaType.APPLICATION_JSON_UTF8_VALUE)
                .content(inputJson))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.length()", is(10)));
    }

    @Test
    public void delete_shouldDeleteCodelistItem() throws Exception {
        String code = "TEST_DELETE";
        String uri = "/codelist/PRODUCER/TEST_DELETE";
        MockHttpServletResponse response = mvc.perform(
                delete(uri))
                .andReturn().getResponse();

        assertThat(response.getStatus(), is(HttpStatus.OK.value()));
        verify(service).delete(ListName.PRODUCER, code);
    }

    @Test
    public void delete_shouldDelete_withoutCorrectFormat() throws Exception {
        String code = "TEST_DELETE";

        MockHttpServletResponse response = mvc.perform(
                delete("/codelist/producer/test_DELETE"))
                .andReturn().getResponse();

        assertThat(response.getStatus(), is(HttpStatus.OK.value()));
        verify(service).delete(ListName.PRODUCER, code);
    }
}