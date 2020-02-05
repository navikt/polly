package no.nav.data.polly.disclosure;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.disclosure.DisclosureController.DisclosurePage;
import no.nav.data.polly.disclosure.dto.DisclosureRequest;
import no.nav.data.polly.disclosure.dto.DisclosureResponse;
import no.nav.data.polly.document.domain.Document;
import no.nav.data.polly.document.dto.DocumentInfoTypeResponse;
import no.nav.data.polly.document.dto.DocumentInfoTypeUseRequest;
import no.nav.data.polly.document.dto.DocumentInfoTypeUseResponse;
import no.nav.data.polly.document.dto.DocumentRequest;
import no.nav.data.polly.document.dto.DocumentResponse;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.legalbasis.dto.LegalBasisRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class DisclosureControllerIT extends IntegrationTestBase {

    @Autowired
    private TestRestTemplate restTemplate;
    private Document document;

    @Test
    void createAndGetDisclosure() {
        var disc = createDisclosureArbeidsgiverWithInformationType();
        var resp = restTemplate.getForEntity("/disclosure/{id}", DisclosureResponse.class, disc.getId());

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertResponse(resp);
    }

    private DisclosureResponse createDisclosureArbeidsgiverWithInformationType() {
        document = createAndSaveDocument();
        var req = buildDisclosure("ARBEIDSGIVER");
        req.setDocumentId(document.getId().toString());
        var resp = restTemplate.postForEntity("/disclosure", req, DisclosureResponse.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertResponse(resp);
        return resp.getBody();
    }

    private void assertResponse(ResponseEntity<DisclosureResponse> resp) {
        InformationType infoType = createAndSaveInformationType();
        var disclosureResponse = resp.getBody();
        assertThat(disclosureResponse).isNotNull();

        DocumentInfoTypeResponse infoTypeRes = new DocumentInfoTypeResponse(infoType.getId(), infoType.getData().getName(),
                CodelistService.getCodelistResponse(ListName.SENSITIVITY, infoType.getData().getSensitivity()));

        assertThat(disclosureResponse).isEqualTo(DisclosureResponse.builder()
                .id(disclosureResponse.getId())
                .name("disc name")
                .description("disc desc")
                .recipient(CodelistService.getCodelistResponse(ListName.THIRD_PARTY, disclosureResponse.getRecipient().getCode()))
                .recipientPurpose("recipient purpose")
                .start(LocalDate.now())
                .end(LocalDate.now())
                .legalBasis(legalBasisResponse())
                .documentId(document.getId())
                .document(DocumentResponse.builder()
                        .id(document.getId())
                        .name(document.getData().getName())
                        .description(document.getData().getDescription())
                        .informationTypes(List.of(DocumentInfoTypeUseResponse.builder()
                                .informationTypeId(infoTypeRes.getId())
                                .informationType(infoTypeRes)
                                .subjectCategory(CodelistService.getCodelistResponse(ListName.SUBJECT_CATEGORY, "BRUKER")).build()))
                        .build())
                .build());
    }

    @Test
    void getAllDisclosure() {
        restTemplate.postForEntity("/disclosure", buildDisclosure(), DisclosureResponse.class);
        restTemplate.postForEntity("/disclosure", buildDisclosure(), DisclosureResponse.class);
        ResponseEntity<DisclosurePage> resp = restTemplate.getForEntity("/disclosure", DisclosurePage.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        DisclosurePage disclosurePage = resp.getBody();
        assertThat(disclosurePage).isNotNull();

        assertThat(disclosurePage.getContent()).hasSize(2);
    }

    @Test
    void getDisclosureByInfoTypeId() {
        restTemplate.postForEntity("/disclosure", buildDisclosure(), DisclosureResponse.class);
        createDisclosureArbeidsgiverWithInformationType();
        ResponseEntity<DisclosurePage> resp = restTemplate
                .getForEntity("/disclosure?informationTypeId={infoTypeId}", DisclosurePage.class, document.getData().getInformationTypes().get(0).getInformationTypeId());

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        DisclosurePage disclosurePage = resp.getBody();
        assertThat(disclosurePage).isNotNull();

        assertThat(disclosurePage.getContent()).hasSize(1);
    }

    @Test
    void getDisclosureByRecipient() {
        restTemplate.postForEntity("/disclosure", buildDisclosure(), DisclosureResponse.class);
        var disc = createDisclosureArbeidsgiverWithInformationType();
        ResponseEntity<DisclosurePage> resp = restTemplate.getForEntity("/disclosure?recipient={recipient}", DisclosurePage.class, disc.getRecipient().getCode());

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        DisclosurePage disclosurePage = resp.getBody();
        assertThat(disclosurePage).isNotNull();

        assertThat(disclosurePage.getContent()).hasSize(1);
    }

    @Test
    void createDisclosureValidationError() {
        ResponseEntity<String> resp = restTemplate
                .postForEntity("/disclosure", DisclosureRequest.builder().description("newdisclosure").recipient("SKATT").recipientPurpose("AAP")
                        .legalBasis(LegalBasisRequest.builder().gdpr("6a").nationalLaw("eksisterer-ikke").description("desc").build())
                        .build(), String.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(resp.getBody()).contains("legalBases[0].nationalLaw: EKSISTERER-IKKE code not found in codelist NATIONAL_LAW");
    }

    @Test
    void updateDisclosure() {
        var doc = createAndSaveDocument();
        DisclosureRequest create = buildDisclosure();
        create.setDocumentId(doc.getId().toString());

        ResponseEntity<DisclosureResponse> resp = restTemplate.postForEntity("/disclosure", create, DisclosureResponse.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(resp.getBody()).isNotNull();
        assertThat(resp.getBody().getDocumentId()).isEqualTo(doc.getId());

        String id = resp.getBody().getId().toString();
        var docUpdate = createAndSaveDocument();
        DisclosureRequest update = buildDisclosure();
        update.setId(id);
        update.setDocumentId(docUpdate.getId().toString());

        resp = restTemplate.exchange("/disclosure/{id}", HttpMethod.PUT, new HttpEntity<>(update), DisclosureResponse.class, id);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody()).isNotNull();
        assertThat(resp.getBody().getDocumentId()).isEqualTo(docUpdate.getId());
    }

    @Test
    void updateDisclosureValidationError() {
        ResponseEntity<DisclosureResponse> resp = restTemplate.postForEntity("/disclosure", buildDisclosure(), DisclosureResponse.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(resp.getBody()).isNotNull();

        String id = resp.getBody().getId().toString();
        DisclosureRequest request2 = buildDisclosure();
        request2.setId(id);
        request2.setRecipient("error");
        var errorResp = restTemplate.exchange("/disclosure/{id}", HttpMethod.PUT, new HttpEntity<>(request2), String.class, id);
        assertThat(errorResp.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(errorResp.getBody()).isNotNull();
        assertThat(errorResp.getBody()).contains("fieldIsInvalidCodelist -- recipient: ERROR code not found in codelist THIRD_PARTY");
    }

    private DisclosureRequest buildDisclosure() {
        return buildDisclosure("SKATTEETATEN");
    }

    private DisclosureRequest buildDisclosure(String recipient) {
        return DisclosureRequest.builder()
                .name("disc name")
                .description("disc desc").recipient(recipient).recipientPurpose("recipient purpose")
                .start(LocalDate.now().toString()).end(LocalDate.now().toString())
                .legalBasis(createLegalBasisRequest())
                .build();
    }

    private Document createAndSaveDocument() {
        InformationType infoType = createAndSaveInformationType();
        var document = new Document().convertFromRequest(DocumentRequest.builder()
                .name("doc 1").description("desc")
                .informationTypes(List.of(DocumentInfoTypeUseRequest.builder().informationTypeId(infoType.getId().toString()).subjectCategories(List.of("BRUKER")).build()))
                .build());
        return documentRepository.save(document);
    }
}