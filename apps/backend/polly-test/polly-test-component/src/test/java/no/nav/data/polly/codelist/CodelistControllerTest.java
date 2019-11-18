package no.nav.data.polly.codelist;

import no.nav.data.polly.AppStarter;
import no.nav.data.polly.codelist.domain.Codelist;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodelistRequest;
import no.nav.data.polly.common.exceptions.CodelistNotFoundException;
import no.nav.data.polly.common.utils.JsonUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyList;
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

@ExtendWith(SpringExtension.class)
@WebMvcTest(CodelistController.class)
@ContextConfiguration(classes = AppStarter.class)
@WebAppConfiguration
@ActiveProfiles("test")
class CodelistControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockBean
    private CodelistService service;

    @BeforeEach
    void setUp() {
        CodelistStub.initializeCodelist();
    }

    @Test
    void findAll_shouldReturnTheInitiatedCodelist() throws Exception {
        MockHttpServletResponse response = mvc.perform(get("/codelist"))
                .andReturn().getResponse();

        HashMap<String, HashMap<String, String>> returnedCodelist = JsonUtils.toObject(response.getContentAsString(), HashMap.class);

        assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
        assertThat(returnedCodelist.size()).isEqualTo(ListName.values().length);
        assertThat(returnedCodelist.get("SOURCE").size()).isEqualTo(CodelistCache.getAsMap(ListName.SOURCE).size());
        assertThat(returnedCodelist.get("CATEGORY").size()).isEqualTo(CodelistCache.getAsMap(ListName.CATEGORY).size());
    }

    @Test
    void getCodelistByListName_shouldReturnCodelistForProducer() throws Exception {
        String uri = "/codelist/SOURCE";

        MockHttpServletResponse response = mvc.perform(get(uri))
                .andExpect(status().isOk())
                .andReturn().getResponse();

        Map mappedResponse = JsonUtils.toObject(response.getContentAsString(), HashMap.class);
        assertThat(mappedResponse).isEqualTo(CodelistCache.getAsMap(ListName.SOURCE));
    }

    @Test
    void getCodelistByListName_shouldReturnNotFound_whenUnknownListName() throws Exception {
        String uri = "/codelist/UNKNOWN_LISTNAME";
        doThrow(new CodelistNotFoundException("Codelist with listName=UNKNOWN_LISTNAME does not exist"))
                .when(service).validateListNameExists(anyString());

        Exception exception = mvc.perform(get(uri))
                .andExpect(status().isNotFound())
                .andReturn().getResolvedException();

        assertThat(exception.getLocalizedMessage()).isEqualTo("Codelist with listName=UNKNOWN_LISTNAME does not exist");
    }

    @Test
    void getDescriptionByListNameAndCode_shouldReturnDescriptionForARBEIDSGIVER() throws Exception {
        String uri = "/codelist/SOURCE/ARBEIDSGIVER";

        MockHttpServletResponse response = mvc.perform(get(uri))
                .andExpect(status().isOk())
                .andReturn().getResponse();

        assertThat(response.getContentAsString()).isEqualTo("Arbeidsgiver");
    }

    @Test
    void getDescriptionByListNameAndCode_shouldReturnNotFound_whenUnknownCode() throws Exception {
        String uri = "/codelist/SOURCE/UNKNOWN_CODE";
        doThrow(new CodelistNotFoundException("The code=UNKNOWN_CODE does not exist in the list=SOURCE."))
                .when(service).validateListNameAndCodeExists(anyString(), anyString());

        Exception exception = mvc.perform(get(uri))
                .andExpect(status().isNotFound())
                .andReturn().getResolvedException();

        assertThat(exception.getLocalizedMessage()).isEqualTo("The code=UNKNOWN_CODE does not exist in the list=SOURCE.");
    }

    @Test
    void save_shouldSaveMultipleCodelists() throws Exception {
        List<Codelist> codelists = List.of(CodelistService.getCodelist(ListName.SOURCE, "ARBEIDSGIVER"), CodelistService.getCodelist(ListName.SOURCE, "BRUKER"));
        when(service.save(anyList())).thenReturn(codelists);

        List<CodelistRequest> requests = IntStream.rangeClosed(1, 10)
                .mapToObj(i -> CodelistRequest.builder()
                        .list("SOURCE")
                        .code("CODE_nr:" + i)
                        .description("Description")
                        .build())
                .collect(Collectors.toList());

        String inputJson = JsonUtils.toJson(requests);

        mvc.perform(post("/codelist")
                .contentType(MediaType.APPLICATION_JSON_UTF8_VALUE)
                .content(inputJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void update_shouldUpdateCodelist() throws Exception {
        List<Codelist> codelists = List.of(CodelistService.getCodelist(ListName.SOURCE, "ARBEIDSGIVER"), CodelistService.getCodelist(ListName.SOURCE, "BRUKER"));
        when(service.update(anyList())).thenReturn(codelists);

        List<CodelistRequest> requests = IntStream.rangeClosed(1, 10)
                .mapToObj(i -> CodelistRequest.builder()
                        .list("SOURCE")
                        .code("CODE_nr:" + i)
                        .description("Description")
                        .build())
                .collect(Collectors.toList());

        String inputJson = JsonUtils.toJson(requests);

        mvc.perform(put("/codelist")
                .contentType(MediaType.APPLICATION_JSON_UTF8_VALUE)
                .content(inputJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void delete_shouldDeleteCodelistItem() throws Exception {
        String code = "TEST_DELETE";
        String uri = "/codelist/SOURCE/TEST_DELETE";
        MockHttpServletResponse response = mvc.perform(
                delete(uri))
                .andReturn().getResponse();

        assertThat(response.getStatus()).isEqualTo((HttpStatus.OK.value()));
        verify(service).delete(ListName.SOURCE, code);
    }

    @Test
    void delete_shouldDelete_withoutCorrectFormat() throws Exception {
        String code = "TEST_DELETE";

        MockHttpServletResponse response = mvc.perform(
                delete("/codelist/SOURCE/test_DELETE"))
                .andReturn().getResponse();

        assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
        verify(service).delete(ListName.SOURCE, code);
    }
}