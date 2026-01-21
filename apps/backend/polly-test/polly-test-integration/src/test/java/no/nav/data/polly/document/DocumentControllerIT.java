package no.nav.data.polly.document;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.codelist.CodelistStaticService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodelistResponse;
import no.nav.data.polly.document.dto.DocumentInfoTypeUseRequest;
import no.nav.data.polly.document.dto.DocumentInfoTypeUseResponse;
import no.nav.data.polly.document.dto.DocumentRequest;
import no.nav.data.polly.document.dto.DocumentResponse;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.dto.InformationTypeShortResponse;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.UUID;

import static no.nav.data.common.utils.StreamUtils.convert;
import static org.assertj.core.api.Assertions.assertThat;

class DocumentControllerIT extends IntegrationTestBase {

    private InformationType documentInfoType;

    @Test
    void createAndGetDocument() {
        var disc = createDocumentArbeidsgiverWithInformationType();

        DocumentResponse got = webTestClient.get()
                .uri("/document/{id}", disc.getId())
                .exchange()
                .expectStatus().isOk()
                .expectBody(DocumentResponse.class)
                .returnResult()
                .getResponseBody();

        assertResponse(got);
    }

    private DocumentResponse createDocumentArbeidsgiverWithInformationType() {
        documentInfoType = createAndSaveInformationType();

        var req = buildDocument();
        req.setInformationTypes(List.of(createInfoTypeUseRequest(documentInfoType.getId().toString())));

        DocumentResponse created = webTestClient.post()
                .uri("/document")
                .bodyValue(req)
                .exchange()
                .expectStatus().isCreated()
                .expectBody(DocumentResponse.class)
                .returnResult()
                .getResponseBody();

        assertResponse(created);
        return created;
    }

    private DocumentInfoTypeUseRequest createInfoTypeUseRequest(String informationTypeId) {
        return DocumentInfoTypeUseRequest.builder().informationTypeId(informationTypeId).subjectCategories(List.of("BRUKER")).build();
    }

    private void assertResponse(DocumentResponse documentResponse) {
        InformationType infoType = documentInfoType != null ? documentInfoType : createAndSaveInformationType();
        assertThat(documentResponse).isNotNull();

        InformationTypeShortResponse infoTypeRes = new InformationTypeShortResponse(infoType.getId(), infoType.getData().getName(),
                CodelistResponse.buildFrom(CodelistStaticService.getCodelist(ListName.SENSITIVITY, infoType.getData().getSensitivity())));

        assertThat(documentResponse).isEqualTo(DocumentResponse.builder()
                .id(documentResponse.getId())
                .name("Skattedata")
                .description("desc")
                .informationTypes(List.of(DocumentInfoTypeUseResponse.builder().informationTypeId(infoTypeRes.getId())
                        .informationType(infoTypeRes)
                        .subjectCategory(CodelistResponse.buildFrom(CodelistStaticService.getCodelist(ListName.SUBJECT_CATEGORY, "BRUKER"))).build()))
                .build());
    }

    @Test
    void getAllDocument() {
        webTestClient.post().uri("/document").bodyValue(buildDocument()).exchange().expectStatus().isCreated();
        webTestClient.post().uri("/document").bodyValue(buildDocument()).exchange().expectStatus().isCreated();

        webTestClient.get()
                .uri("/document")
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.content.length()").isEqualTo(2);
    }

    @Test
    void getDocumentByInfoTypeId() {
        webTestClient.post().uri("/document").bodyValue(buildDocument()).exchange().expectStatus().isCreated();
        var doc = createDocumentArbeidsgiverWithInformationType();

        webTestClient.get()
                .uri(uriBuilder -> uriBuilder.path("/document")
                        .queryParam("informationTypeId", doc.getInformationTypes().get(0).getInformationTypeId())
                        .build())
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.content.length()").isEqualTo(1);
    }

    @Test
    void createDocumentValidationError() {
        webTestClient.post()
                .uri("/document")
                .bodyValue(DocumentRequest.builder().description("newdocument").build())
                .exchange()
                .expectStatus().isBadRequest();
    }

    @Test
    void updateDocument() {
        var infoTypeOne = createAndSaveInformationType(UUID.randomUUID(), "name1");
        var infoTypeTwo = createAndSaveInformationType(UUID.randomUUID(), "name2");

        DocumentRequest create = buildDocument();
        create.setInformationTypes(List.of(createInfoTypeUseRequest(infoTypeOne.getId().toString()), createInfoTypeUseRequest(infoTypeTwo.getId().toString())));

        DocumentResponse created = webTestClient.post()
                .uri("/document")
                .bodyValue(create)
                .exchange()
                .expectStatus().isCreated()
                .expectBody(DocumentResponse.class)
                .returnResult()
                .getResponseBody();

        assertThat(created).isNotNull();
        assertThat(created.getInformationTypes()).hasSize(2);
        assertThat(convert(created.getInformationTypes(), DocumentInfoTypeUseResponse::getInformationTypeId)).contains(infoTypeOne.getId(), infoTypeTwo.getId());

        String id = created.getId().toString();
        var infoTypeUpdate = createAndSaveInformationType(UUID.randomUUID(), "name3");
        DocumentRequest update = buildDocument();
        update.setId(id);
        update.setInformationTypes(List.of(createInfoTypeUseRequest(infoTypeOne.getId().toString()), createInfoTypeUseRequest(infoTypeUpdate.getId().toString())));

        DocumentResponse updated = webTestClient.put()
                .uri("/document/{id}", id)
                .bodyValue(update)
                .exchange()
                .expectStatus().isOk()
                .expectBody(DocumentResponse.class)
                .returnResult()
                .getResponseBody();

        assertThat(updated).isNotNull();
        assertThat(updated.getInformationTypes()).hasSize(2);
        assertThat(convert(updated.getInformationTypes(), DocumentInfoTypeUseResponse::getInformationTypeId)).contains(infoTypeOne.getId(), infoTypeUpdate.getId());

    }

    @Test
    void updateDocumentValidationError() {
        DocumentResponse created = webTestClient.post()
                .uri("/document")
                .bodyValue(buildDocument())
                .exchange()
                .expectStatus().isCreated()
                .expectBody(DocumentResponse.class)
                .returnResult()
                .getResponseBody();
        assertThat(created).isNotNull();

        String id = created.getId().toString();
        DocumentRequest request2 = buildDocument();
        request2.setId(id);
        request2.setName(null);

        webTestClient.put()
                .uri("/document/{id}", id)
                .bodyValue(request2)
                .exchange()
                .expectStatus().isBadRequest();
    }

    @Test
    void delete() {
        InformationType informationType = createAndSaveInformationType();
        var policy = createAndSavePolicy(PURPOSE_CODE1, informationType);
        var disclosure = createDisclosure("BRUKER", "ART61E", null);

        var doc = documentRepository.save(createDocument("BRUKER", informationType.getId()));
        policy.getData().getDocumentIds().add(doc.getId());
        policyRepository.save(policy);

        webTestClient.delete()
                .uri("/document/{id}", doc.getId())
                .exchange()
                .expectStatus().isBadRequest();
        policyRepository.delete(policy);

        disclosure.getData().setDocumentId(doc.getId());
        disclosureRepository.save(disclosure);
        webTestClient.delete()
                .uri("/document/{id}", doc.getId())
                .exchange()
                .expectStatus().isBadRequest();
        disclosureRepository.delete(disclosure);

        webTestClient.delete()
                .uri("/document/{id}", doc.getId())
                .exchange()
                .expectStatus().isOk();
    }

    private DocumentRequest buildDocument() {
        return DocumentRequest.builder()
                .name("Skattedata")
                .description("desc")
                .build();
    }

}