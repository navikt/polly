package no.nav.data.polly.process;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import no.nav.data.common.rest.RestResponsePage;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.repo.ProcessRepository;
import no.nav.data.polly.process.dto.ProcessShortResponse;
import no.nav.data.polly.process.dto.ProcessStateRequest;
import no.nav.data.polly.process.dto.ProcessStateRequest.ProcessState;
import no.nav.data.polly.process.dto.StateDbRequest;
import no.nav.data.polly.teams.TeamService;
import no.nav.data.polly.teams.domain.Team;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static no.nav.data.common.utils.StreamUtils.convert;

@RestController
@Tag(name = "Process", description = "Process State")
@RequestMapping("/process/state")
public class ProcessStateController {

    private final ProcessRepository processRepository;
    private final TeamService teamService;

    public ProcessStateController(ProcessRepository processRepository, TeamService teamService) {
        this.processRepository = processRepository;
        this.teamService = teamService;
    }

    @Operation(summary = "Get Process for state")
    @ApiResponse(description = "Process fetched")
    @GetMapping
    public RestResponsePage<ProcessShortResponse> getProcesses(ProcessStateRequest request) {
        request.validateFieldsAndThrow();
        if (request.getProcessField().alertEvent && request.getProcessState() != ProcessState.YES) {
            return new RestResponsePage<>(List.of());
        }
        List<String> teamIds = null;
        if (request.getProductAreaId() != null) {
            teamIds = convert(teamService.getTeamsForProductArea(request.getProductAreaId()), Team::getId);
        }
        List<Process> processes = processRepository.findForState(
                new StateDbRequest(request.getProcessField(), request.getProcessState(), request.getDepartment(), teamIds, request.getProcessStatus().processStatus));
        return new RestResponsePage<>(convert(processes, Process::convertToShortResponse));
    }

    static class ProcessShortPage extends RestResponsePage<ProcessShortResponse> {

    }
}
