package no.nav.data.polly.export;

import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.alert.AlertService;
import no.nav.data.polly.alert.dto.PolicyAlert;
import no.nav.data.polly.alert.dto.ProcessAlert;
import no.nav.data.polly.codelist.CodelistStub;
import no.nav.data.polly.legalbasis.domain.LegalBasis;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.policy.domain.PolicyData;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessData;
import no.nav.data.polly.process.domain.ProcessData.DataProcessing;
import no.nav.data.polly.process.domain.ProcessData.Dpia;
import no.nav.data.polly.process.domain.ProcessData.Retention;
import no.nav.data.polly.process.domain.ProcessStatus;
import no.nav.data.polly.teams.ResourceService;
import no.nav.data.polly.teams.TeamService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.mockito.ArgumentMatchers.anyString;
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
    @InjectMocks
    private ProcessToDocx processToDocx;

    @Test
    void createDocForProcess() throws IOException {
        CodelistStub.initializeCodelist();
        Process process = createProcess();
        Policy policy = process.getPolicies().iterator().next();
        when(alertService.checkAlertsForProcess(process.getId()))
                .thenReturn(new ProcessAlert(process.getId(), List.of(new PolicyAlert(policy.getId(), false, false, true))));
        when(resourceService.getResource(anyString())).thenReturn(Optional.empty());
        when(teamService.getTeam(anyString())).thenReturn(Optional.empty());

        var docx = processToDocx.generateDocForProcess(process);

        Path tempFile = Files.createTempFile("process", ".docx");
//        Path tempFile = Paths.get("/Users/s143147/process.docx");
        Files.write(tempFile, docx);
        log.info("Written to {}", tempFile.toAbsolutePath());
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
                                LegalBasis.builder().gdpr("ART61C").nationalLaw("FTRL").description("§ 1-1")
                                        .end(LocalDate.now().minusWeeks(1))
                                        .build(),
                                LegalBasis.builder().gdpr("ART61A").nationalLaw("SAMTYKKE").description("Kapittel 4, siste ledd").build()
                        ))
                        .department("AOT")
                        .subDepartment("PEN")
                        .productTeam("teamdatajegerne")
                        .products(List.of("TPS", "PESYS"))
                        .usesAllInformationTypes(false)
                        .automaticProcessing(true)
                        .profiling(true)
                        .dataProcessing(DataProcessing.builder()
                                .dataProcessor(true)
                                .dataProcessorOutsideEU(true)
                                .dataProcessorAgreements(List.of("2019-02-44.21"))
                                .build())
                        .status(ProcessStatus.COMPLETED)
                        .dpia(Dpia.builder()
                                .riskOwner("S145231")
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
                                        .subjectCategories(List.of("ANDRE"))
                                        .end(LocalDate.now().minusDays(1))
                                        .legalBases(List.of(
                                                LegalBasis.builder().gdpr("ART61C").nationalLaw("FTRL").description("§ 1-1")
                                                        .start(LocalDate.now().minusDays(5)).end(LocalDate.now().minusDays(2)).build(),
                                                LegalBasis.builder().gdpr("ART61A").nationalLaw("SAMTYKKE").description("Kapittel 4, siste ledd").build()
                                        ))
                                        .build())
                                .build()
                ))

                .build();
    }
}
