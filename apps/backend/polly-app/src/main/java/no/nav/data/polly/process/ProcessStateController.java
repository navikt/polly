package no.nav.data.polly.process;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.rest.RestResponsePage;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessRepository;
import no.nav.data.polly.process.domain.StateDbRequest;
import no.nav.data.polly.process.dto.ProcessShortResponse;
import no.nav.data.polly.process.dto.ProcessStateRequest;
import no.nav.data.polly.process.dto.ProcessStateRequest.ProcessState;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static no.nav.data.common.utils.StreamUtils.convert;

@Slf4j
@RestController
@Api(value = "Process State", tags = {"Process"})
@RequestMapping("/process/state")
public class ProcessStateController {

    private final ProcessRepository processRepository;

    public ProcessStateController(ProcessRepository processRepository) {
        this.processRepository = processRepository;
    }

    @ApiOperation(value = "Get Process for state")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Process fetched", response = ProcessShortPage.class)})
    @GetMapping
    public RestResponsePage<ProcessShortResponse> getProcesses(ProcessStateRequest request) {
        request.validateFieldsAndThrow();
        if (request.getProcessField().alertEvent && request.getProcessState() != ProcessState.YES) {
            return new RestResponsePage<>(List.of());
        }
        List<Process> processes = processRepository.findForState(
                new StateDbRequest(request.getProcessField(), request.getProcessState(), request.getDepartment(), null, request.getProcessStatus().processStatus));
        return new RestResponsePage<>(convert(processes, Process::convertToShortResponse));
    }

    static class ProcessShortPage extends RestResponsePage<ProcessShortResponse> {

    }
}
