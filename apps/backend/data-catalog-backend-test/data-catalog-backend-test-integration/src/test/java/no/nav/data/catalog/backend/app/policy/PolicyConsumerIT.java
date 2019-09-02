package no.nav.data.catalog.backend.app.policy;

import no.nav.data.catalog.backend.app.AppStarter;
import no.nav.data.catalog.backend.app.IntegrationTestBase;
import no.nav.data.catalog.backend.app.codelist.CodeResponse;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE,
        classes = {AppStarter.class})
public class PolicyConsumerIT extends IntegrationTestBase {

    @Autowired
    private PolicyConsumer policyConsumer;

    @Value("${datacatalog.policy.url}")
    private String policyUrl;

    @Test
    public void getPolicyForDatasetId1() {
        policyStubbing();
        List<PolicyResponse> policiesList = policyConsumer.getPolicyForDataset(DATASET_ID_1);
        assertThat(policiesList.size(), is(2));
        assertPolicy0(policiesList.get(0));
        assertPolicy1(policiesList.get(1));
    }

    private void assertPolicy0(PolicyResponse policy) {
        assertThat(policy.getPolicyId(), is(1L));
        assertThat(policy.getLegalBasisDescription(), is("LB description"));
        assertThat(policy.getPurpose(), is(new CodeResponse("KTR", "Kontroll")));
    }

    private void assertPolicy1(PolicyResponse policy) {
        assertThat(policy.getPolicyId(), is(2L));
        assertThat(policy.getLegalBasisDescription(), is("Ftrl. § 11-20"));
        assertThat(policy.getPurpose(), is(new CodeResponse("AAP", "Arbeidsavklaringspenger")));
    }

}
