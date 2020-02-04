package no.nav.data.polly.process;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.process.ProcessReadController.ProcessPage;
import no.nav.data.polly.process.dto.ProcessResponse;
import no.nav.data.polly.process.dto.PurposeCountResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class PurposeControllerIT extends IntegrationTestBase {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void hentBehandlingsgrunnlag() {
        Policy policy = createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());

        ResponseEntity<ProcessPage> resp = restTemplate.getForEntity("/process/purpose/{purpose}", ProcessPage.class, PURPOSE_CODE1);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        ProcessPage purposeResponse = resp.getBody();
        assertThat(purposeResponse).isNotNull();

        assertThat(purposeResponse.getNumberOfElements()).isOne();
        assertThat(purposeResponse.getContent().get(0)).isEqualTo(
                ProcessResponse.builder()
                        .id(policy.getProcess().getId())
                        .name("Auto_" + PURPOSE_CODE1)
                        .description("process description")
                        .purposeCode(PURPOSE_CODE1)
                        .productTeam("teamname")
                        .product(CodelistService.getCodelistResponse(ListName.SYSTEM, "PESYS"))
                        .start(LocalDate.now())
                        .end(LocalDate.now())
                        .legalBasis(legalBasisResponse())
                        .build());
    }

    @Test
    void countPurposes() {
        createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());
        createAndSavePolicy(PURPOSE_CODE1 + 2, createAndSaveInformationType());

        ResponseEntity<PurposeCountResponse> resp = restTemplate.getForEntity("/process/count/purpose", PurposeCountResponse.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        PurposeCountResponse purposeResponse = resp.getBody();
        assertThat(purposeResponse).isNotNull();

        assertThat(purposeResponse).isEqualTo(new PurposeCountResponse(Map.of(PURPOSE_CODE1, 1L, PURPOSE_CODE1 + 2, 1L, PURPOSE_CODE2, 0L)));
    }
}