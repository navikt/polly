package no.nav.data.polly.document;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.codelist.CodelistStaticService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodelistResponse;
import no.nav.data.polly.document.DocumentController.DocumentPage;
import no.nav.data.polly.document.dto.DocumentInfoTypeUseRequest;
import no.nav.data.polly.document.dto.DocumentInfoTypeUseResponse;
import no.nav.data.polly.document.dto.DocumentRequest;
import no.nav.data.polly.document.dto.DocumentResponse;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.dto.InformationTypeShortResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.UUID;

import static no.nav.data.common.utils.StreamUtils.convert;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.http.HttpEntity.EMPTY;
import static org.springframework.http.HttpMethod.DELETE;

class DocumentControllerIT extends IntegrationTestBase {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void createAndGetDocument() {
        var disc = createDocumentArbeidsgiverWithInformationType();
        var resp = restTemplate.getForEntity("/document/{id}", DocumentResponse.class, disc.getId());

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertResponse(resp);
    }

    private DocumentResponse createDocumentArbeidsgiverWithInformationType() {
        InformationType infoType = createAndSaveInformationType();

        var req = buildDocument();
        req.setInformationTypes(List.of(createInfoTypeUseRequest(infoType.getId().toString())));
        var resp = restTemplate.postForEntity("/document", req, DocumentResponse.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertResponse(resp);
        return resp.getBody();
    }

    private DocumentInfoTypeUseRequest createInfoTypeUseRequest(String informationTypeId) {
        return DocumentInfoTypeUseRequest.builder().informationTypeId(informationTypeId).subjectCategories(List.of("BRUKER")).build();
    }

    private void assertResponse(ResponseEntity<DocumentResponse> resp) {
        InformationType infoType = createAndSaveInformationType();
        var documentResponse = resp.getBody();
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
        restTemplate.postForEntity("/document", buildDocument(), DocumentResponse.class);
        restTemplate.postForEntity("/document", buildDocument(), DocumentResponse.class);
        ResponseEntity<DocumentPage> resp = restTemplate.getForEntity("/document", DocumentPage.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        DocumentPage documentPage = resp.getBody();
        assertThat(documentPage).isNotNull();

        assertThat(documentPage.getContent()).hasSize(2);
    }

    @Test
    void getDocumentByInfoTypeId() {
        restTemplate.postForEntity("/document", buildDocument(), DocumentResponse.class);
        var doc = createDocumentArbeidsgiverWithInformationType();
        ResponseEntity<DocumentPage> resp = restTemplate
                .getForEntity("/document?informationTypeId={infoTypeId}", DocumentPage.class, doc.getInformationTypes().get(0).getInformationTypeId());

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        DocumentPage documentPage = resp.getBody();
        assertThat(documentPage).isNotNull();

        assertThat(documentPage.getContent()).hasSize(1);
    }

    @Test
    void createDocumentValidationError() {

        var resp = restTemplate.postForEntity("/document", DocumentRequest.builder().description("newdocument").build(), String.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(resp.getBody()).contains("fieldIsNullOrMissing -- name was null or missing");
    }

    @Test
    void updateDocument() {
        var infoTypeOne = createAndSaveInformationType(UUID.randomUUID(), "name1");
        var infoTypeTwo = createAndSaveInformationType(UUID.randomUUID(), "name2");

        DocumentRequest create = buildDocument();
        create.setInformationTypes(List.of(createInfoTypeUseRequest(infoTypeOne.getId().toString()), createInfoTypeUseRequest(infoTypeTwo.getId().toString())));

        ResponseEntity<DocumentResponse> resp = restTemplate.postForEntity("/document", create, DocumentResponse.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(resp.getBody()).isNotNull();
        assertThat(resp.getBody().getInformationTypes()).hasSize(2);
        assertThat(convert(resp.getBody().getInformationTypes(), DocumentInfoTypeUseResponse::getInformationTypeId)).contains(infoTypeOne.getId(), infoTypeTwo.getId());

        String id = resp.getBody().getId().toString();
        var infoTypeUpdate = createAndSaveInformationType(UUID.randomUUID(), "name3");
        DocumentRequest update = buildDocument();
        update.setId(id);
        update.setInformationTypes(List.of(createInfoTypeUseRequest(infoTypeOne.getId().toString()), createInfoTypeUseRequest(infoTypeUpdate.getId().toString())));

        resp = restTemplate.exchange("/document/{id}", HttpMethod.PUT, new HttpEntity<>(update), DocumentResponse.class, id);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody()).isNotNull();
        assertThat(resp.getBody().getInformationTypes()).hasSize(2);
        assertThat(convert(resp.getBody().getInformationTypes(), DocumentInfoTypeUseResponse::getInformationTypeId)).contains(infoTypeOne.getId(), infoTypeUpdate.getId());

    }

    @Test
    void updateDocumentValidationError() {
        ResponseEntity<DocumentResponse> resp = restTemplate.postForEntity("/document", buildDocument(), DocumentResponse.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(resp.getBody()).isNotNull();

        String id = resp.getBody().getId().toString();
        DocumentRequest request2 = buildDocument();
        request2.setId(id);
        request2.setName(null);

        var response = restTemplate.exchange("/document/{id}", HttpMethod.PUT, new HttpEntity<>(request2), String.class, id);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).contains("fieldIsNullOrMissing -- name was null or missing");
    }

    @Test
    void delete() {
        InformationType informationType = createAndSaveInformationType();
        var policy = createAndSavePolicy(PURPOSE_CODE1, informationType);
        var disclosure = createDisclosure("BRUKER", "ART61E", null);

        var doc = documentRepository.save(createDocument("BRUKER", informationType.getId()));
        policy.getData().getDocumentIds().add(doc.getId());
        policyRepository.save(policy);

        var resp = restTemplate.exchange("/document/{id}", DELETE, EMPTY, String.class, doc.getId());

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(resp.getBody()).contains("used by 1 policie(s)");
        policyRepository.delete(policy);

        disclosure.getData().setDocumentId(doc.getId());
        disclosureRepository.save(disclosure);
        resp = restTemplate.exchange("/document/{id}", DELETE, EMPTY, String.class, doc.getId());

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(resp.getBody()).contains("used by 1 disclosure(s)");
        disclosureRepository.delete(disclosure);

        assertThat(restTemplate.exchange("/document/{id}", DELETE, EMPTY, String.class, doc.getId()).getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    private DocumentRequest buildDocument() {
        return DocumentRequest.builder()
                .name("Skattedata")
                .description("desc")
                .build();
    }

}