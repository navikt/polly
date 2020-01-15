package no.nav.data.polly.informationtype;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.codelist.CodelistStub;
import no.nav.data.polly.sync.domain.SyncStatus;
import no.nav.data.polly.informationtype.InformationTypeController.InformationTypePage;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.dto.InformationTypeRequest;
import no.nav.data.polly.informationtype.dto.InformationTypeResponse;
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
        var informationType = informationTypeRepository.save(createAndSaveInformationType(UUID.randomUUID(), "new-name"));
        ResponseEntity<Map> responseEntity = restTemplate.exchange(
                "/informationtype/" + informationType.getId(), HttpMethod.GET, HttpEntity.EMPTY, Map.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody().get("name")).isEqualTo(informationType.getData().getName());
    }

    @Test
    void searchInformationTypeByName() {
        informationTypeRepository.save(createAndSaveInformationType(UUID.randomUUID(), "InformationTypeData"));
        informationTypeRepository.save(createAndSaveInformationType(UUID.randomUUID(), "TypeData"));
        ResponseEntity<InformationTypePage> responseEntity = restTemplate.exchange(
                "/informationtype/search/typedata", HttpMethod.GET, HttpEntity.EMPTY, InformationTypePage.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isNotNull();
        assertThat(responseEntity.getBody().getNumberOfElements()).isEqualTo(2L);
        assertThat(responseEntity.getBody().getContent().get(0).getName()).isEqualTo("TypeData");
        assertThat(responseEntity.getBody().getContent().get(1).getName()).isEqualTo("InformationTypeData");
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
        InformationTypeRequest req1 = createRequest("createName1");
        InformationTypeRequest req2 = createRequest("createName2");

        ResponseEntity<InformationTypePage> responseEntity = restTemplate
                .exchange("/informationtype", HttpMethod.POST, new HttpEntity<>(List.of(req1, req2)), InformationTypePage.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(responseEntity.getBody().getTotalElements()).isEqualTo(2);
        assertThat(informationTypeRepository.count()).isEqualTo(2L);
        assertThat(informationTypeRepository.findByName("createName1")).isPresent();
        assertThat(informationTypeRepository.findByName("createName2")).isPresent();
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
        List<InformationType> list = createInformationTypeTestData(3);

        List<InformationTypeRequest> requests = new ArrayList<>();
        requests.add(createRequest("InformationType_nr1", list.get(0).getId().toString()));
        requests.add(createRequest("InformationType_nr2", list.get(1).getId().toString()));
        requests.add(createRequest("InformationType_nr3", list.get(2).getId().toString()));

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

        InformationTypeRequest request = createRequest("InformationType_nr2", id.toString());
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
        informationTypes.forEach(d -> d.setSyncStatus(SyncStatus.SYNCED));
        informationTypeRepository.saveAll(informationTypes);

        UUID id = informationTypeRepository.findByName("InformationType_nr2").get().getId();
        assertThat(informationTypeRepository.count()).isEqualTo(3L);
        assertThat(informationTypeRepository.findByName("InformationType_nr1")
                .get()
                .getSyncStatus()).isEqualTo(SyncStatus.SYNCED);
        assertThat(informationTypeRepository.findByName("InformationType_nr2")
                .get()
                .getSyncStatus()).isEqualTo(SyncStatus.SYNCED);
        assertThat(informationTypeRepository.findByName("InformationType_nr3")
                .get()
                .getSyncStatus()).isEqualTo(SyncStatus.SYNCED);

        ResponseEntity<InformationTypeResponse> responseEntity = restTemplate.exchange(
                "/informationtype/" + id, HttpMethod.DELETE, HttpEntity.EMPTY, InformationTypeResponse.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.ACCEPTED);
        assertThat(informationTypeRepository.count()).isEqualTo(3L);
        assertThat(informationTypeRepository.findByName("InformationType_nr1")
                .get()
                .getSyncStatus()).isEqualTo(SyncStatus.SYNCED);
        assertThat(informationTypeRepository.findByName("InformationType_nr2 (To be deleted)")
                .get()
                .getSyncStatus()).isEqualTo(SyncStatus.TO_BE_DELETED);
        assertThat(informationTypeRepository.findByName("InformationType_nr3")
                .get()
                .getSyncStatus()).isEqualTo(SyncStatus.SYNCED);
    }

    @Test
    void testSync() {
        var it = informationTypeRepository.save(createAndSaveInformationType(UUID.randomUUID(), "new-name"));

        restTemplate.postForLocation("/informationtype/sync", List.of(it.getId()), it.getId());
        assertThat(informationTypeRepository.findById(it.getId()).get().getSyncStatus()).isEqualTo(SyncStatus.TO_BE_UPDATED);
    }

    private List<InformationType> createInformationTypeTestData(int nrOfRows) {
        return informationTypeRepository.saveAll(IntStream.rangeClosed(1, nrOfRows)
                .mapToObj(i -> new InformationType()
                        .convertNewFromRequest(createRequest("InformationType_nr" + i)))
                .collect(toList()));
    }

    private InformationTypeRequest createRequest(String name) {
        return createRequest(name, null);
    }

    private InformationTypeRequest createRequest(String name, String id) {
        return InformationTypeRequest.builder()
                .id(id)
                .name(name)
                .term("term")
                .description("InformationTypeDescription")
                .sensitivity("Personopplysning")
                .navMaster("TPS")
                .categories(List.of("PERSONALIA"))
                .sources(List.of("Skatt"))
                .keywords(List.of("keyword"))
                .build();
    }
}
