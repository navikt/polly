package no.nav.data.polly;

import com.github.tomakehurst.wiremock.client.WireMock;
import io.prometheus.client.CollectorRegistry;
import no.nav.data.polly.IntegrationTestBase.Initializer;
import no.nav.data.polly.behandlingsgrunnlag.BehandlingsgrunnlagDistributionRepository;
import no.nav.data.polly.codelist.CodelistStub;
import no.nav.data.polly.common.nais.LeaderElectionService;
import no.nav.data.polly.common.utils.JsonUtils;
import no.nav.data.polly.informationtype.InformationTypeRepository;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.domain.InformationTypeData;
import no.nav.data.polly.kafka.KafkaContainer;
import no.nav.data.polly.kafka.KafkaTopicProperties;
import no.nav.data.polly.kafka.SchemaRegistryContainer;
import no.nav.data.polly.legalbasis.LegalBasis;
import no.nav.data.polly.policy.entities.Policy;
import no.nav.data.polly.policy.repository.PolicyRepository;
import no.nav.data.polly.process.Process;
import no.nav.data.polly.process.ProcessRepository;
import no.nav.data.polly.term.TermRepository;
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

    protected static final UUID INFORMATION_TYPE_ID_1 = UUID.fromString("fe566351-da4d-43b0-a2e9-b09e41ff8aa7");
    protected static final String LEGAL_BASIS_DESCRIPTION1 = "Legal basis 1";
    protected static final String PURPOSE_CODE1 = "Kontroll";
    protected static final String INFORMATION_TYPE_NAME = "Sivilstand";

    private static PostgreSQLContainer postgreSQLContainer = new PostgreSQLContainer("postgres:10.4");
    @Autowired
    protected TransactionTemplate transactionTemplate;
    @Autowired
    protected InformationTypeRepository informationTypeRepository;
    @Autowired
    protected TermRepository termRepository;
    @Autowired
    protected ProcessRepository processRepository;
    @Autowired
    protected PolicyRepository policyRepository;
    @Autowired
    protected BehandlingsgrunnlagDistributionRepository behandlingsgrunnlagDistributionRepository;
    @Autowired
    protected KafkaTopicProperties topicProperties;

    static {
        postgreSQLContainer.start();
    }

    private Process process;
    private InformationType informationType;

    @BeforeEach
    public void setUpAbstract() {
        CodelistStub.initializeCodelist();
        WireMock.stubFor(get("/elector").willReturn(okJson(JsonUtils.toJson(LeaderElectionService.getHostInfo()))));

        policyRepository.deleteAll();
        informationTypeRepository.deleteAll();
        termRepository.deleteAll();
        processRepository.deleteAll();
    }

    @AfterEach
    public void teardownAbstract() {
        policyRepository.deleteAll();
        informationTypeRepository.deleteAll();
        termRepository.deleteAll();
        processRepository.deleteAll();
        CollectorRegistry.defaultRegistry.clear();
    }

    protected void createPolicy(int rows) {
        createPolicy(rows, (i, p) -> {
        });
    }

    protected void createPolicy(int rows, BiConsumer<Integer, Policy> callback) {
        int i = 0;
        while (i++ < rows) {
            Policy policy = createPolicy(PURPOSE_CODE1, createInformationType());
            callback.accept(i, policy);
            policyRepository.save(policy);
        }
    }

    protected Policy createPolicy(String purpose, InformationType informationType) {
        Policy policy = Policy.builder()
                .generateId()
                .purposeCode(purpose)
                .legalBases(List.of(new LegalBasis("a", "b", "desc")))
                .informationType(informationType).informationTypeName(informationType.getData().getName())
                .subjectCategories("Bror")
                .start(LocalDate.now()).end(LocalDate.now()).build();
        createProcess().addPolicy(policy);
        return policyRepository.save(policy);
    }

    protected InformationType createInformationType() {
        if (informationType == null) {
            informationType = informationTypeRepository.save(createInformationType(INFORMATION_TYPE_ID_1, INFORMATION_TYPE_NAME));
        }
        return informationType;
    }

    protected InformationType createInformationType(UUID id, String name) {
        InformationType informationType = InformationType.builder()
                .id(id)
                .elasticsearchStatus(SYNCED)
                .data(InformationTypeData.builder()
                        .name(name)
                        .context("context")
                        .description("desc")
                        .source("ARBEIDSGIVER")
                        .category("PERSONALIA")
                        .pii("loads")
                        .build())
                .build();
        return informationTypeRepository.save(informationType);
    }

    protected Process createProcess() {
        if (process == null) {
            process = processRepository.save(Process.builder().generateId().name("Auto").build());
        }
        return process;
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
