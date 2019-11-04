package no.nav.data.polly.informationtype;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.codelist.CodelistStub;
import no.nav.data.polly.elasticsearch.domain.ElasticsearchStatus;
import no.nav.data.polly.informationtype.InformationTypeController.InformationTypePage;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.dto.InformationTypeRequest;
import no.nav.data.polly.informationtype.dto.InformationTypeResponse;
import no.nav.data.polly.term.domain.Term;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.IntStream;

import static java.util.stream.Collectors.toList;
import static no.nav.data.polly.informationtype.domain.InformationTypeMaster.REST;
import static org.assertj.core.api.Assertions.assertThat;

class InformationTypeControllerIT extends IntegrationTestBase {

    @Autowired
    protected TestRestTemplate restTemplate;

    @BeforeEach
    void setUp() {
        CodelistStub.initializeCodelist();
    }

    @Test
    void findForId() {
        var informationType = informationTypeRepository.save(createInformationType(UUID.randomUUID(), "new-name"));
        ResponseEntity<Map> responseEntity = restTemplate.exchange(
                "/informationtype/" + informationType.getId(), HttpMethod.GET, HttpEntity.EMPTY, Map.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody().get("name")).isEqualTo(informationType.getData().getName());
    }

    @Test
    void getInformationTypeByName() {
        var informationType = informationTypeRepository.save(createInformationType(UUID.randomUUID(), "InformationTypeData"));
        ResponseEntity<Map> responseEntity = restTemplate.exchange(
                "/informationtype/name/InformationTypeData", HttpMethod.GET, HttpEntity.EMPTY, Map.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody().get("name")).isEqualTo(informationType.getData().getName());
    }

    @Test
    void findAll() {
        createInformationTypeTestData(30);

        ResponseEntity<InformationTypePage> responseEntity = restTemplate.exchange("/informationtype/",
                HttpMethod.GET, HttpEntity.EMPTY, InformationTypePage.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(informationTypeRepository.findAll().size()).isEqualTo(30);
        assertThat(responseEntity.getBody().getContent().size()).isEqualTo(20);
        assertThat(responseEntity.getBody().getPageNumber()).isEqualTo(0);
        assertThat(responseEntity.getBody().getPageSize()).isEqualTo(20);
        assertThat(responseEntity.getBody().getTotalElements()).isEqualTo(30L);
    }

    @Test
    void countAllInformationTypes() {
        createInformationTypeTestData(35);

        ResponseEntity<Long> responseEntity = restTemplate.exchange(
                "/informationtype/count", HttpMethod.GET, HttpEntity.EMPTY, Long.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isEqualTo(35L);
    }

    @Test
    void createInformationTypes() {
        termRepository.save(Term.builder().generateId().name("existingterm").description("desc").build());
        InformationTypeRequest req1 = createRequest("createName1");
        req1.setTerm("existingterm");
        InformationTypeRequest req2 = createRequest("createName2");

        ResponseEntity<InformationTypePage> responseEntity = restTemplate
                .exchange("/informationtype", HttpMethod.POST, new HttpEntity<>(List.of(req1, req2)), InformationTypePage.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(responseEntity.getBody().getTotalElements()).isEqualTo(2);
        assertThat(informationTypeRepository.count()).isEqualTo(2L);
        assertThat(informationTypeRepository.findByName("createName1")).isPresent();
        assertThat(informationTypeRepository.findByName("createName2")).isPresent();
        assertThat(termRepository.count()).isEqualTo(2L);
        assertThat(termRepository.findByName(req1.getTerm())).isPresent();
        assertThat(termRepository.findByName(req2.getTerm())).isPresent();
    }

    @Test
    void createInvalidInformationType() {
        List<InformationTypeRequest> requests = List.of(createRequest("createName"), createRequest("createName"));

        ResponseEntity<String> responseEntity = restTemplate.exchange("/informationtype", HttpMethod.POST, new HttpEntity<>(requests), String.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(responseEntity.getBody()).contains("DuplicatedIdentifyingFields");
        assertThat(informationTypeRepository.count()).isZero();
    }

    @Test
    void updateInformationTypes() {
        createInformationTypeTestData(3);

        List<InformationTypeRequest> requests = new ArrayList<>();
        requests.add(createRequest("InformationType_nr1"));
        requests.add(createRequest("InformationType_nr2"));
        requests.add(createRequest("InformationType_nr3"));

        requests.forEach(request -> request.setDescription("UPDATED DESCRIPTION"));

        ResponseEntity<InformationTypePage> responseEntity = restTemplate.exchange(
                "/informationtype", HttpMethod.PUT, new HttpEntity<>(requests), InformationTypePage.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody().getTotalElements()).isEqualTo(3);
        assertThat(informationTypeRepository.count()).isEqualTo(3L);
        assertThat(informationTypeRepository.findByName("InformationType_nr1")
                .get()
                .getData()
                .getDescription()).isEqualTo("UPDATED DESCRIPTION");
        assertThat(informationTypeRepository.findByName("InformationType_nr2")
                .get()
                .getData()
                .getDescription()).isEqualTo("UPDATED DESCRIPTION");
        assertThat(informationTypeRepository.findByName("InformationType_nr3")
                .get()
                .getData()
                .getDescription()).isEqualTo("UPDATED DESCRIPTION");
    }

    @Test
    void updateOneInformationTypeById() {
        createInformationTypeTestData(3);
        UUID id = informationTypeRepository.findByName("InformationType_nr2").get().getId();

        InformationTypeRequest request = createRequest("InformationType_nr2");
        request.setDescription("UPDATED DESCRIPTION");

        ResponseEntity<InformationTypeResponse> responseEntity = restTemplate.exchange(
                "/informationtype/" + id, HttpMethod.PUT, new HttpEntity<>(request), InformationTypeResponse.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody().getDescription()).isEqualTo("UPDATED DESCRIPTION");
        assertThat(informationTypeRepository.count()).isEqualTo(3L);
        assertThat(informationTypeRepository.findByName("InformationType_nr1")
                .get()
                .getData()
                .getDescription()).isEqualTo("InformationTypeDescription");
        assertThat(informationTypeRepository.findByName("InformationType_nr2")
                .get()
                .getData()
                .getDescription()).isEqualTo("UPDATED DESCRIPTION");
        assertThat(informationTypeRepository.findByName("InformationType_nr3")
                .get()
                .getData()
                .getDescription()).isEqualTo("InformationTypeDescription");
    }

    @Test
    void deleteInformationTypeById() {
        createInformationTypeTestData(3);

        List<InformationType> informationTypes = informationTypeRepository.findAll();
        informationTypes.forEach(d -> d.setElasticsearchStatus(ElasticsearchStatus.SYNCED));
        informationTypeRepository.saveAll(informationTypes);

        UUID id = informationTypeRepository.findByName("InformationType_nr2").get().getId();
        assertThat(informationTypeRepository.count()).isEqualTo(3L);
        assertThat(informationTypeRepository.findByName("InformationType_nr1")
                .get()
                .getElasticsearchStatus()).isEqualTo(ElasticsearchStatus.SYNCED);
        assertThat(informationTypeRepository.findByName("InformationType_nr2")
                .get()
                .getElasticsearchStatus()).isEqualTo(ElasticsearchStatus.SYNCED);
        assertThat(informationTypeRepository.findByName("InformationType_nr3")
                .get()
                .getElasticsearchStatus()).isEqualTo(ElasticsearchStatus.SYNCED);

        ResponseEntity<InformationTypeResponse> responseEntity = restTemplate.exchange(
                "/informationtype/" + id, HttpMethod.DELETE, HttpEntity.EMPTY, InformationTypeResponse.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.ACCEPTED);
        assertThat(informationTypeRepository.count()).isEqualTo(3L);
        assertThat(informationTypeRepository.findByName("InformationType_nr1")
                .get()
                .getElasticsearchStatus()).isEqualTo(ElasticsearchStatus.SYNCED);
        assertThat(informationTypeRepository.findByName("InformationType_nr2")
                .get()
                .getElasticsearchStatus()).isEqualTo(ElasticsearchStatus.TO_BE_DELETED);
        assertThat(informationTypeRepository.findByName("InformationType_nr3")
                .get()
                .getElasticsearchStatus()).isEqualTo(ElasticsearchStatus.SYNCED);
    }

    @Test
    void testSync() {
        var it = informationTypeRepository.save(createInformationType(UUID.randomUUID(), "new-name"));

        restTemplate.postForLocation("/informationtype/sync", List.of(it.getId()), it.getId());
        assertThat(informationTypeRepository.findById(it.getId()).get().getElasticsearchStatus()).isEqualTo(ElasticsearchStatus.TO_BE_UPDATED);
    }

    private void createInformationTypeTestData(int nrOfRows) {
        informationTypeRepository.saveAll(IntStream.rangeClosed(1, nrOfRows)
                .mapToObj(i -> new InformationType()
                        .convertNewFromRequest(createRequest("InformationType_nr" + i), REST))
                .collect(toList()));
    }

    private InformationTypeRequest createRequest(String name) {
        return InformationTypeRequest.builder()
                .name(name)
                .term("someterm")
                .description("InformationTypeDescription")
                .pii("true")
                .sensitivity("Personopplysning")
                .categories(List.of("PERSONALIA"))
                .sources(List.of("Skatt"))
                .keywords(List.of("keyword"))
                .build();
    }
}
