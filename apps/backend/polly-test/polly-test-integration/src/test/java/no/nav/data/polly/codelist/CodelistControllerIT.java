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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CodelistControllerIT extends IntegrationTestBase {

    private static final ParameterizedTypeReference<List<CodelistResponse>> RESPONSE_TYPE = new ParameterizedTypeReference<>() {
    };
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
        String url = "/codelist/SOURCE";

        ResponseEntity<List<CodelistResponse>> responseEntity = restTemplate.exchange(
                url, HttpMethod.GET, HttpEntity.EMPTY, RESPONSE_TYPE);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isNotNull();
        assertThat(responseEntity.getBody()).isEqualTo(CodelistService.getCodelistResponseList(ListName.SOURCE));
    }

    @Test
    void getByListNameAndCode() {
        CodelistCache.set(createOneRequest("SOURCE", "TEST_CODE", "desc").convert());
        String url = "/codelist/SOURCE/TEST_CODE";

        ResponseEntity<CodelistResponse> responseEntity = restTemplate.exchange(
                url, HttpMethod.GET, HttpEntity.EMPTY, CodelistResponse.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isNotNull();
        assertThat(responseEntity.getBody().getDescription()).isEqualTo(CodelistService.getCodelist(ListName.SOURCE, "TEST_CODE").getDescription());
    }

    @Test
    void save_shouldSaveNewCodelist() {
        String code = "SaveCode";
        String description = "Test description";
        List<CodelistRequest> requests = createRequest("SOURCE", code, description);
        assertFalse(CodelistCache.contains(ListName.SOURCE, code));

        ResponseEntity<List<CodelistResponse>> responseEntity = restTemplate.exchange(
                "/codelist", HttpMethod.POST, new HttpEntity<>(requests), RESPONSE_TYPE);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        CodelistResponse codelist = responseEntity.getBody().get(0);
        assertThat(codelist.getDescription()).isEqualTo(description);
        assertThat(codelist.getCode()).isEqualTo("SAVECODE");

        assertTrue(CodelistCache.contains(ListName.SOURCE, "SAVECODE"));
        Codelist savecode = CodelistService.getCodelist(ListName.SOURCE, "SAVECODE");
        assertThat(savecode.getCode()).isEqualTo("SAVECODE");
        assertThat(savecode.getShortName()).isEqualTo("SaveCode name");
        assertThat(savecode.getDescription()).isEqualTo(description);
    }

    @Test
    void save_shouldInvalidateWrongListname() {
        List<CodelistRequest> requests = createRequest("PROVENAANCE", "SaveCode", "Test description");

        ResponseEntity<String> responseEntity = restTemplate.exchange(
                "/codelist", HttpMethod.POST, new HttpEntity<>(requests), String.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(responseEntity.getBody()).contains("PROVENAANCE was invalid for type ListName");
    }

    @Test
    void save_shouldSave20Codelist() {
        List<CodelistRequest> requests = createNrOfRequests("shouldSave20Codelists", 20);

        ResponseEntity<List<CodelistResponse>> responseEntity = restTemplate.exchange(
                "/codelist", HttpMethod.POST, new HttpEntity<>(requests), RESPONSE_TYPE);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(CodelistService.getCodelist(ListName.SOURCE).size()).isEqualTo(20);
    }

    @Test
    void update_shouldUpdateOneCodelist() {
        String code = "UPDATE_CODE";
        service.save(createRequest("SOURCE", code, "Test description"));

        List<CodelistRequest> updatedCodelists = createRequest("SOURCE", code, "Updated codelists");

        ResponseEntity<String> responseEntity = restTemplate.exchange(
                "/codelist", HttpMethod.PUT, new HttpEntity<>(updatedCodelists), String.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(CodelistService.getCodelist(ListName.SOURCE, code).getDescription()).isEqualTo(updatedCodelists.get(0).getDescription());
    }

    @Test
    void update_shouldUpdate20Codelists() {
        List<CodelistRequest> requests = createNrOfRequests("shouldUpdate20Codelists", 20);
        restTemplate.exchange(
                "/codelist", HttpMethod.POST, new HttpEntity<>(requests), new ParameterizedTypeReference<List<Codelist>>() {
                });

        requests.forEach(request -> request.setDescription("  Updated codelists  "));
        ResponseEntity<List<Codelist>> responseEntity = restTemplate.exchange(
                "/codelist", HttpMethod.PUT, new HttpEntity<>(requests), new ParameterizedTypeReference<List<Codelist>>() {
                });

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);

        assertThat(CodelistService.getCodelist(ListName.SOURCE).size()).isEqualTo(20);
        List<Codelist> list = CodelistService.getCodelist(ListName.SOURCE);
        list.forEach(cod -> assertThat(cod.getDescription()).isEqualTo("Updated codelists"));
    }

    @Test
    void delete_shouldDeleteCodelist() {
        String code = "DELETE_CODE";
        List<CodelistRequest> requests = createRequest("SOURCE", code, "Test description");
        service.save(requests);
        assertNotNull(CodelistService.getCodelist(ListName.SOURCE, code).getDescription());

        String url = "/codelist/SOURCE/DELETE_CODE";

        ResponseEntity<String> responseEntity = restTemplate.exchange(url, HttpMethod.DELETE, HttpEntity.EMPTY, String.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertFalse(CodelistCache.contains(ListName.SOURCE, code));
    }

    private List<CodelistRequest> createNrOfRequests(String code, int nrOfRequests) {
        return IntStream.rangeClosed(1, nrOfRequests)
                .mapToObj(i -> createOneRequest("SOURCE", code + "_nr_" + i, "Test description"))
                .collect(Collectors.toList());

    }

    private CodelistRequest createOneRequest(String listName, String code, String description) {
        return CodelistRequest.builder()
                .list(listName)
                .code(code)
                .shortName(code + " name")
                .description(description)
                .build();
    }

    private List<CodelistRequest> createRequest(String listName, String code, String description) {
        return List.of(createOneRequest(listName, code, description));
    }

}
