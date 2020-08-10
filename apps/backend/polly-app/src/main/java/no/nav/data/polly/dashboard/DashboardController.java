package no.nav.data.polly.dashboard;

import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.LoadingCache;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.alert.domain.AlertEventType;
import no.nav.data.polly.alert.domain.AlertRepository;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.dashboard.dto.DashResponse;
import no.nav.data.polly.dashboard.dto.DashResponse.Counter;
import no.nav.data.polly.dashboard.dto.DashResponse.DashResponseBuilder;
import no.nav.data.polly.dashboard.dto.DashResponse.ProcessDashCount;
import no.nav.data.polly.process.domain.ProcessCount;
import no.nav.data.polly.process.domain.ProcessRepository;
import no.nav.data.polly.process.domain.ProcessStatus;
import no.nav.data.polly.process.dto.ProcessStateRequest.ProcessField;
import no.nav.data.polly.process.dto.ProcessStateRequest.ProcessState;
import no.nav.data.polly.process.dto.ProcessStateRequest.ProcessStatusFilter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
    private final LoadingCache<ProcessStatusFilter, DashResponse> dashData;

    public DashboardController(ProcessRepository processRepository, AlertRepository alertRepository) {
        this.processRepository = processRepository;
        this.alertRepository = alertRepository;
        this.dashData = Caffeine.newBuilder()
                .expireAfterWrite(Duration.ofMinutes(5))
                .maximumSize(3).build(this::calcDash);
    }

    @ApiOperation(value = "Get Dashboard data")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Data fetched", response = DashResponse.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping
    public ResponseEntity<DashResponse> getDashoboardData(@RequestParam(value = "filter", defaultValue = "ALL") ProcessStatusFilter filter) {
        return ResponseEntity.ok(requireNonNull(dashData.get(filter)));
    }

    private DashResponse calcDash(ProcessStatusFilter filter) {
        ProcessStatus status = filter.processStatus;
        ListName department = ListName.DEPARTMENT;
        var processCounts = countToMap(countCodes(status), department);
        var depComplete = countToMap(processRepository.countDepartmentCodeStatus(ProcessStatus.COMPLETED), department);
        var depInProg = countToMap(processRepository.countDepartmentCodeStatus(ProcessStatus.IN_PROGRESS), department);
        var usesAllInfoTypes = countToMap(countUseAllInfoTypes(status), department, true);
        var depLegalBasisMissing = countToMap(countDepartmentAlertEvents(MISSING_LEGAL_BASIS, status), department, true);
        var depArt6Missing = countToMap(countDepartmentAlertEvents(MISSING_ARTICLE_6, status), department, true);
        var depArt9Missing = countToMap(countDepartmentAlertEvents(MISSING_ARTICLE_9, status), department, true);

        var byDepartment = processCounts.entrySet().stream()
                .map(e -> ProcessDashCount.builder()
                        .department(e.getKey())

                        .processes(e.getValue())
                        .processesCompleted(depComplete.get(e.getKey()))
                        .processesInProgress(depInProg.get(e.getKey()))

                        .processesUsingAllInfoTypes(usesAllInfoTypes.get(e.getKey()))
                        .processesMissingLegalBases(depLegalBasisMissing.get(e.getKey()))
                        .processesMissingArt6(depArt6Missing.get(e.getKey()))
                        .processesMissingArt9(depArt9Missing.get(e.getKey()))

                        .dpia(getCount(ProcessField.DPIA, e.getValue(), e.getKey(), status))
                        .profiling(getCount(ProcessField.PROFILING, e.getValue(), e.getKey(), status))
                        .automation(getCount(ProcessField.AUTOMATION, e.getValue(), e.getKey(), status))
                        .retention(getCount(ProcessField.RETENTION, e.getValue(), e.getKey(), status))
                        .retentionDataIncomplete(processRepository.countForState(ProcessField.RETENTION_DATA, ProcessState.UNKNOWN, e.getKey(), status))

                        .dataProcessor(getCount(ProcessField.DATA_PROCESSOR, e.getValue(), e.getKey(), status))
                        .dataProcessorOutsideEU(getCount(ProcessField.DATA_PROCESSOR_OUTSIDE_EU, null, e.getKey(), status))
                        .dataProcessorAgreementMissing(processRepository.countForState(ProcessField.DATA_PROCESSOR_AGREEMENT_EMPTY, ProcessState.UNKNOWN, e.getKey(), status))

                        .build())
                .collect(Collectors.toList());

        long processes = status != null ? processRepository.countStatus(status) : processRepository.count();
        DashResponseBuilder dash = DashResponse.builder()
                .allProcesses(ProcessDashCount.builder()
                        .processes(processes)
                        .processesCompleted(processRepository.countStatus(ProcessStatus.COMPLETED))
                        .processesInProgress(processRepository.countStatus(ProcessStatus.IN_PROGRESS))

                        .processesUsingAllInfoTypes(usesAllInfoTypes.values().stream().mapToLong(Long::longValue).sum())
                        .processesMissingLegalBases(depLegalBasisMissing.values().stream().mapToLong(Long::longValue).sum())
                        .processesMissingArt6(depArt6Missing.values().stream().mapToLong(Long::longValue).sum())
                        .processesMissingArt9(depArt9Missing.values().stream().mapToLong(Long::longValue).sum())

                        .dpia(getCount(ProcessField.DPIA, processes, null, status))
                        .profiling(getCount(ProcessField.PROFILING, processes, null, status))
                        .automation(getCount(ProcessField.AUTOMATION, processes, null, status))
                        .retention(getCount(ProcessField.RETENTION, processes, null, status))
                        .retentionDataIncomplete(processRepository.countForState(ProcessField.RETENTION_DATA, ProcessState.UNKNOWN, null, status))

                        .dataProcessor(getCount(ProcessField.DATA_PROCESSOR, processes, null, status))
                        .dataProcessorOutsideEU(getCount(ProcessField.DATA_PROCESSOR_OUTSIDE_EU, null, null, status))
                        .dataProcessorAgreementMissing(processRepository.countForState(ProcessField.DATA_PROCESSOR_AGREEMENT_EMPTY, ProcessState.UNKNOWN, null, status))

                        .build())
                .departmentProcesses(byDepartment);
        return dash.build();
    }

    private List<ProcessCount> countDepartmentAlertEvents(AlertEventType eventType, ProcessStatus status) {
        return status != null ? alertRepository.countDepartmentAlertEvents(eventType.name(), status) : alertRepository.countDepartmentAlertEvents(eventType.name());
    }

    private List<ProcessCount> countUseAllInfoTypes(ProcessStatus status) {
        return status != null ? processRepository.countUsingAllInfoTypes(status) : processRepository.countUsingAllInfoTypes();
    }

    private List<ProcessCount> countCodes(ProcessStatus status) {
        return status != null ? processRepository.countDepartmentCode(status) : processRepository.countDepartmentCode();
    }

    private Counter getCount(ProcessField field, Long processes, String department, ProcessStatus status) {
        long yes = processRepository.countForState(field, ProcessState.YES, department, status);
        long no = processRepository.countForState(field, ProcessState.NO, department, status);
        long unknown = processes != null ? processes - yes - no : processRepository.countForState(field, ProcessState.UNKNOWN, department, status);
        return new Counter(yes, no, unknown);
    }

}
