package no.nav.data.polly.informationtype;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.informationtype.InformationTypeController.InformationTypePage;
import no.nav.data.polly.informationtype.InformationTypeController.InformationTypeShortPage;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.dto.InformationTypeRequest;
import no.nav.data.polly.informationtype.dto.InformationTypeResponse;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.IntStream;

import static java.util.stream.Collectors.toList;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.http.HttpEntity.EMPTY;
import static org.springframework.http.HttpMethod.DELETE;

class InformationTypeControllerIT extends IntegrationTestBase {

    @Autowired
    protected TestRestTemplate restTemplate;

    @Test
    void findForId() {
        var informationType = informationTypeRepository.save(createAndSaveInformationType(UUID.randomUUID(), "new-name"));
        ResponseEntity<InformationTypeResponse> responseEntity = restTemplate.getForEntity("/informationtype/{id}", InformationTypeResponse.class, informationType.getId());

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isNotNull();
        assertThat(responseEntity.getBody().getName()).isEqualTo(informationType.getData().getName());
    }

    @Test
    void searchInformationTypeByName() {
        informationTypeRepository.save(createAndSaveInformationType(UUID.randomUUID(), "InformationTypeData"));
        informationTypeRepository.save(createAndSaveInformationType(UUID.randomUUID(), "TypeData"));
        ResponseEntity<InformationTypePage> responseEntity = restTemplate.getForEntity("/informationtype/search?name={search}", InformationTypePage.class, "typedata");

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isNotNull();
        assertThat(responseEntity.getBody().getNumberOfElements()).isEqualTo(2L);
        assertThat(responseEntity.getBody().getContent().get(0).getName()).isEqualTo("TypeData");
        assertThat(responseEntity.getBody().getContent().get(1).getName()).isEqualTo("InformationTypeData");
    }

    @Test
    void searchInformationTypeByNameWithForwardSlash() {
        informationTypeRepository.save(createAndSaveInformationType(UUID.randomUUID(), "InformationType/Data"));
        informationTypeRepository.save(createAndSaveInformationType(UUID.randomUUID(), "Type/Data"));
        ResponseEntity<InformationTypePage> responseEntity = restTemplate.getForEntity("/informationtype/search?name={search}", InformationTypePage.class, "type/data");

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isNotNull();
        assertThat(responseEntity.getBody().getNumberOfElements()).isEqualTo(2L);
        assertThat(responseEntity.getBody().getContent().get(0).getName()).isEqualTo("Type/Data");
        assertThat(responseEntity.getBody().getContent().get(1).getName()).isEqualTo("InformationType/Data");
    }

    @Test
    void getAllShort() {
        var it = informationTypeRepository.save(createAndSaveInformationType(UUID.randomUUID(), "InformationTypeData"));

        var responseEntity = restTemplate.getForEntity("/informationtype/short", InformationTypeShortPage.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isNotNull();
        assertThat(responseEntity.getBody().getNumberOfElements()).isEqualTo(1L);
        assertThat(responseEntity.getBody().getContent().get(0).getId()).isEqualTo(it.getId());
        assertThat(responseEntity.getBody().getContent().get(0).getName()).isEqualTo(it.getData().getName());
        assertThat(responseEntity.getBody().getContent().get(0).getSensitivity().getCode()).isEqualTo(it.getData().getSensitivity());
    }

    @Nested
    class findAll {

        @Test
        void get() {
            createInformationTypeTestData(30);

            ResponseEntity<InformationTypePage> responseEntity = restTemplate.getForEntity("/informationtype", InformationTypePage.class);

            assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(informationTypeRepository.findAll().size()).isEqualTo(30);
            assertThat(responseEntity.getBody()).isNotNull();
            assertThat(responseEntity.getBody().getContent().size()).isEqualTo(20);
            assertThat(responseEntity.getBody().getPageNumber()).isEqualTo(0);
            assertThat(responseEntity.getBody().getPageSize()).isEqualTo(20);
            assertThat(responseEntity.getBody().getTotalElements()).isEqualTo(30L);
        }

        @Test
        void findBySource() {
            createInformationTypeTestData(1);
            assertGetOne("/informationtype?source={source}", "SKATT");
        }

        @Test
        void getForTerm() {
            createInformationTypeTestData(1);
            assertGetOne("/informationtype?term={term}", "term");
        }

        @Test
        void getForOrgMaster() {
            createInformationTypeTestData(1);
            assertGetOne("/informationtype?orgMaster={orgMaster}", "TPS");
        }

        @Test
        void getForProductTeam() {
            createInformationTypeTestData(1);
            assertGetOne("/informationtype?productTeam={productTeam}", "teamid1");
        }

        @Test
        void getForProductArea() {
            createInformationTypeTestData(1);
            assertGetOne("/informationtype?productArea={productArea}", "productarea1");
        }

        @Test
        void getForProductAreaNoResults() {
            assertGet("/informationtype?productArea={productArea}", "productarea1", 0);
        }

        private void assertGetOne(String url, String arg) {
            assertGet(url, arg, 1);
        }

        private void assertGet(String url, String arg, int num) {
            ResponseEntity<InformationTypePage> resp = restTemplate.getForEntity(url, InformationTypePage.class, arg);

            assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
            InformationTypePage page = resp.getBody();
            assertThat(page).isNotNull();
            assertThat(page.getContent()).hasSize(num);
        }
    }

    @Test
    void countAllInformationTypes() {
        createInformationTypeTestData(35);

        ResponseEntity<Long> responseEntity = restTemplate.getForEntity("/informationtype/count", Long.class);

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
        assertThat(responseEntity.getBody()).isNotNull();
        assertThat(responseEntity.getBody().getTotalElements()).isEqualTo(2);
        assertThat(informationTypeRepository.count()).isEqualTo(2L);
        assertThat(informationTypeRepository.findByName("createName1")).isPresent();
        assertThat(informationTypeRepository.findByName("createName2")).isPresent();
    }

    @Test
    void createInvalidInformationType() {
        List<InformationTypeRequest> requests = List.of(createRequest("createName"), createRequest("createName"));

        var resp = restTemplate.exchange("/informationtype", HttpMethod.POST, new HttpEntity<>(requests), String.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(resp.getBody()).contains("DuplicatedIdentifyingFields");
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
        assertThat(responseEntity.getBody()).isNotNull();
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
        informationTypeRepository.saveAll(informationTypes);
        assertThat(informationTypeRepository.count()).isEqualTo(3L);

        UUID id = informationTypeRepository.findByName("InformationType_nr2").get().getId();

        ResponseEntity<InformationTypeResponse> responseEntity = restTemplate.exchange("/informationtype/" + id, DELETE, EMPTY, InformationTypeResponse.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(informationTypeRepository.count()).isEqualTo(2L);
        assertThat(informationTypeRepository.findByName("InformationType_nr1")).isPresent();
        assertThat(informationTypeRepository.findByName("InformationType_nr2")).isEmpty();
        assertThat(informationTypeRepository.findByName("InformationType_nr3")).isPresent();
    }

    @Test
    void preventDeleteUsedInfoTypes() {
        InformationType informationType = createAndSaveInformationType();

        var policy = createAndSavePolicy(PURPOSE_CODE1, informationType);

        var resp = restTemplate.exchange("/informationtype/{id}", DELETE, EMPTY, String.class, informationType.getId());

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(resp.getBody()).contains("used by 1 policie(s)");

        policyRepository.delete(policy);

        var doc = documentRepository.save(createDocument("BRUKER", informationType.getId()));

        resp = restTemplate.exchange("/informationtype/{id}", DELETE, EMPTY, String.class, informationType.getId());
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(resp.getBody()).contains("used by 1 document(s)");

        documentRepository.delete(doc);

        assertThat(restTemplate.exchange("/informationtype/{id}", DELETE, EMPTY, String.class, informationType.getId()).getStatusCode()).isEqualTo(HttpStatus.OK);
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
                .sensitivity("pol")
                .orgMaster("TPS")
                .categories(List.of("PERSONALIA"))
                .sources(List.of("SKATT"))
                .keywords(List.of("keyword"))
                .productTeam("teamid1")
                .build();
    }
}
