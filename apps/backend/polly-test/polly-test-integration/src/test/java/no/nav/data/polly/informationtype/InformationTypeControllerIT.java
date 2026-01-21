package no.nav.data.polly.informationtype;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.informationtype.InformationTypeController.InformationTypePage;
import no.nav.data.polly.informationtype.InformationTypeController.InformationTypeShortPage;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.dto.InformationTypeRequest;
import no.nav.data.polly.informationtype.dto.InformationTypeResponse;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.IntStream;

import static java.util.stream.Collectors.toList;
import static org.assertj.core.api.Assertions.assertThat;

class InformationTypeControllerIT extends IntegrationTestBase {

    @Test
    void findForId() {
        var informationType = informationTypeRepository.save(createAndSaveInformationType(UUID.randomUUID(), "new-name"));

        InformationTypeResponse body = webTestClient.get()
                .uri("/informationtype/{id}", informationType.getId())
                .exchange()
                .expectStatus().isOk()
                .expectBody(InformationTypeResponse.class)
                .returnResult()
                .getResponseBody();

        assertThat(body).isNotNull();
        assertThat(body.getName()).isEqualTo(informationType.getData().getName());
    }

    @Test
    void searchInformationTypeByName() {
        informationTypeRepository.save(createAndSaveInformationType(UUID.randomUUID(), "InformationTypeData"));
        informationTypeRepository.save(createAndSaveInformationType(UUID.randomUUID(), "TypeData"));

        InformationTypePage body = webTestClient.get()
                .uri(uriBuilder -> uriBuilder.path("/informationtype/search").queryParam("name", "typedata").build())
                .exchange()
                .expectStatus().isOk()
                .expectBody(InformationTypePage.class)
                .returnResult()
                .getResponseBody();

        assertThat(body).isNotNull();
        assertThat(body.getNumberOfElements()).isEqualTo(2L);
        assertThat(body.getContent().get(0).getName()).isEqualTo("TypeData");
        assertThat(body.getContent().get(1).getName()).isEqualTo("InformationTypeData");
    }

    @Test
    void searchInformationTypeByNameWithForwardSlash() {
        informationTypeRepository.save(createAndSaveInformationType(UUID.randomUUID(), "InformationType/Data"));
        informationTypeRepository.save(createAndSaveInformationType(UUID.randomUUID(), "Type/Data"));

        InformationTypePage body = webTestClient.get()
                .uri(uriBuilder -> uriBuilder.path("/informationtype/search").queryParam("name", "type/data").build())
                .exchange()
                .expectStatus().isOk()
                .expectBody(InformationTypePage.class)
                .returnResult()
                .getResponseBody();

        assertThat(body).isNotNull();
        assertThat(body.getNumberOfElements()).isEqualTo(2L);
        assertThat(body.getContent().get(0).getName()).isEqualTo("Type/Data");
        assertThat(body.getContent().get(1).getName()).isEqualTo("InformationType/Data");
    }

    @Test
    void getAllShort() {
        var it = informationTypeRepository.save(createAndSaveInformationType(UUID.randomUUID(), "InformationTypeData"));

        InformationTypeShortPage body = webTestClient.get()
                .uri("/informationtype/short")
                .exchange()
                .expectStatus().isOk()
                .expectBody(InformationTypeShortPage.class)
                .returnResult()
                .getResponseBody();

        assertThat(body).isNotNull();
        assertThat(body.getNumberOfElements()).isEqualTo(1L);
        assertThat(body.getContent().get(0).getId()).isEqualTo(it.getId());
        assertThat(body.getContent().get(0).getName()).isEqualTo(it.getData().getName());
        assertThat(body.getContent().get(0).getSensitivity().getCode()).isEqualTo(it.getData().getSensitivity());
    }

    @Nested
    class findAll {

        @Test
        void get() {
            createInformationTypeTestData(30);

            InformationTypePage body = webTestClient.get()
                    .uri("/informationtype")
                    .exchange()
                    .expectStatus().isOk()
                    .expectBody(InformationTypePage.class)
                    .returnResult()
                    .getResponseBody();

            assertThat(informationTypeRepository.findAll().size()).isEqualTo(30);
            assertThat(body).isNotNull();
            assertThat(body.getContent().size()).isEqualTo(20);
            assertThat(body.getPageNumber()).isEqualTo(0);
            assertThat(body.getPageSize()).isEqualTo(20);
            assertThat(body.getTotalElements()).isEqualTo(30L);
        }

        @Test
        void findBySource() {
            createInformationTypeTestData(1);
            assertGetOne("/informationtype", "source", "SKATT");
        }

        @Test
        void getForTerm() {
            createInformationTypeTestData(1);
            assertGetOne("/informationtype", "term", "term");
        }

        @Test
        void getForOrgMaster() {
            createInformationTypeTestData(1);
            assertGetOne("/informationtype", "orgMaster", "TPS");
        }

        @Test
        void getForProductTeam() {
            createInformationTypeTestData(1);
            assertGetOne("/informationtype", "productTeam", "teamid1");
        }

        @Test
        void getForProductArea() {
            createInformationTypeTestData(1);
            assertGetOne("/informationtype", "productArea", "productarea1");
        }

        @Test
        void getForProductAreaNoResults() {
            assertGet("/informationtype", "productArea", "productarea1", 0);
        }

        private void assertGetOne(String path, String key, String arg) {
            assertGet(path, key, arg, 1);
        }

        private void assertGet(String path, String key, String arg, int num) {
            InformationTypePage body = webTestClient.get()
                    .uri(uriBuilder -> uriBuilder.path(path).queryParam(key, arg).build())
                    .exchange()
                    .expectStatus().isOk()
                    .expectBody(InformationTypePage.class)
                    .returnResult()
                    .getResponseBody();

            assertThat(body).isNotNull();
            assertThat(body.getContent()).hasSize(num);
        }
    }

    @Test
    void countAllInformationTypes() {
        createInformationTypeTestData(35);

        Long body = webTestClient.get()
                .uri("/informationtype/count")
                .exchange()
                .expectStatus().isOk()
                .expectBody(Long.class)
                .returnResult()
                .getResponseBody();

        assertThat(body).isEqualTo(35L);
    }

    @Test
    void createInformationTypes() {
        InformationTypeRequest req1 = createRequest("createName1");
        InformationTypeRequest req2 = createRequest("createName2");

        InformationTypePage body = webTestClient.post()
                .uri("/informationtype")
                .bodyValue(List.of(req1, req2))
                .exchange()
                .expectStatus().isCreated()
                .expectBody(InformationTypePage.class)
                .returnResult()
                .getResponseBody();

        assertThat(body).isNotNull();
        assertThat(body.getTotalElements()).isEqualTo(2);
        assertThat(informationTypeRepository.count()).isEqualTo(2L);
        assertThat(informationTypeRepository.findByName("createName1")).isPresent();
        assertThat(informationTypeRepository.findByName("createName2")).isPresent();
    }

    @Test
    void createInvalidInformationType() {
        List<InformationTypeRequest> requests = List.of(createRequest("createName"), createRequest("createName"));

        String body = webTestClient.post()
                .uri("/informationtype")
                .bodyValue(requests)
                .exchange()
                .expectStatus().isBadRequest()
                .expectBody(String.class)
                .returnResult()
                .getResponseBody();

        assertThat(body).contains("DuplicatedIdentifyingFields");
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

        InformationTypePage body = webTestClient.put()
                .uri("/informationtype")
                .bodyValue(requests)
                .exchange()
                .expectStatus().isOk()
                .expectBody(InformationTypePage.class)
                .returnResult()
                .getResponseBody();

        assertThat(body).isNotNull();
        assertThat(body.getTotalElements()).isEqualTo(3);
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

        InformationTypeResponse body = webTestClient.put()
                .uri("/informationtype/{id}", id)
                .bodyValue(request)
                .exchange()
                .expectStatus().isOk()
                .expectBody(InformationTypeResponse.class)
                .returnResult()
                .getResponseBody();

        assertThat(body).isNotNull();
        assertThat(body.getDescription()).isEqualTo("UPDATED DESCRIPTION");
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

        webTestClient.delete()
                .uri("/informationtype/{id}", id)
                .exchange()
                .expectStatus().isOk();

        assertThat(informationTypeRepository.count()).isEqualTo(2L);
        assertThat(informationTypeRepository.findByName("InformationType_nr1")).isPresent();
        assertThat(informationTypeRepository.findByName("InformationType_nr2")).isEmpty();
        assertThat(informationTypeRepository.findByName("InformationType_nr3")).isPresent();
    }

    @Test
    void preventDeleteUsedInfoTypes() {
        InformationType informationType = createAndSaveInformationType();

        var policy = createAndSavePolicy(PURPOSE_CODE1, informationType);

        String body = webTestClient.delete()
                .uri("/informationtype/{id}", informationType.getId())
                .exchange()
                .expectStatus().isBadRequest()
                .expectBody(String.class)
                .returnResult()
                .getResponseBody();

        assertThat(body).contains("used by 1 policie(s)");

        policyRepository.delete(policy);

        var doc = documentRepository.save(createDocument("BRUKER", informationType.getId()));

        body = webTestClient.delete()
                .uri("/informationtype/{id}", informationType.getId())
                .exchange()
                .expectStatus().isBadRequest()
                .expectBody(String.class)
                .returnResult()
                .getResponseBody();

        assertThat(body).contains("used by 1 document(s)");

        documentRepository.delete(doc);

        webTestClient.delete()
                .uri("/informationtype/{id}", informationType.getId())
                .exchange()
                .expectStatus().isOk();
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
