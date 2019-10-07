package no.nav.data.catalog.backend.app;

import com.github.tomakehurst.wiremock.client.WireMock;
import com.github.tomakehurst.wiremock.http.ContentTypeHeader;
import io.prometheus.client.CollectorRegistry;
import no.nav.data.catalog.backend.app.IntegrationTestBase.Initializer;
import no.nav.data.catalog.backend.app.common.nais.LeaderElectionService;
import no.nav.data.catalog.backend.app.common.utils.JsonUtils;
import no.nav.data.catalog.backend.app.dataset.repo.DatasetRepository;
import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannelRepository;
import no.nav.data.catalog.backend.app.system.SystemRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.util.TestPropertyValues;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.util.SocketUtils;
import org.testcontainers.containers.PostgreSQLContainer;

import java.util.UUID;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.delete;
import static com.github.tomakehurst.wiremock.client.WireMock.equalTo;
import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.matching;
import static com.github.tomakehurst.wiremock.client.WireMock.ok;
import static com.github.tomakehurst.wiremock.client.WireMock.okJson;
import static com.github.tomakehurst.wiremock.client.WireMock.urlPathEqualTo;
import static com.github.tomakehurst.wiremock.client.WireMock.urlPathMatching;

@ActiveProfiles("test")
@ExtendWith(WiremockExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = {AppStarter.class})
@ContextConfiguration(initializers = {Initializer.class})
public abstract class IntegrationTestBase {

    public static final int ELASTICSEARCH_PORT = SocketUtils.findAvailableTcpPort();

    protected static final UUID DATASET_ID_1 = UUID.fromString("acab158d-67ef-4030-a3c2-195e993f18d2");

    private static PostgreSQLContainer postgreSQLContainer = new PostgreSQLContainer("postgres:10.4");
    @Autowired
    protected TransactionTemplate transactionTemplate;
    @Autowired
    protected DistributionChannelRepository distributionChannelRepository;
    @Autowired
    protected SystemRepository systemRepository;
    @Autowired
    protected DatasetRepository datasetRepository;

    static {
        postgreSQLContainer.start();
    }

    @BeforeEach
    public void setUpAbstract() throws Exception {
        WireMock.stubFor(get("/elector").willReturn(okJson(JsonUtils.toJson(LeaderElectionService.getHostInfo()))));
    }

    @AfterEach
    public void teardownAbstract() {
        datasetRepository.deleteAll();
        distributionChannelRepository.deleteAll();
        systemRepository.deleteAll();
        CollectorRegistry.defaultRegistry.clear();
    }

    protected void policyStubbing() {
        WireMock.stubFor(get(urlPathEqualTo("/policy/policy"))
                .withQueryParam("datasetId", equalTo(DATASET_ID_1.toString()))
                .willReturn(aResponse().withStatus(HttpStatus.OK.value())
                        .withHeader(ContentTypeHeader.KEY, "application/json")
                        .withBody("{\"content\":["
                                + "{\"policyId\":1,\"legalBasisDescription\":\"LB description\",\"purpose\":{\"code\":\"KTR\",\"description\":\"Kontroll\"}}"
                                + ",{\"policyId\":2,\"legalBasisDescription\":\"Ftrl. § 11-20\",\"purpose\":{\"code\":\"AAP\",\"description\":\"Arbeidsavklaringspenger\"}}"
                                + "],"
                                + "\"pageable\":{\"sort\":{\"sorted\":false,\"unsorted\":true,\"empty\":true},\"offset\":0,\"pageSize\":20,\"pageNumber\":0,\"unpaged\":false,\"paged\":true},"
                                + "\"last\":false,\"totalPages\":2,\"totalElements\":2,\"size\":10,\"number\":0,"
                                + "\"sort\":{\"sorted\":false,\"unsorted\":true,\"empty\":true},\"first\":true,\"numberOfElements\":2,\"empty\":false}")
                ));
        WireMock.stubFor(delete(urlPathMatching("/policy/policy")).withQueryParam("datasetId", matching("[0-9a-f\\-]{36}")).willReturn(ok()));
    }

    public static class Initializer implements ApplicationContextInitializer<ConfigurableApplicationContext> {

        public void initialize(ConfigurableApplicationContext configurableApplicationContext) {
            TestPropertyValues.of(
                    "spring.datasource.url=" + postgreSQLContainer.getJdbcUrl(),
                    "spring.datasource.username=" + postgreSQLContainer.getUsername(),
                    "spring.datasource.password=" + postgreSQLContainer.getPassword(),
                    "elasticsearch.port=" + ELASTICSEARCH_PORT,
                    "wiremock.server.port=" + WiremockExtension.getWiremock().port()
            ).applyTo(configurableApplicationContext.getEnvironment());
        }
    }
}
