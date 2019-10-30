package no.nav.data.polly.process;


import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.common.rest.PageParameters;
import no.nav.data.polly.common.rest.RestResponsePage;
import no.nav.data.polly.common.utils.StreamUtils;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessRepository;
import no.nav.data.polly.process.dto.ProcessRequest;
import no.nav.data.polly.process.dto.ProcessResponse;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.transaction.Transactional;

import static no.nav.data.polly.common.utils.StreamUtils.convert;

@Slf4j
@RestController
@CrossOrigin
@Api(value = "Data Catalog Process", description = "REST API for Process", tags = {"Process"})
@RequestMapping("/process")
public class ProcessController {

    private final ProcessService service;
    private final ProcessRepository repository;

    public ProcessController(ProcessService service, ProcessRepository repository) {
        this.service = service;
        this.repository = repository;
    }

    @ApiOperation(value = "Get All Processes")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "All Processes fetched", response = ProcessPage.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping
    public ResponseEntity<RestResponsePage<ProcessResponse>> getAllProcesses(PageParameters pageParameters) {
        log.info("Received request for all Processes");
        Page<ProcessResponse> all = repository.findAll(pageParameters.createIdSortedPage()).map(Process::convertToResponse);
        log.info("Returned {} Processes", all.getNumberOfElements());
        return ResponseEntity.ok(new RestResponsePage<>(all));
    }

    @ApiOperation(value = "Get Process with InformationTypes")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Process fetched", response = ProcessResponse.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/name/{processName}")
    @Transactional
    public ResponseEntity<ProcessResponse> getProcess(@PathVariable String processName) {
        log.info("Received request for Process with name={}", processName);
        var process = repository.findByName(processName).map(Process::convertToResponseWithInformationTypes);
        if (process.isEmpty()) {
            log.info("Cannot find the Process with name={}", processName);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        log.info("Returned Process");

        return ResponseEntity.ok(process.get());
    }

    @ApiOperation(value = "Get Process")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Process fetched", response = ProcessResponse.class),
            @ApiResponse(code = 404, message = "Process not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/{id}")
    @Transactional
    public ResponseEntity<ProcessResponse> findForId(@PathVariable UUID id) {
        log.info("Received request for Process with id={}", id);
        Optional<ProcessResponse> process = repository.findById(id).map(Process::convertToResponseWithInformationTypes);
        if (process.isEmpty()) {
            log.info("Cannot find the Process with id={}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        log.info("Returned Process");
        return ResponseEntity.ok(process.get());
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

    @ApiOperation(value = "Create Processes")
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "Processes to be created successfully accepted", response = ProcessPage.class),
            @ApiResponse(code = 400, message = "Illegal arguments"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @PostMapping
    public ResponseEntity<RestResponsePage<ProcessResponse>> createProcesses(@RequestBody List<ProcessRequest> requests) {
        log.info("Received requests to create Processes");
        requests = StreamUtils.nullToEmptyList(requests);
        service.validateRequest(requests);

        List<Process> processes = repository.saveAll(convert(requests, ProcessRequest::convertToProcess));
        List<ProcessResponse> responses = processes.stream().map(Process::convertToResponse).collect(Collectors.toList());
        return new ResponseEntity<>(new RestResponsePage<>(responses), HttpStatus.CREATED);
    }

    @ApiOperation(value = "Delete Process")
    @ApiResponses(value = {
            @ApiResponse(code = 202, message = "Process deleted"),
            @ApiResponse(code = 404, message = "Process not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity deleteProcessById(@PathVariable UUID id) {
        log.info("Received a request to delete Process with id={}", id);
        Optional<Process> fromRepository = repository.findById(id);
        if (fromRepository.isEmpty()) {
            log.info("Cannot find Process with id={}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        repository.deleteById(id);
        log.info("Process with id={} deleted", id);
        return new ResponseEntity<>(fromRepository.get().convertToResponse(), HttpStatus.OK);
    }

    static class ProcessPage extends RestResponsePage<ProcessResponse> {

    }
}
