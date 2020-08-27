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
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.dashboard.dto.DashResponse;
import no.nav.data.polly.dashboard.dto.DashResponse.Counter;
import no.nav.data.polly.dashboard.dto.DashResponse.DashResponseBuilder;
import no.nav.data.polly.dashboard.dto.DashResponse.ProcessDashCount;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessCount;
import no.nav.data.polly.process.domain.ProcessData;
import no.nav.data.polly.process.domain.ProcessData.DataProcessing;
import no.nav.data.polly.process.domain.ProcessData.Dpia;
import no.nav.data.polly.process.domain.ProcessData.Retention;
import no.nav.data.polly.process.domain.ProcessRepository;
import no.nav.data.polly.process.domain.ProcessStatus;
import no.nav.data.polly.process.domain.StateDbRequest;
import no.nav.data.polly.process.dto.ProcessStateRequest.ProcessField;
import no.nav.data.polly.process.dto.ProcessStateRequest.ProcessState;
import no.nav.data.polly.process.dto.ProcessStateRequest.ProcessStatusFilter;
import no.nav.data.polly.teams.TeamService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.util.Objects.requireNonNull;
import static no.nav.data.common.utils.StreamUtils.nullToEmptyList;
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
    private final TeamService teamService;
    private final LoadingCache<ProcessStatusFilter, DashResponse> dashData;
    private final LoadingCache<ProcessStatusFilter, DashResponse> dashDataNoSql;

    public DashboardController(ProcessRepository processRepository, AlertRepository alertRepository, TeamService teamService) {
        this.processRepository = processRepository;
        this.alertRepository = alertRepository;
        this.teamService = teamService;
        this.dashData = Caffeine.newBuilder()
                .expireAfterWrite(Duration.ofMinutes(3))
                .maximumSize(3).build(this::calcDash);
        this.dashDataNoSql = Caffeine.newBuilder()
                .expireAfterWrite(Duration.ofMinutes(3))
                .maximumSize(3).build(this::calcDashNoSql);
    }

    @ApiOperation(value = "Get Dashboard data")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Data fetched", response = DashResponse.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping
    public ResponseEntity<DashResponse> getDashboardData(@RequestParam(value = "filter", defaultValue = "ALL") ProcessStatusFilter filter) {
        return ResponseEntity.ok(requireNonNull(dashData.get(filter)));
    }

    @ApiOperation(value = "Get Dashboard data nsql")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Data fetched", response = DashResponse.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/nosql")
    public ResponseEntity<DashResponse> getDashboardDataNoSql(@RequestParam(value = "filter", defaultValue = "ALL") ProcessStatusFilter filter) {
        return ResponseEntity.ok(requireNonNull(dashDataNoSql.get(filter)));
    }

    private DashResponse calcDashNoSql(ProcessStatusFilter filter) {
        var dash = new DashResponse();
        // init all departments and load teamId -> productArea mapping
        CodelistService.getCodelist(ListName.DEPARTMENT).forEach(d -> dash.department(d.getCode()));
        teamService.getAllTeams().forEach(t -> dash.registerTeam(t.getId(), t.getProductAreaId()));

        PageRequest pageable = PageRequest.of(0, 50, Sort.by("id"));
        Page<Process> page = null;
        do {
            page = processRepository.findAll(
                    Optional.ofNullable(page)
                            .map(Page::nextPageable)
                            .orElse(pageable)
            );
            page.get().forEach(p -> calcDashNoSql(filter, dash, p));
        } while (page.hasNext());
        return dash;
    }

    private void calcDashNoSql(ProcessStatusFilter filter, DashResponse dash, Process process) {
        var processStatusFilter = filter.processStatus;
        if (processStatusFilter != null && process.getData().getStatus() != processStatusFilter) {
            return;
        }
        var dashes = new ArrayList<ProcessDashCount>();
        dashes.add(dash.getAllProcesses());
        Optional.ofNullable(process.getData().getDepartment()).ifPresent(dep -> dashes.add(dash.department(dep)));
        // A team might be stored that doesnt exist, producing nulls here
        nullToEmptyList(process.getData().getProductTeams()).stream().map(dash::team).filter(Objects::nonNull).forEach(dashes::add);

        dashes.forEach(ProcessDashCount::processes);
        if (process.getData().getStatus() == ProcessStatus.COMPLETED) {
            dashes.forEach(ProcessDashCount::processesCompleted);
        }
        if (process.getData().getStatus() == ProcessStatus.IN_PROGRESS) {
            dashes.forEach(ProcessDashCount::processesInProgress);
        }
        if (process.getData().isUsesAllInformationTypes()) {
            dashes.forEach(ProcessDashCount::processesUsingAllInfoTypes);
        }
        if (process.getData().isUsesAllInformationTypes()) {
            dashes.forEach(ProcessDashCount::processesUsingAllInfoTypes);
        }
        // TODO miss legal art6 art9

        var pd = Optional.of(process.getData());

        dashes.stream().map(ProcessDashCount::getDpia).forEach(d -> count(d, pd.map(ProcessData::getDpia).map(Dpia::getNeedForDpia).orElse(null)));
        dashes.stream().map(ProcessDashCount::getProfiling).forEach(d -> count(d, pd.map(ProcessData::getProfiling).orElse(null)));
        dashes.stream().map(ProcessDashCount::getAutomation).forEach(d -> count(d, pd.map(ProcessData::getAutomaticProcessing).orElse(null)));
        var ret = pd.map(ProcessData::getRetention);
        dashes.stream().map(ProcessDashCount::getRetention).forEach(d -> count(d, ret.map(Retention::getRetentionPlan).orElse(null)));
        var retStart = ret.map(Retention::getRetentionStart).orElse(null);
        var retMonths = ret.map(Retention::getRetentionMonths).orElse(null);
        if (retStart == null || retMonths == null) {
            dashes.forEach(ProcessDashCount::retentionDataIncomplete);
        }

        var dataProc = pd.map(ProcessData::getDataProcessing);
        dashes.stream().map(ProcessDashCount::getDataProcessor).forEach(d -> count(d, dataProc.map(DataProcessing::getDataProcessor).orElse(null)));
        boolean isDataProc = dataProc.map(DataProcessing::getDataProcessor).orElse(false);
        if (isDataProc) {
            dashes.stream().map(ProcessDashCount::getDataProcessorOutsideEU).forEach(d -> count(d, dataProc.map(DataProcessing::getDataProcessorOutsideEU).orElse(null)));
            if (dataProc.map(DataProcessing::getDataProcessorAgreements).orElse(List.of()).isEmpty()) {
                dashes.forEach(ProcessDashCount::dataProcessorAgreementMissing);
            }
        }
    }

    private void count(Counter counter, Boolean value) {
        if (value == null) {
            counter.unknown();
        } else if (value) {
            counter.yes();
        } else {
            counter.no();
        }
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
                        .retentionDataIncomplete(processRepository.countForState(getStateDbRequest(status, ProcessField.RETENTION_DATA, ProcessState.UNKNOWN, e.getKey())))

                        .dataProcessor(getCount(ProcessField.DATA_PROCESSOR, e.getValue(), e.getKey(), status))
                        .dataProcessorOutsideEU(getCount(ProcessField.DATA_PROCESSOR_OUTSIDE_EU, null, e.getKey(), status))
                        .dataProcessorAgreementMissing(
                                processRepository.countForState(getStateDbRequest(status, ProcessField.DATA_PROCESSOR_AGREEMENT_EMPTY, ProcessState.UNKNOWN, e.getKey())))

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
                        .retentionDataIncomplete(processRepository.countForState(getStateDbRequest(status, ProcessField.RETENTION_DATA, ProcessState.UNKNOWN)))

                        .dataProcessor(getCount(ProcessField.DATA_PROCESSOR, processes, null, status))
                        .dataProcessorOutsideEU(getCount(ProcessField.DATA_PROCESSOR_OUTSIDE_EU, null, null, status))
                        .dataProcessorAgreementMissing(
                                processRepository.countForState(getStateDbRequest(status, ProcessField.DATA_PROCESSOR_AGREEMENT_EMPTY, ProcessState.UNKNOWN)))

                        .build())
                .departmentProcesses(byDepartment);
        return dash.build();
    }

    private StateDbRequest getStateDbRequest(ProcessStatus status, ProcessField field, ProcessState state, String department) {
        return new StateDbRequest(field, state, department, null, status);
    }

    private StateDbRequest getStateDbRequest(ProcessStatus status, ProcessField field, ProcessState state) {
        return new StateDbRequest(field, state, null, null, status);
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
        long yes = processRepository.countForState(getStateDbRequest(status, field, ProcessState.YES, department));
        long no = processRepository.countForState(getStateDbRequest(status, field, ProcessState.NO, department));
        long unknown = processes != null ? processes - yes - no : processRepository.countForState(getStateDbRequest(status, field, ProcessState.UNKNOWN, department));
        return new Counter(yes, no, unknown);
    }

    @Scheduled(initialDelayString = "PT30S", fixedRateString = "PT30S")
    public void warmup() {
        Arrays.stream(ProcessStatusFilter.values()).forEach(this::getDashboardData);
    }

}
