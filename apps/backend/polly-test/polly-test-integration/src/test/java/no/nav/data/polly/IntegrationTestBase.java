package no.nav.data.polly;

import com.github.tomakehurst.wiremock.client.WireMock;
import io.prometheus.client.CollectorRegistry;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.IntegrationTestBase.Initializer;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.CodelistStub;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.common.nais.LeaderElectionService;
import no.nav.data.polly.common.utils.JsonUtils;
import no.nav.data.polly.informationtype.InformationTypeRepository;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.domain.InformationTypeData;
import no.nav.data.polly.kafka.KafkaContainer;
import no.nav.data.polly.kafka.KafkaTopicProperties;
import no.nav.data.polly.kafka.SchemaRegistryContainer;
import no.nav.data.polly.legalbasis.domain.LegalBasis;
import no.nav.data.polly.legalbasis.dto.LegalBasisResponse;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.policy.domain.PolicyRepository;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessData;
import no.nav.data.polly.process.domain.ProcessDistributionRepository;
import no.nav.data.polly.process.domain.ProcessRepository;
import no.nav.data.polly.term.domain.Term;
import no.nav.data.polly.term.domain.TermRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.util.TestPropertyValues;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.util.SocketUtils;
import org.testcontainers.containers.PostgreSQLContainer;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.BiConsumer;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.okJson;
import static no.nav.data.polly.elasticsearch.domain.ElasticsearchStatus.SYNCED;

@Slf4j
@ActiveProfiles("test")
@ExtendWith(WiremockExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = {AppStarter.class})
@ContextConfiguration(initializers = {Initializer.class})
public abstract class IntegrationTestBase {

    public static final int ELASTICSEARCH_PORT = SocketUtils.findAvailableTcpPort();

    protected static final UUID INFORMATION_TYPE_ID_1 = UUID.fromString("fe566351-da4d-43b0-a2e9-b09e41ff8aa7");
    protected static final String PROCESS_NAME_1 = "Saksbehandling";
    protected static final String PURPOSE_CODE1 = "KONTROLL";
    protected static final String PURPOSE_CODE2 = "AAP";
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
    protected ProcessDistributionRepository processDistributionRepository;
    @Autowired
    protected KafkaTopicProperties topicProperties;
    @Autowired
    protected TestRestTemplate restTemplate;

    static {
        postgreSQLContainer.start();
    }

    private Map<String, Process> process = new HashMap<>();
    private Map<String, Term> terms = new HashMap<>();
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

    protected List<Policy> createPolicy(int rows) {
        return createPolicy(rows, (i, p) -> {
        });
    }

    protected List<Policy> createPolicy(int rows, BiConsumer<Integer, Policy> callback) {
        return IntStream.range(0, rows).mapToObj(i -> {
            Policy policy = createPolicy(PURPOSE_CODE1, createInformationType());
            callback.accept(i, policy);
            policyRepository.save(policy);
            processRepository.save(policy.getProcess());
            return policy;
        }).collect(Collectors.toList());
    }

    protected Policy createPolicy(String purpose, InformationType informationType) {
        Policy policy = Policy.builder()
                .generateId()
                .purposeCode(purpose)
                .legalBasis(createLegalBasis())
                .informationType(informationType).informationTypeName(informationType.getData().getName())
                .subjectCategory("BRUKER")
                .activeToday()
                .build();
        createAndSaveProcess(purpose).addPolicy(policy);
        return policyRepository.save(policy);
    }

    protected Policy createPolicy(String purpose, String subjectCategory, List<LegalBasis> legalBases) {
        return Policy.builder()
                .generateId()
                .purposeCode(purpose)
                .subjectCategory(subjectCategory)
                .activeToday()
                .legalBases(legalBases)
                .build();
    }

    protected InformationType createInformationType() {
        if (informationType == null) {
            informationType = informationTypeRepository.save(createInformationType(INFORMATION_TYPE_ID_1, INFORMATION_TYPE_NAME));
        }
        return informationType;
    }

    protected InformationType createInformationType(UUID id, String name, String sensitivity, String system, String category, String source){
        InformationType informationType = InformationType.builder()
                .id(id)
                .elasticsearchStatus(SYNCED)
                .data(InformationTypeData.builder()
                        .name(name)
                        .description("desc")
                        .sensitivity(sensitivity)
                        .navMaster(system)
                        .category(category)
                        .source(source)
                        .build())
                .build();
        informationType.preUpdate();
        createTerm("term").addInformationType(informationType);
        return informationType;
    }

    protected InformationType createInformationType(UUID id, String name) {
        InformationType informationType = createInformationType(id, name, "PERSONOPPLYSNINGER", "TPS", "PERSONALIA", "SKATT");
        return informationTypeRepository.save(informationType);
    }

    protected InformationType createInformationType(String name, String sensitivity, String system, String category, String source) {
        return createInformationType(UUID.randomUUID(), name, sensitivity, system, category, source);
    }

    protected Process createProcess(String name, String purpose, String department, String subDepartment, List<LegalBasis> legalBases) {
        return processRepository.save(Process.builder()
                .generateId()
                .name(name)
                .purposeCode(purpose)
                .data(ProcessData.builder()
                        .start(LocalDate.now()).end(LocalDate.now())
                        .department(department)
                        .subDepartment(subDepartment)
                        .productTeam("ProductTeam")
                        .legalBases(legalBases)
                        .build())
                .build());
    }

    protected Process createAndSaveProcess(String purpose) {
        return process.computeIfAbsent(purpose,
                (p) -> processRepository
                        .save(Process.builder().generateId().name("Auto_" + purpose).purposeCode(purpose)
                                .data(ProcessData.builder()
                                        .start(LocalDate.now()).end(LocalDate.now()).legalBasis(createLegalBasis())
                                        .build())
                                .build()));
    }

    protected Term createTerm(String term) {
        return terms.computeIfAbsent(term,
                (t) -> termRepository.save(Term.builder().generateId().name("Auto_" + term).description("termdesc").build()));
    }

    protected LegalBasis createLegalBasis(String gdpr, String nationalLaw, String description) {
        return LegalBasis.builder().gdpr(gdpr).nationalLaw(nationalLaw).description(description).activeToday().build();
    }

    protected LegalBasis createLegalBasis() {
        return createLegalBasis("ART61A", "FTRL", "§ 2-1");
    }

    protected LegalBasisResponse legalBasisResponse() {
        return LegalBasisResponse.builder()
                .gdpr(CodelistService.getCodelistResponse(ListName.GDPR_ARTICLE, "ART61A"))
                .nationalLaw(CodelistService.getCodelistResponse(ListName.NATIONAL_LAW, "FTRL"))
                .description("§ 2-1")
                .start(LocalDate.now())
                .end(LocalDate.now())
                .build();
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

    public <T> List<T> exchangeAsList(String uri, ParameterizedTypeReference<List<T>> responseType) {
        return restTemplate.exchange(uri, HttpMethod.GET, null, responseType).getBody();
    }
}
