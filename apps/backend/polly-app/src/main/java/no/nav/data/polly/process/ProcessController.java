package no.nav.data.polly.process;


import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.common.exceptions.PollyNotFoundException;
import no.nav.data.polly.common.rest.PageParameters;
import no.nav.data.polly.common.rest.RestResponsePage;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessRepository;
import no.nav.data.polly.process.dto.ProcessResponse;
import no.nav.data.polly.purpose.dto.PurposeResponse;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.transaction.Transactional;

@Slf4j
@RestController
@CrossOrigin
@Api(value = "Data Catalog Process", description = "REST API for Process", tags = {"Process"})
@RequestMapping("/process")
public class ProcessController {

    private final ProcessService processService;
    private final ProcessRepository processRepository;

    public ProcessController(ProcessService processService, ProcessRepository processRepository) {
        this.processService = processService;
        this.processRepository = processRepository;
    }

    @ApiOperation(value = "Get All Processes")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "All Processes fetched", response = ProcessPage.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping
    public ResponseEntity<RestResponsePage<ProcessResponse>> getProcess(PageParameters pageParameters) {
        Page<ProcessResponse> all = processRepository.findAll(pageParameters.createIdSortedPage()).map(Process::convertToResponse);
        return ResponseEntity.ok(new RestResponsePage<>(all));
    }

    @ApiOperation(value = "Get InformationTypes for Process")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Process fetched", response = PurposeResponse.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/{processName}")
    @Transactional
    public ResponseEntity<ProcessResponse> getProcess(@PathVariable String processName) {
        var process = processRepository.findByName(processName).map(Process::convertToResponseWithInformationTypes)
                .orElseThrow(() -> new PollyNotFoundException("No process named " + processName));
        return ResponseEntity.ok(process);
    }

    static class ProcessPage extends RestResponsePage<ProcessResponse> {

    }
}
