package no.nav.data.polly;

import com.github.tomakehurst.wiremock.client.WireMock;
import io.prometheus.client.CollectorRegistry;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.AppStarter;
import no.nav.data.common.auditing.domain.AuditVersionRepository;
import no.nav.data.common.nais.LeaderElectionService;
import no.nav.data.common.storage.domain.GenericStorageRepository;
import no.nav.data.common.utils.JsonUtils;
import no.nav.data.polly.IntegrationTestBase.Initializer;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.CodelistStub;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.disclosure.domain.Disclosure;
import no.nav.data.polly.disclosure.domain.DisclosureData;
import no.nav.data.polly.disclosure.domain.DisclosureRepository;
import no.nav.data.polly.document.domain.Document;
import no.nav.data.polly.document.domain.DocumentData;
import no.nav.data.polly.document.domain.DocumentData.InformationTypeUse;
import no.nav.data.polly.document.domain.DocumentRepository;
import no.nav.data.polly.informationtype.InformationTypeRepository;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.domain.InformationTypeData;
import no.nav.data.polly.kafka.KafkaContainer;
import no.nav.data.polly.kafka.KafkaTopicProperties;
import no.nav.data.polly.kafka.SchemaRegistryContainer;
import no.nav.data.polly.legalbasis.domain.LegalBasis;
import no.nav.data.polly.legalbasis.dto.LegalBasisRequest;
import no.nav.data.polly.legalbasis.dto.LegalBasisResponse;
import no.nav.data.polly.policy.domain.LegalBasesUse;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.policy.domain.PolicyData;
import no.nav.data.polly.policy.domain.PolicyRepository;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessData;
import no.nav.data.polly.process.domain.ProcessStatus;
import no.nav.data.polly.process.domain.repo.ProcessDistributionRepository;
import no.nav.data.polly.process.domain.repo.ProcessRepository;
import no.nav.data.polly.process.domain.sub.DataProcessing;
import no.nav.data.polly.process.domain.sub.Dpia;
import no.nav.data.polly.process.domain.sub.Retention;
import no.nav.data.polly.process.dto.ProcessResponse;
import no.nav.data.polly.process.dto.ProcessResponse.ProcessResponseBuilder;
import no.nav.data.polly.process.dto.sub.DataProcessingResponse;
import no.nav.data.polly.process.dto.sub.DpiaResponse;
import no.nav.data.polly.process.dto.sub.RetentionResponse;
import no.nav.data.polly.term.catalog.CatalogTerm;
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

@Slf4j
@ActiveProfiles("test")
@ExtendWith(WiremockExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = {AppStarter.class})
@ContextConfiguration(initializers = {Initializer.class})
public abstract class IntegrationTestBase {

    protected static final UUID INFORMATION_TYPE_ID_1 = UUID.fromString("fe566351-da4d-43b0-a2e9-b09e41ff8aa7");
    protected static final String PROCESS_NAME_1 = "Saksbehandling";
    protected static final UUID PROCESS_ID_1 = UUID.fromString("60db8589-f383-4405-82f1-148b0333899b");
    protected static final UUID PROCESS_ID_2 = UUID.fromString("0045b96b-8af8-4b1f-8bc5-81a6bde8506d");
    protected static final String PURPOSE_CODE1 = "KONTROLL";
    protected static final String PURPOSE_CODE2 = "AAP";
    protected static final String INFORMATION_TYPE_NAME = "Sivilstand";

    private static final PostgreSQLContainer<?> postgreSQLContainer = new PostgreSQLContainer<>("postgres:11.3");
    @Autowired
    protected TransactionTemplate transactionTemplate;
    @Autowired
    protected InformationTypeRepository informationTypeRepository;
    @Autowired
    protected ProcessRepository processRepository;
    @Autowired
    protected PolicyRepository policyRepository;
    @Autowired
    protected ProcessDistributionRepository processDistributionRepository;
    @Autowired
    protected DisclosureRepository disclosureRepository;
    @Autowired
    protected DocumentRepository documentRepository;
    @Autowired
    protected GenericStorageRepository genericStorageRepository;
    @Autowired
    protected AuditVersionRepository auditRepository;
    @Autowired
    protected KafkaTopicProperties topicProperties;

    static {
        postgreSQLContainer.start();
    }

    private final Map<String, Process> process = new HashMap<>();
    private InformationType informationType;

    @BeforeEach
    public void setUpAbstract() {
        CodelistStub.initializeCodelist();
        WireMock.stubFor(get("/elector").willReturn(okJson(JsonUtils.toJson(LeaderElectionService.getHostInfo()))));
        mockTerms();
        delete();
    }

    @AfterEach
    public void teardownAbstract() {
        delete();
        CollectorRegistry.defaultRegistry.clear();
    }

    private void delete() {
        genericStorageRepository.deleteAll();
        disclosureRepository.deleteAll();
        documentRepository.deleteAll();
        policyRepository.deleteAll();
        informationTypeRepository.deleteAll();
        processRepository.deleteAll();
    }

    protected List<Policy> createAndSavePolicy(int rows) {
        return createAndSavePolicy(rows, (i, p) -> {
        });
    }

    protected List<Policy> createAndSavePolicy(int rows, BiConsumer<Integer, Policy> callback) {
        return IntStream.range(0, rows).mapToObj(i -> {
            Policy policy = createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());
            callback.accept(i, policy);
            policyRepository.save(policy);
            processRepository.save(policy.getProcess());
            return policy;
        }).collect(Collectors.toList());
    }

    protected Policy createAndSavePolicy(String purpose, InformationType informationType) {
        Policy policy = createPolicy(purpose, "BRUKER", List.of(createLegalBasis()));
        policy.setInformationType(informationType);
        return addPolicy(createAndSaveProcess(purpose), policy);
    }

    protected Policy addPolicy(Process process, Policy policy) {
        process.addPolicy(policy);
        return policyRepository.save(policy);
    }

    protected Policy createPolicy(String purpose, String subjectCategory, List<LegalBasis> legalBases) {
        return Policy.builder()
                .generateId()
                .purposeCode(purpose)
                .data(PolicyData.builder()
                        .legalBasesUse(LegalBasesUse.DEDICATED_LEGAL_BASES)
                        .subjectCategories(List.of(subjectCategory))
                        .legalBases(legalBases)
                        .documentIds(List.of(UUID.fromString("fc32176b-dbee-42be-b16f-eaddd483bf77")))
                        .build())
                .build();
    }

    protected InformationType createInformationType(UUID id, String name, String sensitivity, String system, String category, String source) {
        InformationType informationType = InformationType.builder()
                .id(id)
                .termId("term")
                .data(InformationTypeData.builder()
                        .name(name)
                        .description("desc")
                        .sensitivity(sensitivity)
                        .orgMaster(system)
                        .category(category)
                        .source(source)
                        .build())
                .build();
        informationType.preUpdate();
        return informationType;
    }

    protected InformationType createAndSaveInformationType() {
        if (informationType == null) {
            informationType = createAndSaveInformationType(INFORMATION_TYPE_ID_1, INFORMATION_TYPE_NAME);
        }
        return informationType;
    }

    protected InformationType createAndSaveInformationType(UUID id, String name) {
        return createAndSaveInformationType(id, name, "POL");
    }

    protected InformationType createAndSaveInformationType(String name, String sensitivity) {
        return createAndSaveInformationType(UUID.randomUUID(), name, sensitivity);
    }

    protected InformationType createAndSaveInformationType(UUID id, String name, String sensitivity) {
        InformationType informationType = createInformationType(id, name, sensitivity, "TPS", "PERSONALIA", "SKATT");
        return informationTypeRepository.save(informationType);
    }

    protected InformationType createInformationType(String name, String sensitivity, String system, String category, String source) {
        return createInformationType(UUID.randomUUID(), name, sensitivity, system, category, source);
    }

    protected Process createProcess(String name, String purpose, String department, String subDepartment, List<LegalBasis> legalBases, String product,
            String commonExternalProcessResponsible, String transferGroundsOutsideEU) {
        return processRepository.save(Process.builder()
                .generateId()
                .name(name)
                .purposeCode(purpose)
                .data(ProcessData.builder()
                        .start(LocalDate.now()).end(LocalDate.now())
                        .department(department)
                        .subDepartment(subDepartment)
                        .commonExternalProcessResponsible(commonExternalProcessResponsible)
                        .productTeams(List.of("ProductTeam"))
                        .products(List.of(product))
                        .legalBases(legalBases)
                        .dataProcessing(DataProcessing.builder().dataProcessor(true).dataProcessorOutsideEU(true).transferGroundsOutsideEU(transferGroundsOutsideEU).build())
                        .build())
                .build());
    }

    protected Process createAndSaveProcess(String purpose) {
        return process.computeIfAbsent(purpose,
                (p) -> processRepository
                        .save(Process.builder().generateId().name("Auto_" + purpose).purposeCode(purpose)
                                .data(ProcessData.builder()
                                        .description("process description")
                                        .productTeams(List.of("teamid1"))
                                        .products(List.of("PESYS"))
                                        .department("DEP")
                                        .subDepartment("SUBDEP")
                                        .commonExternalProcessResponsible("SKATT")
                                        .start(LocalDate.now()).end(LocalDate.now()).legalBasis(createLegalBasis())
                                        .usesAllInformationTypes(true)
                                        .automaticProcessing(true)
                                        .profiling(true)
                                        .dataProcessing(DataProcessing.builder().dataProcessor(true).dataProcessorAgreements(List.of("X")).dataProcessorOutsideEU(true)
                                                .transferGroundsOutsideEU("OTHER").transferGroundsOutsideEUOther("pretend its ok")
                                                .transferCountries(List.of("FJI"))
                                                .build())
                                        .retention(Retention.builder().retentionPlan(true).retentionMonths(24).retentionStart("Birth").retentionDescription("ret desc").build())
                                        .dpia(Dpia.builder().needForDpia(true).refToDpia("ref123").grounds("default").processImplemented(true).riskOwner("A123457")
                                                .riskOwnerFunction("teamlead").build())
                                        .status(ProcessStatus.IN_PROGRESS)
                                        .build())
                                .build()));
    }

    protected Disclosure createDisclosure(String recipientCode, String gdpr, String nationalLaw) {
        return Disclosure.builder()
                .generateId()
                .data(DisclosureData.builder()
                        .description("disc desc")
                        .recipient(recipientCode)
                        .recipientPurpose("recipient purpose")
                        .start(LocalDate.now()).end(LocalDate.now())
                        .legalBasis(createLegalBasis(gdpr, nationalLaw, "§ 2-1"))
                        .build())
                .build();
    }

    protected Document createDocument(String subjectCategory, UUID informationTypeId) {
        return Document.builder()
                .generateId()
                .data(DocumentData.builder()
                        .name("doc name")
                        .description("doc desc")
                        .informationTypes(List.of(InformationTypeUse.builder()
                                .informationTypeId(informationTypeId)
                                .subjectCategories(List.of(subjectCategory))
                                .build()))
                        .build())
                .build();
    }

    protected LegalBasisRequest createLegalBasisRequest() {
        return LegalBasisRequest.builder().gdpr("ART61A").nationalLaw("FTRL").description("§ 2-1").build();
    }

    protected LegalBasis createLegalBasis(String gdpr, String nationalLaw, String description) {
        return LegalBasis.builder().gdpr(gdpr).nationalLaw(nationalLaw).description(description).build();
    }

    protected LegalBasis createLegalBasis() {
        return createLegalBasisRequest().convertToDomain();
    }

    protected LegalBasisResponse legalBasisResponse() {
        return createLegalBasis().convertToResponse();
    }

    protected ProcessResponseBuilder processResponseBuilder(UUID processId) {
        return ProcessResponse.builder()
                .id(processId)
                .name("Auto_" + PURPOSE_CODE1)
                .description("process description")
                .purpose(CodelistService.getCodelistResponse(ListName.PURPOSE, PURPOSE_CODE1))
                .purposeCode(PURPOSE_CODE1)
                .productTeam("teamid1")
                .product(CodelistService.getCodelistResponse(ListName.SYSTEM, "PESYS"))
                .department(CodelistService.getCodelistResponse(ListName.DEPARTMENT, "DEP"))
                .subDepartment(CodelistService.getCodelistResponse(ListName.SUB_DEPARTMENT, "SUBDEP"))
                .commonExternalProcessResponsible(CodelistService.getCodelistResponse(ListName.THIRD_PARTY, "SKATT"))
                .start(LocalDate.now())
                .end(LocalDate.now())
                .legalBasis(legalBasisResponse())
                .usesAllInformationTypes(true)
                .automaticProcessing(true)
                .profiling(true)
                .dataProcessing(DataProcessingResponse.builder()
                        .dataProcessor(true)
                        .dataProcessorAgreements(List.of("X"))
                        .dataProcessorOutsideEU(true)
                        .transferGroundsOutsideEU(CodelistService.getCodelistResponse(ListName.TRANSFER_GROUNDS_OUTSIDE_EU, "OTHER"))
                        .transferGroundsOutsideEUOther("pretend its ok")
                        .transferCountries(List.of("FJI"))
                        .build())
                .retention(RetentionResponse.builder()
                        .retentionPlan(true)
                        .retentionMonths(24)
                        .retentionStart("Birth")
                        .retentionDescription("ret desc")
                        .build())
                .dpia(DpiaResponse.builder()
                        .needForDpia(true)
                        .refToDpia("ref123")
                        .grounds("default")
                        .processImplemented(true)
                        .riskOwner("A123457")
                        .riskOwnerFunction("teamlead")
                        .build())
                .status(ProcessStatus.IN_PROGRESS)
                ;
    }

    private void mockTerms() {
        CatalogTerm termOne = CatalogTerm.builder().id("term").term("new term").description("description").build();
        CatalogTerm termTwo = CatalogTerm.builder().id("term2").term("term old").description("description").build();
        WireMock.stubFor(get("/termcatalog/terms/search?term_name=term")
                .willReturn(okJson(JsonUtils.toJson(List.of(termOne, termTwo)))));

        WireMock.stubFor(get("/termcatalog/term/prop/term").willReturn(okJson(JsonUtils.toJson(List.of(termOne)))));
    }

    public static class Initializer implements ApplicationContextInitializer<ConfigurableApplicationContext> {

        public void initialize(ConfigurableApplicationContext configurableApplicationContext) {
            TestPropertyValues.of(
                    "spring.datasource.url=" + postgreSQLContainer.getJdbcUrl(),
                    "spring.datasource.username=" + postgreSQLContainer.getUsername(),
                    "spring.datasource.password=" + postgreSQLContainer.getPassword(),
                    "wiremock.server.port=" + WiremockExtension.port(),
                    "KAFKA_BOOTSTRAP_SERVERS=" + KafkaContainer.getAddress(),
                    "KAFKA_SCHEMA_REGISTRY_URL=" + SchemaRegistryContainer.getAddress()
            ).applyTo(configurableApplicationContext.getEnvironment());
        }
    }
}
