package no.nav.data.polly.dashboard;

import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.LoadingCache;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.storage.domain.GenericStorage;
import no.nav.data.common.utils.StreamUtils;
import no.nav.data.polly.alert.domain.AlertEvent;
import no.nav.data.polly.alert.domain.AlertRepository;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.dashboard.dto.DashResponse;
import no.nav.data.polly.dashboard.dto.DashResponse.Counter;
import no.nav.data.polly.dashboard.dto.DashResponse.ProcessDashCount;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessData;
import no.nav.data.polly.process.domain.ProcessStatus;
import no.nav.data.polly.process.domain.repo.DpProcessRepository;
import no.nav.data.polly.process.domain.repo.ProcessRepository;
import no.nav.data.polly.process.domain.sub.Affiliation;
import no.nav.data.polly.process.domain.sub.DataProcessing;
import no.nav.data.polly.process.domain.sub.Dpia;
import no.nav.data.polly.process.domain.sub.Retention;
import no.nav.data.polly.process.dpprocess.domain.DpProcess;
import no.nav.data.polly.process.dto.ProcessStateRequest.ProcessStatusFilter;
import no.nav.data.polly.teams.TeamService;
import org.apache.commons.lang3.StringUtils;
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

import static java.util.Objects.requireNonNull;
import static no.nav.data.common.utils.StreamUtils.convert;
import static no.nav.data.common.utils.StreamUtils.nullToEmptyList;
import static no.nav.data.polly.alert.domain.AlertEventType.MISSING_ARTICLE_6;
import static no.nav.data.polly.alert.domain.AlertEventType.MISSING_ARTICLE_9;
import static no.nav.data.polly.alert.domain.AlertEventType.MISSING_LEGAL_BASIS;

@Slf4j
@RestController
@RequestMapping("/dash")
@Tag(name = "Dashboard")
public class DashboardController {

    private final ProcessRepository processRepository;
    private final DpProcessRepository dpProcessRepository;
    private final AlertRepository alertRepository;
    private final TeamService teamService;
    private final LoadingCache<ProcessStatusFilter, DashResponse> dashDataCache;

    public DashboardController(ProcessRepository processRepository, DpProcessRepository dpProcessRepository, AlertRepository alertRepository,
            TeamService teamService) {
        this.processRepository = processRepository;
        this.dpProcessRepository = dpProcessRepository;
        this.alertRepository = alertRepository;
        this.teamService = teamService;
        this.dashDataCache = Caffeine.newBuilder()
                .expireAfterWrite(Duration.ofMinutes(3))
                .maximumSize(3).build(this::calcDash);
    }

    @Operation(summary = "Get Dashboard data")
    @ApiResponse(description = "Data fetched")
    @GetMapping
    public ResponseEntity<DashResponse> getDashboardData(@RequestParam(value = "filter", defaultValue = "ALL") ProcessStatusFilter filter) {
        return ResponseEntity.ok(requireNonNull(dashDataCache.get(filter)));
    }

    private DashResponse calcDash(ProcessStatusFilter filter) {
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
            var alerts = convert(alertRepository.findByProcessIds(convert(page.getContent(), Process::getId)), GenericStorage::toAlertEvent);
            page.get().forEach(p -> calcDashForProcess(filter, dash, p, StreamUtils.filter(alerts, a -> p.getId().equals(a.getProcessId()))));
        } while (page.hasNext());
        Page<DpProcess> dpProcessPage = null;
        do {
            dpProcessPage = dpProcessRepository.findAll(
                    Optional.ofNullable(dpProcessPage)
                            .map(Page::nextPageable)
                            .orElse(pageable)
            );
            dpProcessPage.get().forEach(p -> calcDashForDpProcess(dash, p));
        } while (page.hasNext());
        return dash;
    }

    private void calcDashForProcess(ProcessStatusFilter filter, DashResponse dash, Process process, List<AlertEvent> alerts) {
        var processStatusFilter = filter.processStatus;
        if (processStatusFilter != null && process.getData().getStatus() != processStatusFilter) {
            return;
        }
        ArrayList<ProcessDashCount> dashes = getDashes(dash, process.getData().getAffiliation());

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

        if (alerts.stream().anyMatch(a -> a.getType() == MISSING_LEGAL_BASIS)) {
            dashes.forEach(ProcessDashCount::processesMissingLegalBases);
        }
        if (alerts.stream().anyMatch(a -> a.getType() == MISSING_ARTICLE_6)) {
            dashes.forEach(ProcessDashCount::processesMissingArt6);
        }
        if (alerts.stream().anyMatch(a -> a.getType() == MISSING_ARTICLE_9)) {
            dashes.forEach(ProcessDashCount::processesMissingArt9);
        }

        var pd = Optional.of(process.getData());

        Optional<Dpia> dpia = pd.map(ProcessData::getDpia);
        dashes.stream().map(ProcessDashCount::getDpia).forEach(d -> count(d, dpia.map(Dpia::getNeedForDpia).orElse(null)));
        if (dpia.map(Dpia::getNeedForDpia).orElse(false) && StringUtils.isBlank(dpia.map(Dpia::getRefToDpia).orElse(null))) {
            dashes.forEach(ProcessDashCount::dpiaReferenceMissing);
        }

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
        pd.map(ProcessData::getCommonExternalProcessResponsible).ifPresent(c -> dashes.forEach(ProcessDashCount::commonExternalProcessResponsible));
    }

    private void calcDashForDpProcess(DashResponse dash, DpProcess dpProcess) {
        ArrayList<ProcessDashCount> dashes = getDashes(dash, dpProcess.getData().getAffiliation());

        dashes.forEach(ProcessDashCount::dpProcesses);
    }

    private ArrayList<ProcessDashCount> getDashes(DashResponse dash, Affiliation affiliation) {
        var dashes = new ArrayList<ProcessDashCount>();
        dashes.add(dash.getAllProcesses());
        Optional.ofNullable(affiliation.getDepartment()).ifPresent(dep -> dashes.add(dash.department(dep)));
        // A team might be stored that doesnt exist, producing nulls here
        nullToEmptyList(affiliation.getProductTeams()).stream().map(dash::team).filter(Objects::nonNull).forEach(dashes::add);
        return dashes;
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

    @Scheduled(initialDelayString = "PT30S", fixedRateString = "PT30S")
    public void warmup() {
        Arrays.stream(ProcessStatusFilter.values()).forEach(this::getDashboardData);
    }

}
