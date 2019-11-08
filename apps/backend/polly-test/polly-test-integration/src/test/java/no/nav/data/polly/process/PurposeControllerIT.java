package no.nav.data.polly.process;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodeResponse;
import no.nav.data.polly.informationtype.dto.InformationTypeNameResponse;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.policy.dto.PolicyResponse;
import no.nav.data.polly.process.ProcessReadController.ProcessPolicyPage;
import no.nav.data.polly.process.dto.ProcessPolicyResponse;
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
        Policy policy = createPolicy(PURPOSE_CODE1, createInformationType());

        ResponseEntity<ProcessPolicyPage> resp = restTemplate.getForEntity("/process/purpose/{purpose}", ProcessPolicyPage.class, PURPOSE_CODE1);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        ProcessPolicyPage purposeResponse = resp.getBody();
        assertThat(purposeResponse).isNotNull();

        assertThat(purposeResponse.getNumberOfElements()).isOne();
        assertThat(purposeResponse.getContent().get(0)).isEqualTo(
                ProcessPolicyResponse.builder()
                        .id(policy.getProcess().getId().toString())
                        .name("Auto_" + PURPOSE_CODE1)
                        .purposeCode(PURPOSE_CODE1)
                        .start(LocalDate.now())
                        .end(LocalDate.now())
                        .legalBasis(legalBasisResponse())
                        .policy(PolicyResponse.builder()
                                .id(policy.getId())
                                .process(policy.getProcess().getName())
                                .purposeCode(new CodeResponse(PURPOSE_CODE1, "Kontrollering"))
                                .informationType(new InformationTypeNameResponse(createInformationType().getId().toString(), INFORMATION_TYPE_NAME))
                                .subjectCategory(CodelistService.getCodeResponse(ListName.SUBJECT_CATEGORY, policy.getSubjectCategory()))
                                .start(policy.getStart())
                                .end(policy.getEnd())
                                .legalBasis(legalBasisResponse())
                                .build())
                        .build());

    }

    @Test
    void countPurposes() {
        createPolicy(PURPOSE_CODE1, createInformationType());
        createPolicy(PURPOSE_CODE1 + 2, createInformationType());

        ResponseEntity<PurposeCountResponse> resp = restTemplate.getForEntity("/process/count/purpose", PurposeCountResponse.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        PurposeCountResponse purposeResponse = resp.getBody();
        assertThat(purposeResponse).isNotNull();

        assertThat(purposeResponse).isEqualTo(new PurposeCountResponse(Map.of(PURPOSE_CODE1, 1L, PURPOSE_CODE1 + 2, 1L)));
    }
}