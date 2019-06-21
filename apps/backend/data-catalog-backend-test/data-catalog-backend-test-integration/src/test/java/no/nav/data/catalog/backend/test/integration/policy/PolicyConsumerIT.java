package no.nav.data.catalog.backend.test.integration.policy;

import no.nav.data.catalog.backend.app.AppStarter;
import no.nav.data.catalog.backend.app.policy.Policy;
import no.nav.data.catalog.backend.app.policy.PolicyConsumer;
import no.nav.data.catalog.backend.test.integration.IntegrationTestConfig;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        classes = {IntegrationTestConfig.class, AppStarter.class})
@ActiveProfiles("itest")
public class PolicyConsumerIT {
    @Autowired
    private PolicyConsumer policyConsumer;

    @Value("${datacatalog.policy.url}")
    private String policyUrl;

    @Test
    public void getPolicyForInformationType1() {
        List<Policy> policiesList = policyConsumer.getPolicyForInformationType(1L);
        assertThat(policiesList.size(), is(2));
    }
}
