package no.nav.data.polly.disclosure;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.disclosure.DisclosureController.DisclosurePage;
import no.nav.data.polly.disclosure.dto.DisclosureInformationTypeResponse;
import no.nav.data.polly.disclosure.dto.DisclosureRequest;
import no.nav.data.polly.disclosure.dto.DisclosureResponse;
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
import java.util.UUID;

import static java.util.Objects.requireNonNull;
import static no.nav.data.polly.common.utils.StreamUtils.convert;
import static org.assertj.core.api.Assertions.assertThat;

class DisclosureControllerIT extends IntegrationTestBase {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void createAndGetDisclosure() {
        var infoType = createInformationType();

        var req = buildDisclosure();
        req.setInformationTypes(List.of(infoType.getId().toString()));
        var resp = restTemplate.postForEntity("/disclosure", req, DisclosureResponse.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertResponse(resp, infoType);

        resp = restTemplate.getForEntity("/disclosure/{id}", DisclosureResponse.class, requireNonNull(resp.getBody()).getId());

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertResponse(resp, infoType);
    }

    private void assertResponse(ResponseEntity<DisclosureResponse> resp, InformationType infoType) {
        var disclosureResponse = resp.getBody();
        assertThat(disclosureResponse).isNotNull();
        assertThat(disclosureResponse).isEqualTo(DisclosureResponse.builder()
                .id(disclosureResponse.getId())
                .description("disc desc")
                .recipient(CodelistService.getCodelistResponse(ListName.SOURCE, "SKATT"))
                .recipientPurpose("recipient purpose")
                .start(LocalDate.now())
                .end(LocalDate.now())
                .legalBasis(legalBasisResponse())
                .informationType(new DisclosureInformationTypeResponse(infoType.getId(), infoType.getData().getName(),
                        CodelistService.getCodelistResponse(ListName.SENSITIVITY, infoType.getData().getSensitivity())))
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
        var infoTypeOne = createInformationType(UUID.randomUUID(), "name1");
        var infoTypeTwo = createInformationType(UUID.randomUUID(), "name2");
        DisclosureRequest create = buildDisclosure();
        create.setInformationTypes(List.of(infoTypeOne.getId().toString(), infoTypeTwo.getId().toString()));

        ResponseEntity<DisclosureResponse> resp = restTemplate.postForEntity("/disclosure", create, DisclosureResponse.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(resp.getBody()).isNotNull();
        assertThat(resp.getBody().getInformationTypes()).hasSize(2);
        assertThat(convert(resp.getBody().getInformationTypes(), DisclosureInformationTypeResponse::getId)).contains(infoTypeOne.getId(), infoTypeTwo.getId());

        String id = resp.getBody().getId().toString();
        var infoTypeUpdate = createInformationType(UUID.randomUUID(), "name3");
        DisclosureRequest update = buildDisclosure();
        update.setId(id);
        update.setInformationTypes(List.of(infoTypeOne.getId().toString(), infoTypeUpdate.getId().toString()));

        resp = restTemplate.exchange("/disclosure", HttpMethod.PUT, new HttpEntity<>(update), DisclosureResponse.class, id);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody()).isNotNull();
        assertThat(resp.getBody().getInformationTypes()).hasSize(2);
        assertThat(convert(resp.getBody().getInformationTypes(), DisclosureInformationTypeResponse::getId)).contains(infoTypeOne.getId(), infoTypeUpdate.getId());
    }

    @Test
    void updateDisclosureValidationError() {
        ResponseEntity<DisclosureResponse> resp = restTemplate.postForEntity("/disclosure", buildDisclosure(), DisclosureResponse.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(resp.getBody()).isNotNull();

        String id = resp.getBody().getId().toString();
        var errorResp = restTemplate.exchange("/disclosure", HttpMethod.PUT, new HttpEntity<>(buildDisclosure()), String.class, id);
        assertThat(errorResp.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(errorResp.getBody()).isNotNull();
        assertThat(errorResp.getBody()).contains("missingIdForUpdate");
    }

    private DisclosureRequest buildDisclosure() {
        return DisclosureRequest.builder()
                .description("disc desc").recipient("SKATT").recipientPurpose("recipient purpose")
                .start(LocalDate.now().toString()).end(LocalDate.now().toString())
                .legalBasis(createLegalBasisRequest())
                .build();
    }
}