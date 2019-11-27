package no.nav.data.polly.codelist;

import no.nav.data.polly.AppStarter;
import no.nav.data.polly.codelist.domain.Codelist;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.AllCodelistResponse;
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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static no.nav.data.polly.codelist.CodelistUtils.createCodelist;
import static no.nav.data.polly.codelist.CodelistUtils.createCodelistRequest;
import static no.nav.data.polly.common.utils.StreamUtils.collectInList;
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
    void findAllLegacy_shouldReturnTheInitiatedCodelist() throws Exception {
        MockHttpServletResponse response = mvc.perform(get("/codelist/legacy"))
                .andReturn().getResponse();

        @SuppressWarnings("unchecked")
        HashMap<String, HashMap<String, String>> returnedCodelist = JsonUtils.toObject(response.getContentAsString(), HashMap.class);

        assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
        assertThat(returnedCodelist.size()).isEqualTo(ListName.values().length);
        assertThat(returnedCodelist.get("SOURCE").size()).isEqualTo(CodelistService.getCodelist(ListName.SOURCE).size());
        assertThat(returnedCodelist.get("CATEGORY").size()).isEqualTo(CodelistService.getCodelist(ListName.CATEGORY).size());
    }

    @Test
    void findAll() throws Exception {
        MockHttpServletResponse response = mvc.perform(get("/codelist"))
                .andReturn().getResponse();

        AllCodelistResponse returnedCodelist = JsonUtils.toObject(response.getContentAsString(), AllCodelistResponse.class);

        assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
        assertThat(returnedCodelist.getCodelist().size()).isEqualTo(ListName.values().length);
        assertThat(returnedCodelist.getCodelist().get(ListName.SOURCE).size()).isEqualTo(CodelistService.getCodelist(ListName.SOURCE).size());
        assertThat(returnedCodelist.getCodelist().get(ListName.CATEGORY).size()).isEqualTo(CodelistService.getCodelist(ListName.CATEGORY).size());
    }

    @Test
    void getCodelistByListName_shouldReturnCodelistForProducer() throws Exception {
        String uri = "/codelist/SOURCE";

        MockHttpServletResponse response = mvc.perform(get(uri))
                .andExpect(status().isOk())
                .andReturn().getResponse();

        @SuppressWarnings("unchecked")
        List<Map> mappedResponse = JsonUtils.toObject(response.getContentAsString(), ArrayList.class);
        assertThat(mappedResponse).hasSize(CodelistService.getCodelist(ListName.SOURCE).size());
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
    void getByListNameAndCode_shouldReturnForARBEIDSGIVER() throws Exception {
        String uri = "/codelist/SOURCE/ARBEIDSGIVER";

        MockHttpServletResponse response = mvc.perform(get(uri))
                .andExpect(status().isOk())
                .andReturn().getResponse();

        assertThat(response.getContentAsString()).isEqualTo(JsonUtils.toJson(CodelistService.getCodelistResponse(ListName.SOURCE, "ARBEIDSGIVER")));
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
        List<Codelist> codelists = collectInList(createCodelist(ListName.SOURCE, "ARBEIDSGIVER"), createCodelist(ListName.SOURCE, "BRUKER"));
        when(service.save(anyList())).thenReturn(codelists);

        List<CodelistRequest> requests = collectInList(createCodelistRequest("SOURCE", "ARBEIDSGIVER"), createCodelistRequest("SOURCE", "BRUKER"));
        String inputJson = JsonUtils.toJson(requests);

        mvc.perform(post("/codelist")
                .contentType(MediaType.APPLICATION_JSON)
                .content(inputJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.length()").value(2));
        verify(service).save(requests);
    }

    @Test
    void update_shouldUpdateCodelist() throws Exception {
        List<Codelist> codelists = collectInList(createCodelist(ListName.SOURCE, "ARBEIDSGIVER"), createCodelist(ListName.SOURCE, "BRUKER"));
        when(service.update(anyList())).thenReturn(codelists);

        List<CodelistRequest> requests = collectInList(createCodelistRequest("SOURCE", "ARBEIDSGIVER"), createCodelistRequest("SOURCE", "BRUKER"));
        String inputJson = JsonUtils.toJson(requests);

        mvc.perform(put("/codelist")
                .contentType(MediaType.APPLICATION_JSON)
                .content(inputJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
        verify(service).update(requests);
    }

    @Test
    void delete_shouldDeleteCodelistItem() throws Exception {
        MockHttpServletResponse response = mvc.perform(delete("/codelist/SOURCE/TEST_DELETE")).andReturn().getResponse();

        assertThat(response.getStatus()).isEqualTo((HttpStatus.OK.value()));
        verify(service).delete(ListName.SOURCE, "TEST_DELETE");
    }

    @Test
    void delete_shouldDelete_withoutCorrectFormat() throws Exception {
        MockHttpServletResponse response = mvc.perform(
                delete("/codelist/source/test_delete"))
                .andReturn().getResponse();

        assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
        verify(service).delete(ListName.SOURCE, "TEST_DELETE");
    }
}