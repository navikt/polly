package no.nav.data.polly.disclosure;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.codelist.CodelistStaticService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodelistResponse;
import no.nav.data.polly.disclosure.dto.DisclosureAbroadRequest;
import no.nav.data.polly.disclosure.dto.DisclosureAbroadResponse;
import no.nav.data.polly.disclosure.dto.DisclosureRequest;
import no.nav.data.polly.disclosure.dto.DisclosureResponse;
import no.nav.data.polly.document.domain.Document;
import no.nav.data.polly.document.domain.DocumentData;
import no.nav.data.polly.document.domain.DocumentData.InformationTypeUse;
import no.nav.data.polly.document.dto.DocumentInfoTypeUseResponse;
import no.nav.data.polly.document.dto.DocumentResponse;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.dto.InformationTypeShortResponse;
import no.nav.data.polly.legalbasis.dto.LegalBasisRequest;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class DisclosureControllerIT extends IntegrationTestBase {

    private Document document;

    @Test
    void createAndGetDisclosure() {
        var disc = createDisclosureArbeidsgiverWithInformationType();

        DisclosureResponse got = webTestClient.get()
                .uri("/disclosure/{id}", disc.getId())
                .exchange()
                .expectStatus().isOk()
                .expectBody(DisclosureResponse.class)
                .returnResult()
                .getResponseBody();

        assertResponse(got);
    }

    private DisclosureResponse createDisclosureArbeidsgiverWithInformationType() {
        document = createAndSaveDocument();
        var req = buildDisclosure("ARBEIDSGIVER");
        req.setDocumentId(document.getId().toString());

        DisclosureResponse created = webTestClient.post()
                .uri("/disclosure")
                .bodyValue(req)
                .exchange()
                .expectStatus().isCreated()
                .expectBody(DisclosureResponse.class)
                .returnResult()
                .getResponseBody();

        assertResponse(created);
        return created;
    }

    private void assertResponse(DisclosureResponse disclosureResponse) {
        InformationType infoType = createAndSaveInformationType();
        assertThat(disclosureResponse).isNotNull();
        assertThat(disclosureResponse.getChangeStamp()).isNotNull();
        disclosureResponse.setChangeStamp(null);

        InformationTypeShortResponse infoTypeRes = new InformationTypeShortResponse(infoType.getId(), infoType.getData().getName(),
                CodelistStaticService.getCodelistResponse(ListName.SENSITIVITY, infoType.getData().getSensitivity()));

        CodelistResponse department = CodelistStaticService.getCodelistResponse(ListName.DEPARTMENT, "DEP");

        assertThat(disclosureResponse).isEqualTo(DisclosureResponse.builder()
                .id(disclosureResponse.getId())
                .name("disc name")
                .description("disc desc")
                .recipient(CodelistStaticService.getCodelistResponse(ListName.THIRD_PARTY, disclosureResponse.getRecipient().getCode()))
                .recipientPurpose("recipient purpose")
                .start(LocalDate.now())
                .end(LocalDate.now())
                .legalBasis(legalBasisResponse())
                .productTeams(List.of())
                .department(department)
                .documentId(document.getId())
                .document(DocumentResponse.builder()
                        .id(document.getId())
                        .name(document.getData().getName())
                        .description(document.getData().getDescription())
                        .informationTypes(List.of(DocumentInfoTypeUseResponse.builder()
                                .informationTypeId(infoTypeRes.getId())
                                .informationType(infoTypeRes)
                                .subjectCategory(CodelistStaticService.getCodelistResponse(ListName.SUBJECT_CATEGORY, "BRUKER")).build()))
                        .build())
                .informationTypeIds(List.of())
                .processIds(List.of())
                .abroad(DisclosureAbroadResponse.builder()
                        .abroad(true)
                        .country("DNK")
                        .refToAgreement("abroadref")
                        .businessArea("Pesys")
                        .build())
                .assessedConfidentiality(disclosureResponse.getAssessedConfidentiality())
                .confidentialityDescription(disclosureResponse.getConfidentialityDescription())
                .build());
    }

    @Test
    void getAllDisclosure() {
        webTestClient.post().uri("/disclosure").bodyValue(buildDisclosure()).exchange().expectStatus().isCreated();
        webTestClient.post().uri("/disclosure").bodyValue(buildDisclosure()).exchange().expectStatus().isCreated();

        webTestClient.get()
                .uri("/disclosure")
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.content.length()").isEqualTo(2);
    }

    @Test
    void getAllDisclosureSummary() {
        var process = createAndSaveProcess(PURPOSE_CODE1);
        DisclosureRequest request = buildDisclosure();
        request.setProcessIds(List.of(process.getId().toString()));

        webTestClient.post()
                .uri("/disclosure")
                .bodyValue(request)
                .exchange()
                .expectStatus().isCreated();

        webTestClient.post().uri("/disclosure").bodyValue(buildDisclosure()).exchange().expectStatus().isCreated();

        webTestClient.get()
                .uri("/disclosure/summary")
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.content.length()").isEqualTo(2);
    }

    @Test
    void searchDisclosure() {
        webTestClient.post().uri("/disclosure").bodyValue(buildDisclosure()).exchange().expectStatus().isCreated();

        webTestClient.get()
                .uri("/disclosure/search/{string}", "disc name")
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.content.length()").isEqualTo(1);
    }

    @Nested
    class GetByField {

        @Test
        void getDisclosureByInfoTypeIdViaDocument() {
            webTestClient.post().uri("/disclosure").bodyValue(buildDisclosure()).exchange().expectStatus().isCreated();
            createDisclosureArbeidsgiverWithInformationType();
            UUID informationTypeId = document.getData().getInformationTypes().get(0).getInformationTypeId();

            webTestClient.get()
                    .uri(uriBuilder -> uriBuilder.path("/disclosure")
                            .queryParam("informationTypeId", informationTypeId)
                            .build())
                    .exchange()
                    .expectStatus().isOk()
                    .expectBody()
                    .jsonPath("$.content.length()").isEqualTo(1);
        }

        @Test
        void getDisclosureByInfoTypeId() {
            InformationType infoType = createAndSaveInformationType();
            DisclosureRequest request = buildDisclosure();
            request.setInformationTypeIds(List.of(infoType.getId().toString()));
            webTestClient.post().uri("/disclosure").bodyValue(request).exchange().expectStatus().isCreated();

            webTestClient.get()
                    .uri(uriBuilder -> uriBuilder.path("/disclosure")
                            .queryParam("informationTypeId", infoType.getId())
                            .build())
                    .exchange()
                    .expectStatus().isOk()
                    .expectBody()
                    .jsonPath("$.content.length()").isEqualTo(1);
        }

        @Test
        void getDisclosureByRecipient() {
            webTestClient.post().uri("/disclosure").bodyValue(buildDisclosure()).exchange().expectStatus().isCreated();
            var disc = createDisclosureArbeidsgiverWithInformationType();

            webTestClient.get()
                    .uri(uriBuilder -> uriBuilder.path("/disclosure")
                            .queryParam("recipient", disc.getRecipient().getCode())
                            .build())
                    .exchange()
                    .expectStatus().isOk()
                    .expectBody()
                    .jsonPath("$.content.length()").isEqualTo(1);
        }

        @Test
        void getDisclosureByDocumentId() {
            createDisclosureArbeidsgiverWithInformationType();

            webTestClient.get()
                    .uri(uriBuilder -> uriBuilder.path("/disclosure")
                            .queryParam("documentId", document.getId())
                            .build())
                    .exchange()
                    .expectStatus().isOk()
                    .expectBody()
                    .jsonPath("$.content.length()").isEqualTo(1);
        }

        @Test
        void getDisclosureByProcessId() {
            var process = createAndSaveProcess(PURPOSE_CODE1);
            DisclosureRequest request = buildDisclosure();
            request.setProcessIds(List.of(process.getId().toString()));
            webTestClient.post().uri("/disclosure").bodyValue(request).exchange().expectStatus().isCreated();

            webTestClient.get()
                    .uri(uriBuilder -> uriBuilder.path("/disclosure")
                            .queryParam("processId", process.getId())
                            .build())
                    .exchange()
                    .expectStatus().isOk()
                    .expectBody()
                    .jsonPath("$.content.length()").isEqualTo(1);
        }

        @Test
        void getDisclosureByNoLegalBases() {
            DisclosureRequest request = buildDisclosure();
            webTestClient.post().uri("/disclosure").bodyValue(request).exchange().expectStatus().isCreated();
            request.setLegalBases(List.of());
            webTestClient.post().uri("/disclosure").bodyValue(request).exchange().expectStatus().isCreated();

            webTestClient.get()
                    .uri(uriBuilder -> uriBuilder.path("/disclosure")
                            .queryParam("emptyLegalBases", true)
                            .build())
                    .exchange()
                    .expectStatus().isOk()
                    .expectBody()
                    .jsonPath("$.content.length()").isEqualTo(1);
        }
    }

    @Test
    void createDisclosureValidationError() {

        webTestClient.post()
                .uri("/disclosure")
                .bodyValue(DisclosureRequest.builder().description("newdisclosure").recipient("SKATT").recipientPurpose("AAP")
                        .legalBasis(LegalBasisRequest.builder().gdpr("6a").nationalLaw("eksisterer-ikke").description("desc").build())
                        .build())
                .exchange()
                .expectStatus().isBadRequest();
    }

    @Test
    void updateDisclosure() {
        var doc = createAndSaveDocument();
        DisclosureRequest create = buildDisclosure();
        create.setDocumentId(doc.getId().toString());

        DisclosureResponse created = webTestClient.post()
                .uri("/disclosure")
                .bodyValue(create)
                .exchange()
                .expectStatus().isCreated()
                .expectBody(DisclosureResponse.class)
                .returnResult()
                .getResponseBody();

        assertThat(created).isNotNull();
        assertThat(created.getDocumentId()).isEqualTo(doc.getId());

        String id = created.getId().toString();
        var docUpdate = createAndSaveDocument();
        DisclosureRequest update = buildDisclosure();
        update.setId(id);
        update.setDocumentId(docUpdate.getId().toString());

        DisclosureResponse updated = webTestClient.put()
                .uri("/disclosure/{id}", id)
                .bodyValue(update)
                .exchange()
                .expectStatus().isOk()
                .expectBody(DisclosureResponse.class)
                .returnResult()
                .getResponseBody();

        assertThat(updated).isNotNull();
        assertThat(updated.getDocumentId()).isEqualTo(docUpdate.getId());
    }

    @Test
    void updateDisclosureValidationError() {
        DisclosureResponse created = webTestClient.post()
                .uri("/disclosure")
                .bodyValue(buildDisclosure())
                .exchange()
                .expectStatus().isCreated()
                .expectBody(DisclosureResponse.class)
                .returnResult()
                .getResponseBody();
        assertThat(created).isNotNull();

        String id = created.getId().toString();
        DisclosureRequest request2 = buildDisclosure();
        request2.setId(id);
        request2.setRecipient("error");

        webTestClient.put()
                .uri("/disclosure/{id}", id)
                .bodyValue(request2)
                .exchange()
                .expectStatus().isBadRequest();
    }

    private DisclosureRequest buildDisclosure() {
        return buildDisclosure("SKATTEETATEN");
    }

    private DisclosureRequest buildDisclosure(String recipient) {
        return DisclosureRequest.builder()
                .name("disc name")
                .description("disc desc")
                .recipient(recipient)
                .recipientPurpose("recipient purpose")
                .start(LocalDate.now().toString())
                .end(LocalDate.now().toString())
                .productTeams(List.of())
                .department("DEP")
                .legalBasis(createLegalBasisRequest())
                .abroad(DisclosureAbroadRequest.builder()
                        .abroad(true)
                        .country("DNK")
                        .businessArea("Pesys")
                        .refToAgreement("abroadref")
                        .build())
                .assessedConfidentiality(true)
                .confidentialityDescription("Test Aheve")
                .build();
    }

    private Document createAndSaveDocument() {
        InformationType infoType = createAndSaveInformationType();
        var document = Document.builder()
                .generateId()
                .data(DocumentData.builder()
                        .name("doc 1")
                        .description("desc")
                        .informationTypes(List.of(InformationTypeUse.builder().  informationTypeId(infoType.getId()).subjectCategories(List.of("BRUKER")).build()))
                        .build())
                .build();
        return documentRepository.save(document);
    }
}
