package no.nav.data.catalog.backend.test.integration.policy;

import no.nav.data.catalog.backend.app.AppStarter;
import no.nav.data.catalog.backend.app.codelist.CodeResponse;
import no.nav.data.catalog.backend.app.policy.PolicyConsumer;
import no.nav.data.catalog.backend.app.policy.PolicyResponse;
import no.nav.data.catalog.backend.test.integration.IntegrationTestBase;
import no.nav.data.catalog.backend.test.integration.IntegrationTestConfig;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cloud.contract.wiremock.AutoConfigureWireMock;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE,
        classes = {IntegrationTestConfig.class, AppStarter.class})
@ActiveProfiles("test")
@AutoConfigureWireMock(port = 0)
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
