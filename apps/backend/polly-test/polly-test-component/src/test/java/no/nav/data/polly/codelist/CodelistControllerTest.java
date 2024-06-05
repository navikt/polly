package no.nav.data.polly.codelist;

import no.nav.data.AppStarter;
import no.nav.data.common.exceptions.CodelistNotFoundException;
import no.nav.data.common.utils.JsonUtils;
import no.nav.data.polly.codelist.commoncode.CommonCodeService;
import no.nav.data.polly.codelist.domain.Codelist;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.AllCodelistResponse;
import no.nav.data.polly.codelist.dto.CodelistRequest;
import no.nav.data.polly.codelist.dto.CodelistRequestValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
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
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static no.nav.data.polly.codelist.CodelistUtils.createCodelist;
import static no.nav.data.polly.codelist.CodelistUtils.createCodelistRequest;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyList;
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
    private WebApplicationContext applicationContext;
    private MockMvc mvc;

    @MockBean
    private CodelistService service;
    @MockBean
    private CodelistRequestValidator requestValidator;
    @MockBean
    private CommonCodeService commonCodeService;

    @BeforeEach
    void setUp() {
        mvc = MockMvcBuilders.webAppContextSetup(applicationContext).build();
        CodelistStub.initializeCodelist();
    }

    @Nested
    class GetMethods {
        @Test
        void findAll() throws Exception {
            MockHttpServletResponse response = mvc.perform(get("/codelist")).andReturn().getResponse();

            AllCodelistResponse returnedCodelist = JsonUtils.toObject(response.getContentAsString(), AllCodelistResponse.class);

            assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
            assertThat(returnedCodelist.getCodelist().size()).isEqualTo(ListName.values().length);
            assertThat(returnedCodelist.getCodelist().get(ListName.THIRD_PARTY).size()).isEqualTo(CodelistService.getCodelist(ListName.THIRD_PARTY).size());
            assertThat(returnedCodelist.getCodelist().get(ListName.CATEGORY).size()).isEqualTo(CodelistService.getCodelist(ListName.CATEGORY).size());
        }

        @Test
        void getByListName_shouldReturnCodelist() throws Exception {
            String uri = "/codelist/THIRD_PARTY";

            MockHttpServletResponse response = mvc.perform(get(uri)).andExpect(status().isOk()).andReturn().getResponse();

            @SuppressWarnings("unchecked")
            List<Map<?, ?>> mappedResponse = JsonUtils.toObject(response.getContentAsString(), ArrayList.class);
            assertThat(mappedResponse).hasSize(CodelistService.getCodelist(ListName.THIRD_PARTY).size());
        }

        @Test
        void getByListNameAndCode_shouldReturnForARBEIDSGIVER() throws Exception {
            String uri = "/codelist/THIRD_PARTY/ARBEIDSGIVER";

            MockHttpServletResponse response = mvc.perform(get(uri))
                    .andExpect(status().isOk())
                    .andReturn().getResponse();

            assertThat(response.getContentAsString()).isEqualTo(JsonUtils.toJson(CodelistService.getCodelistResponse(ListName.THIRD_PARTY, "ARBEIDSGIVER")));
        }

        @Test
        void getByListName_shouldReturnNotFound_whenUnknownListName() throws Exception {
            String uri = "/codelist/UNKNOWN_LISTNAME";
            doThrow(new CodelistNotFoundException("Codelist with listName=UNKNOWN_LISTNAME does not exist"))
                    .when(requestValidator).validateListName("UNKNOWN_LISTNAME");

            Exception exception = mvc.perform(get(uri))
                    .andExpect(status().isNotFound())
                    .andReturn().getResolvedException();

            assertThat(exception.getLocalizedMessage()).isEqualTo("Codelist with listName=UNKNOWN_LISTNAME does not exist");
        }


        @Test
        void getByListNameAndCode_shouldReturnNotFound_whenUnknownCode() throws Exception {
            String uri = "/codelist/THIRD_PARTY/UNKNOWN_CODE";
            doThrow(new CodelistNotFoundException("The code=UNKNOWN_CODE does not exist in the list=THIRD_PARTY."))
                    .when(requestValidator).validateListNameAndCode("THIRD_PARTY", "UNKNOWN_CODE");

            Exception exception = mvc.perform(get(uri))
                    .andExpect(status().isNotFound())
                    .andReturn().getResolvedException();

            assertThat(exception.getLocalizedMessage()).isEqualTo("The code=UNKNOWN_CODE does not exist in the list=THIRD_PARTY.");
        }
    }

    @Nested
    class CrudMethods {

        @Test
        void save_shouldSaveMultipleCodelists() throws Exception {
            List<Codelist> codelists = List.of(createCodelist(ListName.THIRD_PARTY, "CODE1"), createCodelist(ListName.THIRD_PARTY, "CODE2"));
            when(service.save(anyList())).thenReturn(codelists);

            List<CodelistRequest> requests = List.of(createCodelistRequest("THIRD_PARTY", "CODE1"), createCodelistRequest("THIRD_PARTY", "CODE2"));
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
            List<Codelist> codelists = List.of(createCodelist(ListName.THIRD_PARTY, "CODE1"), createCodelist(ListName.THIRD_PARTY, "CODE2"));
            when(service.update(anyList())).thenReturn(codelists);

            List<CodelistRequest> requests = List.of(createCodelistRequest("THIRD_PARTY", "CODE1"), createCodelistRequest("THIRD_PARTY", "CODE2"));
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
            MockHttpServletResponse response = mvc.perform(delete("/codelist/THIRD_PARTY/TEST_DELETE")).andReturn().getResponse();

            assertThat(response.getStatus()).isEqualTo((HttpStatus.OK.value()));
            verify(service).delete(ListName.THIRD_PARTY, "TEST_DELETE");
        }

        @Test
        void delete_shouldDelete_withoutCorrectFormat() throws Exception {
            MockHttpServletResponse response = mvc.perform(
                    delete("/codelist/third_party/test_format"))
                    .andReturn().getResponse();

            assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
            verify(service).delete(ListName.THIRD_PARTY, "TEST_FORMAT");
        }
    }
}