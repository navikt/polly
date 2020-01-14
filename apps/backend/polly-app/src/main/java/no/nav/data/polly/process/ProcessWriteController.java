package no.nav.data.polly.process;


import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.common.exceptions.ValidationException;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessRepository;
import no.nav.data.polly.process.dto.ProcessRequest;
import no.nav.data.polly.process.dto.ProcessResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import javax.validation.Valid;

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
            @ApiResponse(code = 201, message = "Processes to be created successfully accepted", response = ProcessResponse.class),
            @ApiResponse(code = 400, message = "Illegal arguments"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @PostMapping
    public ResponseEntity<ProcessResponse> createProcesses(@RequestBody ProcessRequest request) {
        log.info("Received requests to create Process");
        service.validateRequest(request, false);

        Process process = repository.save(new Process().convertFromRequest(request));
        return new ResponseEntity<>(process.convertToResponseWithPolicies(), HttpStatus.CREATED);
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
        service.validateRequest(request, true);
        var process = fromRepository.get().convertFromRequest(request);
        return ResponseEntity.ok(repository.save(process).convertToResponseWithPolicies());
    }

    @ApiOperation(value = "Delete Process")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Process deleted", response = ProcessResponse.class),
            @ApiResponse(code = 404, message = "Process not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<ProcessResponse> deleteProcessById(@PathVariable UUID id) {
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

}
