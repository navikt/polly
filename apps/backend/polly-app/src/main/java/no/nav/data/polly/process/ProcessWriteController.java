package no.nav.data.polly.process;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.exceptions.ValidationException;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.repo.ProcessRepository;
import no.nav.data.polly.process.dto.ProcessRequest;
import no.nav.data.polly.process.dto.ProcessResponse;
import no.nav.data.polly.process.dto.ProcessRevisionRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
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
@Transactional
@Tag(name = "Process", description = "REST API for Process")
@RequestMapping("/process")
public class ProcessWriteController {

    private final ProcessService service;
    private final ProcessRepository repository;

    public ProcessWriteController(ProcessService service, ProcessRepository repository) {
        this.service = service;
        this.repository = repository;
    }

    @Operation(summary = "Create Processes")
    @ApiResponse(responseCode = "201", description = "Processes to be created successfully accepted")
    @PostMapping
    public ResponseEntity<ProcessResponse> createProcesses(@RequestBody ProcessRequest request) {
        log.info("Received requests to create Process");
        service.validateRequest(request, false);

        request.setNewProcessNumber(repository.nextProcessNumber());
        Process process = service.save(new Process().convertFromRequest(request));
        return new ResponseEntity<>(process.convertToResponseWithPolicies(), HttpStatus.CREATED);
    }

    @Operation(summary = "Update Process")
    @ApiResponse(description = "Process updated")
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
        return ResponseEntity.ok(service.update(request).convertToResponseWithPolicies());
    }

    @Operation(summary = "Delete Process")
    @ApiResponse(description = "Process deleted")
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<ProcessResponse> deleteProcessById(@PathVariable UUID id) {
        log.info("Received a request to delete Process with id={}", id);
        Optional<Process> fromRepository = repository.findById(id);
        if (fromRepository.isEmpty()) {
            log.info("Cannot find Process with id={}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        service.deleteById(id);
        log.info("Process with id={} deleted", id);
        return new ResponseEntity<>(fromRepository.get().convertToResponse(), HttpStatus.OK);
    }

    @Operation(summary = "Set revision for processe(s)")
    @PostMapping("/revision")
    @Transactional
    public void requireRevision(@RequestBody ProcessRevisionRequest request) {
        log.info("Request for revision {}", request);
        request.validateFieldsAndThrow();

        // TODO on affected processes, set revision needed status, revision text. Send mail to last edited by.
    }

}
