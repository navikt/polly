package no.nav.data.polly.policy;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.codelist.CodeResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;


class PolicyConsumerIT extends IntegrationTestBase {

    @Autowired
    private PolicyConsumer policyConsumer;

    @Value("${datacatalog.policy.url}")
    private String policyUrl;

    @Test
    void getPolicyForDatasetId1() {
        policyStubbing();
        List<PolicyResponse> policiesList = policyConsumer.getPolicyForDataset(DATASET_ID_1);
        assertThat(policiesList.size()).isEqualTo(2);
        assertPolicy0(policiesList.get(0));
        assertPolicy1(policiesList.get(1));
    }

    private void assertPolicy0(PolicyResponse policy) {
        assertThat(policy.getPolicyId()).isEqualTo(1L);
        assertThat(policy.getLegalBasisDescription()).isEqualTo("LB description");
        assertThat(policy.getPurpose()).isEqualTo(new CodeResponse("KTR", "Kontroll"));
    }

    private void assertPolicy1(PolicyResponse policy) {
        assertThat(policy.getPolicyId()).isEqualTo(2L);
        assertThat(policy.getLegalBasisDescription()).isEqualTo("Ftrl. § 11-20");
        assertThat(policy.getPurpose()).isEqualTo(new CodeResponse("AAP", "Arbeidsavklaringspenger"));
    }

}
