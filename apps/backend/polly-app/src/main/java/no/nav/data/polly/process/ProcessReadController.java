package no.nav.data.polly.process;


import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.exceptions.ValidationException;
import no.nav.data.common.rest.PageParameters;
import no.nav.data.common.rest.RestResponsePage;
import no.nav.data.common.utils.JsonUtils;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.repo.ProcessCount;
import no.nav.data.polly.process.domain.repo.ProcessRepository;
import no.nav.data.polly.process.dto.ProcessCountResponse;
import no.nav.data.polly.process.dto.ProcessResponse;
import no.nav.data.polly.teams.TeamService;
import no.nav.data.polly.teams.domain.Team;
import org.apache.commons.lang3.BooleanUtils;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import javax.servlet.http.HttpServletRequest;

import static no.nav.data.common.utils.StreamUtils.convert;

@Slf4j
@RestController
@Api(value = "Data Catalog Process", tags = {"Process"})
@RequestMapping("/process")
public class ProcessReadController {

    private final TeamService teamService;
    private final ProcessRepository repository;
    private final ProcessService processService;

    public ProcessReadController(TeamService teamService, ProcessRepository repository, ProcessService processService) {
        this.teamService = teamService;
        this.repository = repository;
        this.processService = processService;
    }

    @ApiOperation(value = "Get Process with InformationTypes")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Process fetched", response = ProcessResponse.class),
            @ApiResponse(code = 404, message = "Process not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/{id}")
    @Transactional
    public ResponseEntity<ProcessResponse> findForId(@PathVariable UUID id) {
        log.info("Received request for Process with id={}", id);
        Optional<ProcessResponse> process = repository.findById(id).map(Process::convertToResponseWithPolicies);
        if (process.isEmpty()) {
            log.info("Cannot find the Process with id={}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(process.get());
    }

    @ApiOperation(value = "Get All Processes, parameters filters are not combined unless stated otherwise")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "All Processes fetched", response = ProcessPage.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping
    public ResponseEntity<RestResponsePage<ProcessResponse>> getAllProcesses(PageParameters pageParameters,
            @RequestParam(required = false) String productTeam,
            @RequestParam(required = false) String productArea,
            @RequestParam(required = false) String documentId,
            @ApiParam("Can be combined with nationalLaw") @RequestParam(required = false) String gdprArticle,
            @ApiParam("Can be combined with gdprArticle") @RequestParam(required = false) String nationalLaw
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
        if (gdprArticle != null || nationalLaw != null) {
            log.info("Received request for Processeses for gdprArticle {} nationalLaw {}", gdprArticle, nationalLaw);
            var processes = processService.getAllProcessesForGdprAndLaw(gdprArticle, nationalLaw);
            return ResponseEntity.ok(new RestResponsePage<>(convert(processes, Process::convertToResponse)));
        }
        log.info("Received request for all Processes");
        Page<ProcessResponse> page = repository.findAll(pageParameters.createIdSortedPage()).map(Process::convertToResponse);
        return ResponseEntity.ok(new RestResponsePage<>(page));
    }

    @ApiOperation(value = "Search processes")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Processes fetched", response = ProcessPage.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/search/{search}")
    public ResponseEntity<RestResponsePage<ProcessResponse>> searchProcesses(@PathVariable String search) {
        log.info("Received request for Processes search={}", search);
        if (search.length() < 3) {
            throw new ValidationException("Search term must be at least 3 characters");
        }
        List<Process> processes = repository.findByNameContaining(search);
        return ResponseEntity.ok(new RestResponsePage<>(convert(processes, Process::convertToResponse)));
    }

    @ApiOperation(value = "Get count by property")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Counts fetched", response = ProcessCountResponse.class),
            @ApiResponse(code = 500, message = "Internal server error")})
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
            purposeCounts = repository.countPurposeCode();
            listName = ListName.PURPOSE;
        } else if (isSet(request, "department")) {
            purposeCounts = repository.countDepartmentCode();
            listName = ListName.DEPARTMENT;
        } else if (isSet(request, "subDepartment")) {
            purposeCounts = repository.countSubDepartmentCode();
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

    static class ProcessPolicyPage extends RestResponsePage<ProcessResponse> {

    }
}
