package no.nav.data.polly.codelist;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.codelist.domain.Codelist;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodelistRequest;
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
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CodelistControllerIT extends IntegrationTestBase {

    private static final ParameterizedTypeReference<List<Codelist>> RESPONSE_TYPE = new ParameterizedTypeReference<>() {
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
        ResponseEntity<Map> responseEntity = restTemplate.exchange(
                "/codelist", HttpMethod.GET, HttpEntity.EMPTY, Map.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody().size()).isEqualTo(ListName.values().length);

        Arrays.stream(ListName.values())
                .forEach(listName -> assertThat(responseEntity.getBody()
                        .get(listName.toString())).isEqualTo(CodelistCache.getAsMap(listName)));
    }

    @Test
    void getCodelistByListName_shouldReturnCodesAndDescriptionForListName() {
        String url = "/codelist/SOURCE";

        ResponseEntity<Map> responseEntity = restTemplate.exchange(
                url, HttpMethod.GET, HttpEntity.EMPTY, Map.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isEqualTo(CodelistCache.getAsMap(ListName.SOURCE));
    }

    @Test
    void getDescriptionByListNameAndCode_shouldReturnDescriptionForCodeAndListName() {
        CodelistCache.set(Codelist.builder().list(ListName.SOURCE).code("TEST_CODE").description("Test description").build());
        String url = "/codelist/SOURCE/TEST_CODE";

        ResponseEntity<String> responseEntity = restTemplate.exchange(
                url, HttpMethod.GET, HttpEntity.EMPTY, String.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isEqualTo(CodelistCache.getAsMap(ListName.SOURCE).get("TEST_CODE"));
    }

    @Test
    void save_shouldSaveNewCodelist() {
        String code = "Save Code";
        String description = "Test description";
        List<CodelistRequest> requests = createRequest("SOURCE", code, description);
        assertFalse(CodelistCache.contains(ListName.SOURCE, code));

        ResponseEntity<List<Codelist>> responseEntity = restTemplate.exchange(
                "/codelist", HttpMethod.POST, new HttpEntity<>(requests), RESPONSE_TYPE);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        Codelist codelist = responseEntity.getBody().get(0);
        assertThat(codelist.getDescription()).isEqualTo(description);
        assertThat(codelist.getCode()).isEqualTo(code);

        assertTrue(CodelistCache.contains(ListName.SOURCE, code));
        Codelist savecode = CodelistService.getCodelist(ListName.SOURCE, "savecode");
        assertThat(savecode.getCode()).isEqualTo(code);
        assertThat(savecode.getNormalizedCode()).isEqualTo("SAVECODE");
        assertThat(savecode.getDescription()).isEqualTo(description);
    }

    @Test
    void save_shouldInvalidateWrongListname() {
        List<CodelistRequest> requests = createRequest("PROVENAANCE", "Save Code", "Test description");

        ResponseEntity<String> responseEntity = restTemplate.exchange(
                "/codelist", HttpMethod.POST, new HttpEntity<>(requests), String.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(responseEntity.getBody()).contains("PROVENAANCE was invalid for type ListName");
    }

    @Test
    void save_shouldSave20Codelist() {
        List<CodelistRequest> requests = createNrOfRequests("shouldSave20Codelists", 20);

        ResponseEntity<List<Codelist>> responseEntity = restTemplate.exchange(
                "/codelist", HttpMethod.POST, new HttpEntity<>(requests), RESPONSE_TYPE);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(CodelistCache.getAsMap(ListName.SOURCE).size()).isEqualTo(20);
    }

    @Test
    void update_shouldUpdateOneCodelist() {
        String code = "UPDATE_CODE";
        service.save(createRequest("SOURCE", code, "Test description"));

        List<CodelistRequest> updatedCodelists = createRequest("SOURCE", code, "Updated codelists");

        ResponseEntity<String> responseEntity = restTemplate.exchange(
                "/codelist", HttpMethod.PUT, new HttpEntity<>(updatedCodelists), String.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(CodelistCache.getAsMap(ListName.SOURCE).get(code)).isEqualTo(updatedCodelists.get(0).getDescription());
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
        assertThat(CodelistCache.getAsMap(ListName.SOURCE).size()).isEqualTo(20);
        Collection<String> descriptionList = CodelistCache.getAsMap(ListName.SOURCE).values();
        descriptionList.forEach(description -> assertThat(description).isEqualTo("Updated codelists"));
    }


    @Test
    void delete_shouldDeleteCodelist() {
        String code = "DELETE_CODE";
        List<CodelistRequest> requests = createRequest("SOURCE", code, "Test description");
        service.save(requests);
        assertNotNull(CodelistCache.getAsMap(ListName.SOURCE).get(code));

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
                .description(description)
                .build();
    }

    private List<CodelistRequest> createRequest(String listName, String code, String description) {
        return List.of(createOneRequest(listName, code, description));
    }

}
