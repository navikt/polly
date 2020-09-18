package no.nav.data.polly.export;

import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.alert.AlertService;
import no.nav.data.polly.alert.dto.PolicyAlert;
import no.nav.data.polly.alert.dto.ProcessAlert;
import no.nav.data.polly.codelist.CodelistStub;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.legalbasis.domain.LegalBasis;
import no.nav.data.polly.policy.domain.LegalBasesUse;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.policy.domain.PolicyData;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessData;
import no.nav.data.polly.process.domain.ProcessStatus;
import no.nav.data.polly.process.domain.repo.ProcessRepository;
import no.nav.data.polly.process.domain.sub.Affiliation;
import no.nav.data.polly.process.domain.sub.DataProcessing;
import no.nav.data.polly.process.domain.sub.Dpia;
import no.nav.data.polly.process.domain.sub.Retention;
import no.nav.data.polly.process.dto.ProcessRequest;
import no.nav.data.polly.teams.ResourceService;
import no.nav.data.polly.teams.TeamService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;


@Slf4j
@ExtendWith(MockitoExtension.class)
public class DocxTest {

    @Mock
    private AlertService alertService;
    @Mock
    private ResourceService resourceService;
    @Mock
    private TeamService teamService;
    @Mock
    private ProcessRepository processRepository;
    @InjectMocks
    private ProcessToDocx processToDocx;

    Process process = createProcess();

    @BeforeEach
    void setUp() {
        CodelistStub.initializeCodelist();
        lenient().when(resourceService.getResource(anyString())).thenReturn(Optional.empty());
        lenient().when(teamService.getTeam(anyString())).thenReturn(Optional.empty());
    }

    @Test
    void createDocForProcess() {
        mockAlert(process);
        var docx = processToDocx.generateDocForProcess(process);
        assertThat(docx).isNotNull();
        write(docx);
    }

    @Test
    void createBatchDoc() {
        List<Process> processes = List.of(createProcess(), createProcess(), createProcess());
        processes.forEach(this::mockAlert);
        when(processRepository.findByPurposeCode("AAP")).thenReturn(processes);
        var docx = processToDocx.generateDocFor(ListName.PURPOSE, "AAP");
        assertThat(docx).isNotNull();
        write(docx);
    }

    @Test
    void testEmptyProcess() {
        CodelistStub.initializeCodelist();
        ProcessRequest req = new ProcessRequest();
        req.setPurposeCode("AAP");
        req.setUpdate(false);
        req.format();

        Process process = new Process().convertFromRequest(req);
        var docx = processToDocx.generateDocForProcess(process);
        assertThat(docx).isNotNull();
    }

    @SneakyThrows
    private void write(byte[] docx) {
        Path tempFile = Files.createTempFile("process", ".docx");
//        Path tempFile = Paths.get("/Users/s143147/process.docx");
        Files.write(tempFile, docx);
        log.info("Written to {}", tempFile.toAbsolutePath());
    }

    private void mockAlert(Process mockProcess) {
        Policy policy = mockProcess.getPolicies().iterator().next();
        when(alertService.checkAlertsForProcess(mockProcess))
                .thenReturn(new ProcessAlert(mockProcess.getId(), false,
                        List.of(new PolicyAlert(policy.getId(), null, false, false, false, true))));
    }

    private Process createProcess() {
        return Process.builder()
                .generateId()
                .name("Saksbehandling")
                .purposeCode("AAP")

                .data(ProcessData.builder()
                        .description(
                                "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.")
                        .legalBases(List.of(
                                LegalBasis.builder().gdpr("ART61C").nationalLaw("FTRL").description("§ 1-1").build(),
                                LegalBasis.builder().gdpr("ART61A").nationalLaw("SAMTYKKE").description("Kapittel 4, siste ledd").build()
                        ))
                        .affiliation(Affiliation.builder()
                                .department("AOT")
                                .subDepartments(List.of("PEN"))
                                .productTeams(List.of("teamdatajegerne"))
                                .products(List.of("TPS", "PESYS"))
                                .build())
                        .usesAllInformationTypes(false)
                        .automaticProcessing(true)
                        .profiling(true)
                        .dataProcessing(DataProcessing.builder()
                                .dataProcessor(true)
                                .dataProcessorOutsideEU(true)
                                .dataProcessorAgreements(List.of("2019-02-44.21"))
                                .transferGroundsOutsideEU("OTHER")
                                .transferGroundsOutsideEUOther("Usikker")
                                .build())
                        .status(ProcessStatus.COMPLETED)
                        .dpia(Dpia.builder()
                                .riskOwner("S145231")
                                .riskOwnerFunction("teamleder")
                                .grounds("Standard grunnlag")
                                .refToDpia("A-2019-04-23")
                                .needForDpia(true)
                                .processImplemented(true)
                                .build())
                        .retention(Retention.builder()
                                .retentionPlan(true)
                                .retentionMonths(37)
                                .retentionStart("saksbehandling")
                                .retentionDescription("Lovverket tilsier så")
                                .build())
                        .start(LocalDate.now().minusDays(1))
                        .end(LocalDate.now().plusMonths(1))
                        .build())

                .policies(Set.of(
                        Policy.builder()
                                .generateId()
                                .informationTypeName("Falsk identitet")
                                .data(PolicyData.builder()
                                        .legalBasesUse(LegalBasesUse.DEDICATED_LEGAL_BASES)
                                        .subjectCategories(List.of("BRUKER", "PARTNER"))
                                        .legalBases(List.of(
                                                LegalBasis.builder().gdpr("ART61C").nationalLaw("FTRL").description("§ 1-1").build()
                                        ))
                                        .build())
                                .build(),
                        Policy.builder()
                                .generateId()
                                .informationTypeName("Personnavn")
                                .data(PolicyData.builder()
                                        .legalBasesUse(LegalBasesUse.DEDICATED_LEGAL_BASES)
                                        .subjectCategories(List.of("ANDRE"))
                                        .legalBases(List.of(
                                                LegalBasis.builder().gdpr("ART61C").nationalLaw("FTRL").description("§ 1-1").build(),
                                                LegalBasis.builder().gdpr("ART61A").nationalLaw("SAMTYKKE").description("Kapittel 4, siste ledd").build()
                                        ))
                                        .build())
                                .build()
                ))

                .build();
    }
}
