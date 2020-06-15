package no.nav.data.polly.dashboard;

import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.LoadingCache;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.alert.domain.AlertRepository;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.dashboard.dto.DashResponse;
import no.nav.data.polly.dashboard.dto.DashResponse.Counter;
import no.nav.data.polly.dashboard.dto.DashResponse.DashResponseBuilder;
import no.nav.data.polly.dashboard.dto.DashResponse.ProcessDashCount;
import no.nav.data.polly.process.domain.ProcessRepository;
import no.nav.data.polly.process.domain.ProcessStatus;
import no.nav.data.polly.process.dto.ProcessStateRequest.ProcessField;
import no.nav.data.polly.process.dto.ProcessStateRequest.ProcessState;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.Objects.requireNonNull;
import static no.nav.data.polly.alert.domain.AlertEventType.MISSING_ARTICLE_6;
import static no.nav.data.polly.alert.domain.AlertEventType.MISSING_ARTICLE_9;
import static no.nav.data.polly.alert.domain.AlertEventType.MISSING_LEGAL_BASIS;
import static no.nav.data.polly.process.domain.ProcessCount.countToMap;

@Slf4j
@RestController
@RequestMapping("/dash")
@Api(value = "Dashboard", tags = {"Dashboard"})
public class DashboardController {

    private final ProcessRepository processRepository;
    private final AlertRepository alertRepository;
    private final LoadingCache<String, DashResponse> dashData;

    public DashboardController(ProcessRepository processRepository, AlertRepository alertRepository) {
        this.processRepository = processRepository;
        this.alertRepository = alertRepository;
        this.dashData = Caffeine.newBuilder()
                .expireAfterWrite(Duration.ofMinutes(1))
                .maximumSize(1).build(k -> calcDash());
    }

    @ApiOperation(value = "Get Dashboard data")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Data fetched", response = DashResponse.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping
    public ResponseEntity<DashResponse> getDashoboardData() {
        return ResponseEntity.ok(requireNonNull(dashData.get("singleton")));
    }

    private DashResponse calcDash() {
        ListName department = ListName.DEPARTMENT;
        var processCounts = countToMap(processRepository.countDepartmentCode(), department);
        var depComplete = countToMap(processRepository.countDepartmentCodeStatus(ProcessStatus.COMPLETED), department);
        var depInProg = countToMap(processRepository.countDepartmentCodeStatus(ProcessStatus.IN_PROGRESS), department);
        var depLegalBasisAlerts = countToMap(
                alertRepository.countDepartmentAlertEvents(
                        List.of(MISSING_LEGAL_BASIS.name(), MISSING_ARTICLE_6.name(), MISSING_ARTICLE_9.name())
                ),
                department);

        var byDepartment = processCounts.entrySet().stream()
                .map(e -> ProcessDashCount.builder()
                        .department(e.getKey())

                        .processes(e.getValue())
                        .processesCompleted(depComplete.get(e.getKey()))
                        .processesInProgress(depInProg.get(e.getKey()))
                        .processesMissingLegalBases(depLegalBasisAlerts.get(e.getKey()))

                        .dpia(getCount(ProcessField.DPIA, e.getValue(), e.getKey()))
                        .profiling(getCount(ProcessField.PROFILING, e.getValue(), e.getKey()))
                        .automation(getCount(ProcessField.AUTOMATION, e.getValue(), e.getKey()))
                        .retention(getCount(ProcessField.RETENTION, e.getValue(), e.getKey()))
                        .build())
                .collect(Collectors.toList());

        long processes = processRepository.count();
        DashResponseBuilder dash = DashResponse.builder()
                .allProcesses(ProcessDashCount.builder()
                        .processes(processes)
                        .processesCompleted(processRepository.countStatus(ProcessStatus.COMPLETED))
                        .processesInProgress(processRepository.countStatus(ProcessStatus.IN_PROGRESS))

                        .processesUsingAllInfoTypes(processRepository.countUsingAllInfoTypes())
                        .processesMissingLegalBases(depLegalBasisAlerts.values().stream().mapToLong(Long::longValue).sum())

                        .dpia(getCount(ProcessField.DPIA, processes, null))
                        .profiling(getCount(ProcessField.PROFILING, processes, null))
                        .automation(getCount(ProcessField.AUTOMATION, processes, null))
                        .retention(getCount(ProcessField.RETENTION, processes, null))
                        .build())
                .departmentProcesses(byDepartment);
        return dash.build();
    }

    private Counter getCount(ProcessField field, long processes, String department) {
        long yes = processRepository.findForState(field, ProcessState.YES, department).size();
        long no = processRepository.findForState(field, ProcessState.NO, department).size();
        return new Counter(yes, no, processes - yes - no);
    }

}
