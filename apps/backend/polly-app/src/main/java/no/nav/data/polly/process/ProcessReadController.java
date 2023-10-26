package no.nav.data.polly.process;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.auditing.AuditService;
import no.nav.data.common.auditing.dto.AuditMetadata;
import no.nav.data.common.exceptions.ValidationException;
import no.nav.data.common.rest.PageParameters;
import no.nav.data.common.rest.RestResponsePage;
import no.nav.data.common.security.SecurityUtils;
import no.nav.data.common.security.dto.UserInfo;
import no.nav.data.common.utils.JsonUtils;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.Codelist;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.repo.ProcessCount;
import no.nav.data.polly.process.domain.repo.ProcessRepository;
import no.nav.data.polly.process.dto.LastEditedResponse;
import no.nav.data.polly.process.dto.ProcessCountResponse;
import no.nav.data.polly.process.dto.ProcessResponse;
import no.nav.data.polly.process.dto.ProcessShortResponse;
import no.nav.data.polly.teams.TeamService;
import no.nav.data.polly.teams.domain.Team;
import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import static java.util.Comparator.comparing;
import static java.util.stream.Collectors.toList;
import static no.nav.data.common.utils.StartsWithComparator.startsWith;
import static no.nav.data.common.utils.StreamUtils.convert;
import static no.nav.data.common.utils.StreamUtils.filter;

@Slf4j
@RestController
@Tag(name = "Process", description = "Data Catalog Process")
@RequestMapping("/process")
@RequiredArgsConstructor
public class ProcessReadController {

    private final TeamService teamService;
    private final ProcessRepository repository;
    private final ProcessService processService;
    private final AuditService auditService;

    @Operation(summary = "Get Process with InformationTypes for Id or process number")
    @ApiResponse(description = "Process fetched")
    @GetMapping("/{id}")
    @Transactional
    public ResponseEntity<ProcessResponse> findForId(@PathVariable @Parameter(description = "Treated as process number if numeric") String id) {
        log.info("Received request for Process with id/number={}", id);
        Optional<Process> process;
        if (StringUtils.isNumeric(id)) {
            process = repository.findByProcessNumber(id);
        } else {
            process = repository.findById(UUID.fromString(id));
        }
        if (process.isEmpty()) {
            log.info("Cannot find the Process with id={}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(process.get().convertToResponseWithPolicies());
    }

    @Operation(summary = "Get All Processes, parameters filters are not combined unless stated otherwise")
    @ApiResponse(description = "All Processes fetched")
    @GetMapping
    public ResponseEntity<RestResponsePage<ProcessResponse>> getAllProcesses(PageParameters pageParameters,
            @RequestParam(required = false) String productTeam,
            @RequestParam(required = false) String productArea,
            @RequestParam(required = false) UUID documentId,
            @RequestParam(required = false) UUID processorId,
            @Parameter(description = "Can be combined with nationalLaw") @RequestParam(required = false) String gdprArticle,
            @Parameter(description = "Can be combined with gdprArticle") @RequestParam(required = false) String nationalLaw
    ) {
        if (productTeam != null) {
            log.info("Received request for Processeses for productTeam {}", productTeam);
            var processes = repository.findByProductTeam(productTeam);
            return ResponseEntity.ok(new RestResponsePage<>(convert(processes, Process::convertToResponse)));
        }
        if (productArea != null) {
            log.info("Received request for Processeses for productArea {}", productArea);
            var teams = teamService.getTeamsForProductArea(productArea);
            var processes = repository.findByProductTeams(convert(teams, Team::getId));
            return ResponseEntity.ok(new RestResponsePage<>(convert(processes, Process::convertToResponse)));
        }
        if (documentId != null) {
            log.info("Received request for Processeses for documentId {}", documentId);
            var processes = repository.findByDocumentId(documentId);
            return ResponseEntity.ok(new RestResponsePage<>(convert(processes, Process::convertToResponse)));
        }
        if (processorId != null) {
            log.info("Received request for Processeses for processorId {}", processorId);
            var processes = repository.findByProcessor(processorId);
            return ResponseEntity.ok(new RestResponsePage<>(convert(processes, Process::convertToResponse)));
        }
        if (gdprArticle != null || nationalLaw != null) {
            log.info("Received request for Processeses for gdprArticle {} nationalLaw {}", gdprArticle, nationalLaw);
            var processes = processService.getAllProcessesForGdprAndLaw(gdprArticle, nationalLaw);
            return ResponseEntity.ok(new RestResponsePage<>(convert(processes, Process::convertToResponse)));
        }
        log.info("Received request for all Processes");
        Page<ProcessResponse> page = repository.findAllSortedByNumber(pageParameters.createPage()).map(Process::convertToResponse);
        return ResponseEntity.ok(new RestResponsePage<>(page));
    }

    @Operation(summary = "Get All Processes by information type sensitivity")
    @ApiResponse(description = "Get All Processes by information type sensitivity")
    @GetMapping("/sensitivity")
    public ResponseEntity<RestResponsePage<ProcessResponse>> getProcessesByInformationTypeSensitivity(
            PageParameters pageParameters,
            @RequestParam String sensitivity
    ) {
            var processes = processService.fetchAllProcessesByInformationTypeSensitivity(sensitivity);
            return ResponseEntity.ok(new RestResponsePage<>(convert(processes, Process::convertToResponse)));
    }

    @Operation(summary = "Get Processes for Purpose")
    @ApiResponse(description = "Processes fetched")
    @GetMapping("/purpose/{purpose}")
    @Transactional
    public ResponseEntity<RestResponsePage<ProcessResponse>> getPurpose(@PathVariable String purpose) {
        log.info("Get processes for purpose={}", purpose);
        Codelist codelist = CodelistService.getCodelist(ListName.PURPOSE, purpose);
        if (codelist == null) {
            return ResponseEntity.notFound().build();
        }
        String code = codelist.getCode();
        var processes = repository.findByPurpose(code).stream().map(Process::convertToResponse).collect(toList());
        log.info("Got {} processes", processes.size());
        return ResponseEntity.ok(new RestResponsePage<>(processes));
    }

    @Operation(summary = "Get last edited processes by logged in user")
    @ApiResponse(description = "All Processes fetched")
    @GetMapping("/myedits")
    public ResponseEntity<RestResponsePage<LastEditedResponse>> getMyRecentlyEditedProcesses() {
        Optional<UserInfo> user = SecurityUtils.getCurrentUser();
        if (user.isEmpty()) {
            return ResponseEntity.ok(new RestResponsePage<>());
        }
        var audits = auditService.lastEditedProcessesByUser(user.get().getIdentName());
        var processes = repository.findAllById(convert(audits, AuditMetadata::getTableId)).stream().collect(Collectors.toMap(Process::getId, Function.identity()));

        return ResponseEntity.ok(new RestResponsePage<>(convert(audits, a -> new LastEditedResponse(a.getTime(), processes.get(a.getTableId()).convertToShortResponse()))));
    }

    @Operation(summary = "Get short info of processes")
    @ApiResponse(description = "Processes fetched")
    @PostMapping("/shortbyid")
    public ResponseEntity<RestResponsePage<ProcessShortResponse>> getProcessesShortById(@RequestBody List<UUID> ids) {
        var processes = repository.findAllById(ids);
        return ResponseEntity.ok(new RestResponsePage<>(convert(processes, Process::convertToShortResponse)));
    }

    @Operation(summary = "Search processes")
    @ApiResponse(description = "Processes fetched")
    @GetMapping("/search/{search}")
    public ResponseEntity<RestResponsePage<ProcessResponse>> searchProcesses(@PathVariable String search,
            @RequestParam(value = "includePurpose", defaultValue = "false") boolean includePurpose) {
        log.info("Received request for Processes search={}", search);
        if (search.length() < 3) {
            throw new ValidationException("Search term must be at least 3 characters");
        }
        List<Process> processes = new ArrayList<>(repository.findByNameContaining(search));
        if(search.toLowerCase().matches("b[0-9]+")){
            repository.findByProcessNumber(search.substring(1)).ifPresent(processes::add);
        }
        if (StringUtils.isNumeric(search)) {
            repository.findByProcessNumber(search).ifPresent(processes::add);
        }
        if (includePurpose) {
            var purposes = filter(CodelistService.getCodelist(ListName.PURPOSE), c -> StringUtils.containsIgnoreCase(c.getShortName(), search));
            purposes.sort(comparing(Codelist::getShortName, startsWith(search)));
            if (!purposes.isEmpty()) {
                processes.addAll(repository.findByPurpose(purposes.get(0).getCode()));
            }
        }
        return ResponseEntity.ok(new RestResponsePage<>(convert(processes, Process::convertToResponse)));
    }

    @Operation(summary = "Get count by property")
    @ApiResponse(description = "Counts fetched")
    @GetMapping("/count")
    public ResponseEntity<ProcessCountResponse> count(
            @RequestParam(value = "purpose", required = false) Boolean purpose,
            @RequestParam(value = "department", required = false) Boolean department,
            @RequestParam(value = "subDepartment", required = false) Boolean subDepartment,
            @RequestParam(value = "team", required = false) Boolean team,
            HttpServletRequest request
    ) {
        log.info("Get process count " + JsonUtils.toJson(request.getParameterMap()));
        ListName listName = null;
        List<ProcessCount> purposeCounts = null;
        if (isSet(request, "purpose")) {
            purposeCounts = repository.countPurpose();
            listName = ListName.PURPOSE;
        } else if (isSet(request, "department")) {
            purposeCounts = repository.countDepartment();
            listName = ListName.DEPARTMENT;
        } else if (isSet(request, "subDepartment")) {
            purposeCounts = repository.countSubDepartment();
            listName = ListName.SUB_DEPARTMENT;
        }
        Map<String, Long> counts;
        if (purposeCounts != null) {
            counts = ProcessCount.countToMap(purposeCounts, listName);
        } else if (isSet(request, "team")) {
            var teams = repository.countTeam();
            counts = ProcessCount.countToMap(teams);
        } else {
            throw new ValidationException("No count property selected");
        }
        return ResponseEntity.ok(new ProcessCountResponse(counts));
    }

    /**
     * paramater set with no value evalutes to true
     */
    private boolean isSet(HttpServletRequest request, String param) {
        String value = request.getParameter(param);
        return "".equals(value) || BooleanUtils.toBoolean(value);
    }

    static class ProcessPage extends RestResponsePage<ProcessResponse> {

    }

    static class LastEditedPage extends RestResponsePage<LastEditedResponse> {

    }

}
