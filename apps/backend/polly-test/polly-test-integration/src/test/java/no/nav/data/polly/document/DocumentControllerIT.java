package no.nav.data.polly.document;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.document.DocumentController.DocumentPage;
import no.nav.data.polly.document.dto.DocumentInformationTypeResponse;
import no.nav.data.polly.document.dto.DocumentRequest;
import no.nav.data.polly.document.dto.DocumentResponse;
import no.nav.data.polly.informationtype.domain.InformationType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.UUID;

import static no.nav.data.polly.common.utils.StreamUtils.convert;
import static org.assertj.core.api.Assertions.assertThat;

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
        req.setInformationTypeIds(List.of(infoType.getId().toString()));
        var resp = restTemplate.postForEntity("/document", req, DocumentResponse.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertResponse(resp);
        return resp.getBody();
    }

    private void assertResponse(ResponseEntity<DocumentResponse> resp) {
        InformationType infoType = createAndSaveInformationType();
        var documentResponse = resp.getBody();
        assertThat(documentResponse).isNotNull();

        DocumentInformationTypeResponse infoTypeRes = new DocumentInformationTypeResponse(infoType.getId(), infoType.getData().getName(),
                CodelistService.getCodelistResponse(ListName.SENSITIVITY, infoType.getData().getSensitivity()));

        assertThat(documentResponse).isEqualTo(DocumentResponse.builder()
                .id(documentResponse.getId())
                .name("Skattedata")
                .description("desc")
                .informationTypeIds(List.of(infoTypeRes.getId()))
                .informationTypes(List.of(infoTypeRes))
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
                .getForEntity("/document?informationTypeId={infoTypeId}", DocumentPage.class, doc.getInformationTypeIds().get(0));

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        DocumentPage documentPage = resp.getBody();
        assertThat(documentPage).isNotNull();

        assertThat(documentPage.getContent()).hasSize(1);
    }

    @Test
    void createDocumentValidationError() {
        ResponseEntity<String> resp = restTemplate
                .postForEntity("/document", DocumentRequest.builder().description("newdocument").build(), String.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(resp.getBody()).contains("fieldIsNullOrMissing -- name was null or missing");
    }

    @Test
    void updateDocument() {
        var infoTypeOne = createAndSaveInformationType(UUID.randomUUID(), "name1");
        var infoTypeTwo = createAndSaveInformationType(UUID.randomUUID(), "name2");

        DocumentRequest create = buildDocument();
        create.setInformationTypeIds(List.of(infoTypeOne.getId().toString(), infoTypeTwo.getId().toString()));

        ResponseEntity<DocumentResponse> resp = restTemplate.postForEntity("/document", create, DocumentResponse.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(resp.getBody()).isNotNull();
        assertThat(resp.getBody().getInformationTypes()).hasSize(2);
        assertThat(convert(resp.getBody().getInformationTypes(), DocumentInformationTypeResponse::getId)).contains(infoTypeOne.getId(), infoTypeTwo.getId());

        String id = resp.getBody().getId().toString();
        var infoTypeUpdate = createAndSaveInformationType(UUID.randomUUID(), "name3");
        DocumentRequest update = buildDocument();
        update.setId(id);
        update.setInformationTypeIds(List.of(infoTypeOne.getId().toString(), infoTypeUpdate.getId().toString()));

        resp = restTemplate.exchange("/document", HttpMethod.PUT, new HttpEntity<>(update), DocumentResponse.class, id);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody()).isNotNull();
        assertThat(resp.getBody().getInformationTypes()).hasSize(2);
        assertThat(convert(resp.getBody().getInformationTypes(), DocumentInformationTypeResponse::getId)).contains(infoTypeOne.getId(), infoTypeUpdate.getId());

    }

    @Test
    void updateDocumentValidationError() {
        ResponseEntity<DocumentResponse> resp = restTemplate.postForEntity("/document", buildDocument(), DocumentResponse.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(resp.getBody()).isNotNull();

        String id = resp.getBody().getId().toString();
        var errorResp = restTemplate.exchange("/document", HttpMethod.PUT, new HttpEntity<>(buildDocument()), String.class, id);
        assertThat(errorResp.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(errorResp.getBody()).isNotNull();
        assertThat(errorResp.getBody()).contains("missingIdForUpdate");
    }

    private DocumentRequest buildDocument() {
        return DocumentRequest.builder()
                .name("Skattedata")
                .description("desc")
                .build();
    }

}