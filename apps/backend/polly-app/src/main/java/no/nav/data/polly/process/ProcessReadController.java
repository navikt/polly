package no.nav.data.polly.process;


import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.common.rest.PageParameters;
import no.nav.data.polly.common.rest.RestResponsePage;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessRepository;
import no.nav.data.polly.process.dto.ProcessPolicyResponse;
import no.nav.data.polly.process.dto.ProcessResponse;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;
import java.util.UUID;
import javax.transaction.Transactional;

@Slf4j
@RestController
@CrossOrigin
@Api(value = "Data Catalog Process", description = "REST API for Process", tags = {"Process"})
@RequestMapping("/process")
public class ProcessReadController {

    private final ProcessService service;
    private final ProcessRepository repository;

    public ProcessReadController(ProcessService service, ProcessRepository repository) {
        this.service = service;
        this.repository = repository;
    }

    @ApiOperation(value = "Get Process with InformationTypes")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Process fetched", response = ProcessPolicyResponse.class),
            @ApiResponse(code = 404, message = "Process not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/{id}")
    @Transactional
    public ResponseEntity<ProcessPolicyResponse> findForId(@PathVariable UUID id) {
        log.info("Received request for Process with id={}", id);
        Optional<ProcessPolicyResponse> process = repository.findById(id).map(Process::convertToResponseWithPolicies);
        if (process.isEmpty()) {
            log.info("Cannot find the Process with id={}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        log.info("Returned Process");
        return ResponseEntity.ok(process.get());
    }

    @ApiOperation(value = "Get All Processes")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "All Processes fetched", response = ProcessPage.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping
    public ResponseEntity<RestResponsePage<ProcessResponse>> getAllProcesses(PageParameters pageParameters) {
        log.info("Received request for all Processes");
        Page<ProcessResponse> page = repository.findAll(pageParameters.createIdSortedPage()).map(Process::convertToResponse);
        log.info("Returned {} Processes", page.getNumberOfElements());
        return ResponseEntity.ok(new RestResponsePage<>(page));
    }

    @ApiOperation(value = "Count all Processes")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Count of Processes fetched", response = Long.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/count")
    public Long countAllProcesses() {
        log.info("Received request for count all Processes");
        return repository.count();
    }

    static class ProcessPage extends RestResponsePage<ProcessResponse> {

    }

    static class ProcessPolicyPage extends RestResponsePage<ProcessPolicyResponse> {

    }
}
