package no.nav.data.polly.process;


import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.common.exceptions.ValidationException;
import no.nav.data.polly.common.rest.RestResponsePage;
import no.nav.data.polly.common.utils.StreamUtils;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessRepository;
import no.nav.data.polly.process.dto.ProcessRequest;
import no.nav.data.polly.process.dto.ProcessResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import javax.validation.Valid;

import static java.util.stream.Collectors.toList;
import static no.nav.data.polly.common.utils.StreamUtils.convert;

@Slf4j
@RestController
@CrossOrigin
@Api(value = "Data Catalog Process", description = "REST API for Process", tags = {"Process"})
@RequestMapping("/process")
public class ProcessWriteController {

    private final ProcessService service;
    private final ProcessRepository repository;

    public ProcessWriteController(ProcessService service, ProcessRepository repository) {
        this.service = service;
        this.repository = repository;
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
        service.validateRequests(requests, false);

        List<Process> processes = repository.saveAll(convert(requests, r -> new Process().convertFromRequest(r)));
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

    @ApiOperation(value = "Update Process")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Process updated", response = ProcessResponse.class),
            @ApiResponse(code = 404, message = "Process not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @PutMapping("/{id}")
    public ResponseEntity<ProcessResponse> updateProcess(@PathVariable UUID id, @Valid @RequestBody ProcessRequest request) {
        log.debug("Received request to update Process with id={}", id);
        if (!Objects.equals(id, request.getIdAsUUID())) {
            throw new ValidationException(String.format("id mismatch in request %s and path %s", request.getId(), id));
        }
        Optional<Process> fromRepository = repository.findById(id);
        if (fromRepository.isEmpty()) {
            log.info("Cannot find Process with id={}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        service.validateRequests(List.of(request), true);
        var process = fromRepository.get().convertFromRequest(request);
        return ResponseEntity.ok(repository.save(process).convertToResponse());
    }

    @ApiOperation(value = "Update Processes")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Polices updated", response = ProcessPage.class),
            @ApiResponse(code = 404, message = "Process not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @PutMapping
    public ResponseEntity<RestResponsePage<ProcessResponse>> updateProcesses(@Valid @RequestBody List<ProcessRequest> requests) {
        log.debug("Received requests to update Processes");
        service.validateRequests(requests, true);
        List<Process> processes = convert(requests, r ->
                repository.findById(r.getIdAsUUID()).map(process -> process.convertFromRequest(r)).orElse(null)
        );
        List<ProcessResponse> response = repository.saveAll(processes).stream().map(Process::convertToResponse).collect(toList());
        return ResponseEntity.ok(new RestResponsePage<>(response));
    }

    static class ProcessPage extends RestResponsePage<ProcessResponse> {

    }

}
