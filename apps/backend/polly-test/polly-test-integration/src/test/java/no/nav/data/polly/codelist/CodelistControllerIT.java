package no.nav.data.polly.codelist;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.codelist.domain.Codelist;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.AllCodelistResponse;
import no.nav.data.polly.codelist.dto.CodelistRequest;
import no.nav.data.polly.codelist.dto.CodelistResponse;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static no.nav.data.polly.codelist.CodelistUtils.createCodelist;
import static no.nav.data.polly.codelist.CodelistUtils.createCodelistRequest;
import static no.nav.data.polly.codelist.CodelistUtils.createListOfRequests;
import static no.nav.data.polly.codelist.CodelistUtils.createNrOfCodelistRequests;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CodelistControllerIT extends IntegrationTestBase {

    private static final ParameterizedTypeReference<List<CodelistResponse>> RESPONSE_TYPE = new ParameterizedTypeReference<>() {
    };
    public static final String ERROR_IMMUTABLE_CODELIST = "%s is an immutable type of codelist. For amendments, please contact team #dataplatform";

    @Autowired
    protected TestRestTemplate restTemplate;

    @Autowired
    private CodelistService service;

    @Autowired
    private CodelistRepository repository;

    @BeforeEach
    void setUp() {
        service.refreshCache();
    }

    @AfterEach
    void cleanUp() {
        repository.deleteAll();
    }

    @Test
    void findAll_shouldReturnAllCodelists() {
        CodelistStub.initializeCodelist();
        ResponseEntity<AllCodelistResponse> responseEntity = restTemplate.exchange(
                "/codelist", HttpMethod.GET, HttpEntity.EMPTY, AllCodelistResponse.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isNotNull();
        assertThat(responseEntity.getBody().getCodelist().size()).isEqualTo(ListName.values().length);

        Arrays.stream(ListName.values())
                .forEach(listName -> assertThat(responseEntity.getBody().getCodelist()
                        .get(listName)).isEqualTo(CodelistService.getCodelistResponseList(listName)));
    }

    @Test
    void getCodelistByListName() {
        CodelistStub.initializeCodelist();

        ResponseEntity<List<CodelistResponse>> responseEntity = restTemplate.exchange(
                "/codelist/SOURCE", HttpMethod.GET, HttpEntity.EMPTY, RESPONSE_TYPE);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isNotNull();
        assertThat(responseEntity.getBody()).isEqualTo(CodelistService.getCodelistResponseList(ListName.SOURCE));
    }

    @Test
    void getByListNameAndCode() {
        CodelistCache.set(createCodelist(ListName.SOURCE, "TEST_CODE"));

        ResponseEntity<CodelistResponse> responseEntity = restTemplate.exchange(
                "/codelist/SOURCE/TEST_CODE", HttpMethod.GET, HttpEntity.EMPTY, CodelistResponse.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isNotNull();
        assertThat(responseEntity.getBody().getDescription()).isEqualTo(CodelistService.getCodelist(ListName.SOURCE, "TEST_CODE").getDescription());
    }

    @Test
    void save_shouldSaveNewCodelist() {
        List<CodelistRequest> requests = createListOfRequests(createCodelistRequest("SOURCE", "SaveCode", "SaveShortName", "SaveDescription"));
        assertFalse(CodelistCache.contains(ListName.SOURCE, "SaveCode"));

        ResponseEntity<List<CodelistResponse>> responseEntity = restTemplate.exchange(
                "/codelist", HttpMethod.POST, new HttpEntity<>(requests), RESPONSE_TYPE);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        CodelistResponse codelist = responseEntity.getBody().get(0);
        assertThat(codelist.getList()).isEqualTo(ListName.SOURCE);
        assertThat(codelist.getCode()).isEqualTo("SAVECODE");
        assertThat(codelist.getShortName()).isEqualTo("SaveShortName");
        assertThat(codelist.getDescription()).isEqualTo("SaveDescription");

        assertTrue(CodelistCache.contains(ListName.SOURCE, "SAVECODE"));
        Codelist savedCodelist = CodelistService.getCodelist(ListName.SOURCE, "SAVECODE");
        assertThat(savedCodelist.getCode()).isEqualTo("SAVECODE");
        assertThat(savedCodelist.getShortName()).isEqualTo("SaveShortName");
        assertThat(savedCodelist.getDescription()).isEqualTo("SaveDescription");
    }

    @Test
    void save_shouldInvalidateWrongListname() {
        List<CodelistRequest> requests = createListOfRequests(createCodelistRequest("PROVENAANCE", "SaveCode"));

        ResponseEntity<String> responseEntity = restTemplate.exchange(
                "/codelist", HttpMethod.POST, new HttpEntity<>(requests), String.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(responseEntity.getBody()).contains("PROVENAANCE was invalid for type ListName");
    }

    @ParameterizedTest
    @ValueSource(strings = {"GDPR_ARTICLE", "SENSITIVITY"})
    void save_shouldInvalidateCreatingImmutableCodelist(String testValue) {
        List<CodelistRequest> requests = createListOfRequests(createCodelistRequest(testValue));

        ResponseEntity<String> responseEntity = restTemplate.exchange("/codelist", HttpMethod.POST, new HttpEntity<>(requests), String.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(responseEntity.getBody()).contains(String.format(ERROR_IMMUTABLE_CODELIST, testValue));
    }

    @ParameterizedTest
    @ValueSource(strings = {"GDPR_ARTICLE", "SENSITIVITY"})
    void update_shouldInvalidateUpdatingGDPR_ARTICLE(String testValue) {
        saveCodelist(createCodelist(ListName.valueOf(testValue)));
        List<CodelistRequest> requests = createListOfRequests(createCodelistRequest(testValue));

        ResponseEntity<String> responseEntity = restTemplate.exchange("/codelist", HttpMethod.PUT, new HttpEntity<>(requests), String.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(responseEntity.getBody()).contains(String.format(ERROR_IMMUTABLE_CODELIST, testValue));
    }

    @ParameterizedTest
    @ValueSource(strings = {"GDPR_ARTICLE", "SENSITIVITY"})
    void delete_shouldInvalidateDeletingGDPR_ARTICLE(String testValue) {
        saveCodelist(createCodelist(ListName.valueOf(testValue), "DELETE"));
        String url = String.format("/codelist/%s/DELETE", testValue);
        ResponseEntity<String> responseEntity = restTemplate.exchange(url, HttpMethod.DELETE, HttpEntity.EMPTY, String.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(responseEntity.getBody()).contains(String.format(ERROR_IMMUTABLE_CODELIST, testValue));
    }

    @Test
    void save_shouldSave20Codelist() {
        List<CodelistRequest> requests = createNrOfCodelistRequests(20);

        ResponseEntity<List<CodelistResponse>> responseEntity = restTemplate.exchange(
                "/codelist", HttpMethod.POST, new HttpEntity<>(requests), RESPONSE_TYPE);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(CodelistService.getCodelist(ListName.SOURCE).size()).isEqualTo(20);
    }

    @Test
    void update_shouldUpdateOneCodelist() {
        saveCodelist(createCodelist(ListName.SOURCE, "CODE", "SavedShortName", "SavedDescription"));
        assertThat(CodelistService.getCodelist(ListName.SOURCE, "CODE").getShortName()).isEqualTo("SavedShortName");
        assertThat(CodelistService.getCodelist(ListName.SOURCE, "CODE").getDescription()).isEqualTo("SavedDescription");

        List<CodelistRequest> updatedCodelists = createListOfRequests(
                createCodelistRequest("SOURCE", "CODE", "UpdatedShortName", "UpdatedDescription"));

        ResponseEntity<String> responseEntity = restTemplate.exchange(
                "/codelist", HttpMethod.PUT, new HttpEntity<>(updatedCodelists), String.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(CodelistService.getCodelist(ListName.SOURCE, "CODE").getShortName()).isEqualTo("UpdatedShortName");
        assertThat(CodelistService.getCodelist(ListName.SOURCE, "CODE").getDescription()).isEqualTo("UpdatedDescription");
    }

    @Test
    void update_shouldUpdate20Codelists() {
        List<CodelistRequest> requests = createNrOfCodelistRequests(20);
        restTemplate.exchange(
                "/codelist", HttpMethod.POST, new HttpEntity<>(requests), new ParameterizedTypeReference<List<Codelist>>() {
                });

        requests.forEach(request -> {
            request.setShortName("UpdatedShortName");
            request.setDescription("UpdatedDescription");
        });

        ResponseEntity<List<Codelist>> responseEntity = restTemplate.exchange(
                "/codelist", HttpMethod.PUT, new HttpEntity<>(requests), new ParameterizedTypeReference<>() {
                });

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);

        assertThat(CodelistService.getCodelist(ListName.SOURCE).size()).isEqualTo(20);
        List<Codelist> list = CodelistService.getCodelist(ListName.SOURCE);
        list.forEach(cod -> {
            assertThat(cod.getShortName()).isEqualTo("UpdatedShortName");
            assertThat(cod.getDescription()).isEqualTo("UpdatedDescription");
        });
    }

    @Test
    void delete_shouldDeleteCodelist() {
        saveCodelist(createCodelist(ListName.SOURCE, "DELETE_CODE"));
        assertTrue(repository.findByListAndCode(ListName.SOURCE, "DELETE_CODE").isPresent());

        ResponseEntity<String> responseEntity = restTemplate.exchange("/codelist/SOURCE/DELETE_CODE", HttpMethod.DELETE, HttpEntity.EMPTY, String.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertFalse(repository.findByListAndCode(ListName.SOURCE, "DELETE_CODE").isPresent());
    }

    private void saveCodelist(Codelist codelist) {
        CodelistCache.set(codelist);
        repository.save(codelist);
    }


}
