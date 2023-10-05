package no.nav.data.polly.dashboard;

import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.LoadingCache;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.exceptions.NotFoundException;
import no.nav.data.polly.alert.domain.AlertEvent;
import no.nav.data.polly.alert.domain.AlertRepository;
import no.nav.data.polly.dashboard.dto.DashResponse;
import no.nav.data.polly.dashboard.dto.DashResponse.Counter;
import no.nav.data.polly.dashboard.dto.DashResponse.DashCount;
import no.nav.data.polly.disclosure.domain.Disclosure;
import no.nav.data.polly.disclosure.domain.DisclosureRepository;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessData;
import no.nav.data.polly.process.domain.repo.ProcessRepository;
import no.nav.data.polly.process.domain.sub.Affiliation;
import no.nav.data.polly.process.domain.sub.DataProcessing;
import no.nav.data.polly.process.domain.sub.Dpia;
import no.nav.data.polly.process.domain.sub.Retention;
import no.nav.data.polly.process.dpprocess.domain.DpProcess;
import no.nav.data.polly.process.dpprocess.domain.repo.DpProcessRepository;
import no.nav.data.polly.process.dto.ProcessStateRequest.ProcessStatusFilter;
import no.nav.data.polly.teams.TeamService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.ResponseEntity;
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
import static no.nav.data.common.utils.StreamUtils.nullToEmptyList;
import static no.nav.data.polly.alert.domain.AlertEventType.MISSING_ARTICLE_6;
import static no.nav.data.polly.alert.domain.AlertEventType.MISSING_ARTICLE_9;
import static no.nav.data.polly.alert.domain.AlertEventType.MISSING_LEGAL_BASIS;
import static org.springframework.util.CollectionUtils.isEmpty;

@Slf4j
@RestController
@RequestMapping("/dash")
@Tag(name = "Dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final ProcessRepository processRepository;
    private final DpProcessRepository dpProcessRepository;
    private final DisclosureRepository disclosureRepository;
    private final AlertRepository alertRepository;
    private final TeamService teamService;
    private final LoadingCache<ProcessStatusFilter, DashResponse> dashDataCache = Caffeine.newBuilder()
            .expireAfterWrite(Duration.ofMinutes(3))
            .maximumSize(5).build(this::calcDash);

    @Operation(summary = "Get Dashboard data")
    @ApiResponse(description = "Data fetched")
    @GetMapping
    public ResponseEntity<DashResponse> getDashboardData(@RequestParam(value = "filter", defaultValue = "ALL") ProcessStatusFilter filter) {
        return ResponseEntity.ok(requireNonNull(dashDataCache.get(filter)));
    }

    private DashResponse calcDash(ProcessStatusFilter filter) {
        throw new NotFoundException("Yo!");
//        var dash = new DashResponse();
//        // init all departments and load teamId -> productArea mapping
//        CodelistService.getCodelist(ListName.DEPARTMENT).forEach(d -> dash.department(d.getCode()));
//        teamService.getAllTeams().forEach(t -> dash.registerTeam(t.getId(), t.getProductAreaId()));
//
//        doPaged(processRepository, 50, processes -> {
//            var alerts = convert(alertRepository.findByProcessIds(convert(processes, Process::getId)), GenericStorage::toAlertEvent);
//            processes.forEach(p -> calcDashForProcess(filter, dash, p, filter(alerts, a -> p.getId().equals(a.getProcessId()))));
//        });
//        doPaged(dpProcessRepository, 50, dpProcesses -> dpProcesses.forEach(dpp -> calcDashForDpProcess(dash, dpp)));
//        doPaged(disclosureRepository, 50, disclosures -> disclosures.forEach(disc -> calcDashForDisclosure(dash, disc)));
//        return dash;
    }

    private void calcDashForProcess(ProcessStatusFilter filter, DashResponse dash, Process process, List<AlertEvent> alerts) {
        var processStatusFilter = filter.processStatus;
        if (processStatusFilter != null && process.getData().getStatus() != processStatusFilter) {
            return;
        }
        ArrayList<DashCount> dashes = getDashes(dash, process.getData().getAffiliation());

        dashes.forEach(DashCount::processes);
        switch (process.getData().getStatus()) {
            case COMPLETED -> dashes.forEach(DashCount::processesCompleted);
            case IN_PROGRESS -> dashes.forEach(DashCount::processesInProgress);
            case NEEDS_REVISION -> dashes.forEach(DashCount::processesNeedsRevision);
        }

        if (process.getData().isUsesAllInformationTypes()) {
            dashes.forEach(DashCount::processesUsingAllInfoTypes);
        }

        if (alerts.stream().anyMatch(a -> a.getType() == MISSING_LEGAL_BASIS)) {
            dashes.forEach(DashCount::processesMissingLegalBases);
        }
        if (alerts.stream().anyMatch(a -> a.getType() == MISSING_ARTICLE_6)) {
            dashes.forEach(DashCount::processesMissingArt6);
        }
        if (alerts.stream().anyMatch(a -> a.getType() == MISSING_ARTICLE_9)) {
            dashes.forEach(DashCount::processesMissingArt9);
        }

        var pd = Optional.of(process.getData());

        Optional<Dpia> dpia = pd.map(ProcessData::getDpia);
        dashes.stream().map(DashCount::getDpia).forEach(d -> count(d, dpia.map(Dpia::getNeedForDpia).orElse(null)));
        if (dpia.map(Dpia::getNeedForDpia).orElse(false) && StringUtils.isBlank(dpia.map(Dpia::getRefToDpia).orElse(null))) {
            dashes.forEach(DashCount::dpiaReferenceMissing);
        }

        dashes.stream().map(DashCount::getProfiling).forEach(d -> count(d, pd.map(ProcessData::getProfiling).orElse(null)));
        dashes.stream().map(DashCount::getAutomation).forEach(d -> count(d, pd.map(ProcessData::getAutomaticProcessing).orElse(null)));
        var ret = pd.map(ProcessData::getRetention);
        dashes.stream().map(DashCount::getRetention).forEach(d -> count(d, ret.map(Retention::getRetentionPlan).orElse(null)));
        var retStart = ret.map(Retention::getRetentionStart).orElse(null);
        var retMonths = ret.map(Retention::getRetentionMonths).orElse(null);
        if (retStart == null || retMonths == null) {
            dashes.forEach(DashCount::retentionDataIncomplete);
        }

        var dataProc = pd.map(ProcessData::getDataProcessing);
        dashes.stream().map(DashCount::getDataProcessor).forEach(d -> count(d, dataProc.map(DataProcessing::getDataProcessor).orElse(null)));
        pd.map(ProcessData::getCommonExternalProcessResponsible).ifPresent(c -> dashes.forEach(DashCount::commonExternalProcessResponsible));
    }

    private void calcDashForDpProcess(DashResponse dash, DpProcess dpProcess) {
        ArrayList<DashCount> dashes = getDashes(dash, dpProcess.getData().getAffiliation());
        dashes.forEach(DashCount::dpProcesses);
    }

    private void calcDashForDisclosure(DashResponse dash, Disclosure disclosure) {
        DashCount dashes = dash.getAll();
        dashes.disclosures();
        if (isEmpty(disclosure.getData().getLegalBases())) {
            dash.getAll().disclosuresIncomplete();
        }
    }

    private ArrayList<DashCount> getDashes(DashResponse dash, Affiliation affiliation) {
        var dashes = new ArrayList<DashCount>();
        dashes.add(dash.getAll());
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

//    @Scheduled(initialDelayString = "PT2M", fixedRateString = "PT30S")
    public void warmup() {
        Arrays.stream(ProcessStatusFilter.values()).forEach(this::getDashboardData);
    }

}
