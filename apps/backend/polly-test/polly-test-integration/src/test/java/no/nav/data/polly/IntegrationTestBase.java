package no.nav.data.polly;

import com.github.tomakehurst.wiremock.client.WireMock;
import io.prometheus.client.CollectorRegistry;
import no.nav.data.polly.IntegrationTestBase.Initializer;
import no.nav.data.polly.behandlingsgrunnlag.BehandlingsgrunnlagDistributionRepository;
import no.nav.data.polly.codelist.CodelistStub;
import no.nav.data.polly.common.nais.LeaderElectionService;
import no.nav.data.polly.common.utils.JsonUtils;
import no.nav.data.polly.dataset.Dataset;
import no.nav.data.polly.dataset.DatasetData;
import no.nav.data.polly.dataset.repo.DatasetRepository;
import no.nav.data.polly.kafka.KafkaContainer;
import no.nav.data.polly.kafka.KafkaTopicProperties;
import no.nav.data.polly.kafka.SchemaRegistryContainer;
import no.nav.data.polly.legalbasis.LegalBasis;
import no.nav.data.polly.policy.entities.Policy;
import no.nav.data.polly.policy.repository.PolicyRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.util.TestPropertyValues;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.util.SocketUtils;
import org.testcontainers.containers.PostgreSQLContainer;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.function.BiConsumer;

import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.okJson;
import static no.nav.data.polly.elasticsearch.ElasticsearchStatus.SYNCED;

@ActiveProfiles("test")
@ExtendWith(WiremockExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = {AppStarter.class})
@ContextConfiguration(initializers = {Initializer.class})
public abstract class IntegrationTestBase {

    public static final int ELASTICSEARCH_PORT = SocketUtils.findAvailableTcpPort();

    protected static final UUID DATASET_ID_1 = UUID.fromString("acab158d-67ef-4030-a3c2-195e993f18d2");
    protected static final String LEGAL_BASIS_DESCRIPTION1 = "Legal basis 1";
    protected static final String PURPOSE_CODE1 = "Kontroll";
    protected static final String DATASET_TITLE = "Sivilstand";

    private static PostgreSQLContainer postgreSQLContainer = new PostgreSQLContainer("postgres:10.4");
    @Autowired
    protected TransactionTemplate transactionTemplate;
    @Autowired
    protected DatasetRepository datasetRepository;
    @Autowired
    protected PolicyRepository policyRepository;
    @Autowired
    protected BehandlingsgrunnlagDistributionRepository behandlingsgrunnlagDistributionRepository;
    @Autowired
    protected KafkaTopicProperties topicProperties;

    static {
        postgreSQLContainer.start();
    }

    @BeforeEach
    public void setUpAbstract() throws Exception {
        CodelistStub.initializeCodelist();
        WireMock.stubFor(get("/elector").willReturn(okJson(JsonUtils.toJson(LeaderElectionService.getHostInfo()))));
        policyRepository.deleteAll();
        datasetRepository.deleteAll();
    }

    @AfterEach
    public void teardownAbstract() {
        policyRepository.deleteAll();
        datasetRepository.deleteAll();
        CollectorRegistry.defaultRegistry.clear();
    }

    protected void createPolicy(int rows) {
        createPolicy(rows, (i, p) -> {
        });
    }

    protected void createPolicy(int rows, BiConsumer<Integer, Policy> callback) {
        int i = 0;
        while (i++ < rows) {
            Policy policy = new Policy();
//            policy.setDatasetId(i == 1 ? DATASET_ID_1.toString() : UUID.randomUUID().toString());
//            policy.setDatasetTitle(DATASET_TITLE);
//            policy.setLegalBasisDescription(LEGAL_BASIS_DESCRIPTION1);
            policy.setPurposeCode(PURPOSE_CODE1);
            policy.setStart(LocalDate.now());
            policy.setEnd(LocalDate.now());
            callback.accept(i, policy);
            policyRepository.save(policy);
        }
    }

    protected Policy createPolicy(String purpose, Dataset dataset) {
        return policyRepository.save(Policy.builder().purposeCode(purpose).legalBases(Set.of(new LegalBasis("a", "b", "desc")))
//                .datasetId(dataset.getId().toString()).datasetTitle(dataset.getTitle())
                .start(LocalDate.now()).end(LocalDate.now()).build());
    }

    protected Dataset createDataset() {
        return createDataset(DATASET_ID_1, DATASET_TITLE);
    }

    protected Dataset createDataset(UUID id, String datasetTitle) {
        Dataset dataset = Dataset.builder()
                .id(id)
                .elasticsearchStatus(SYNCED)
                .datasetData(DatasetData.builder()
                        .title(datasetTitle)
                        .description("desc")
                        .provenances(List.of("ARBEIDSGIVER"))
                        .categories(List.of("PERSONALIA"))
                        .pi(true)
                        .build())
                .build();
        return datasetRepository.save(dataset);
    }

    public static class Initializer implements ApplicationContextInitializer<ConfigurableApplicationContext> {

        public void initialize(ConfigurableApplicationContext configurableApplicationContext) {
            TestPropertyValues.of(
                    "spring.datasource.url=" + postgreSQLContainer.getJdbcUrl(),
                    "spring.datasource.username=" + postgreSQLContainer.getUsername(),
                    "spring.datasource.password=" + postgreSQLContainer.getPassword(),
                    "elasticsearch.port=" + ELASTICSEARCH_PORT,
                    "wiremock.server.port=" + WiremockExtension.getWiremock().port(),
                    "KAFKA_BOOTSTRAP_SERVERS=" + KafkaContainer.getAddress(),
                    "KAFKA_SCHEMA_REGISTRY_URL=" + SchemaRegistryContainer.getAddress()
            ).applyTo(configurableApplicationContext.getEnvironment());
        }
    }
}
