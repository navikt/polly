package no.nav.data.polly.process;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.exceptions.ValidationException;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.repo.ProcessRepository;
import no.nav.data.polly.process.dto.ProcessRequest;
import no.nav.data.polly.process.dto.ProcessRequestValidator;
import no.nav.data.polly.process.dto.ProcessResponse;
import no.nav.data.polly.process.dto.ProcessRevisionRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;
import java.util.UUID;

@Slf4j
@RestController
@Tag(name = "Process", description = "REST API for Process")
@RequestMapping("/process")
@RequiredArgsConstructor
public class ProcessWriteController {

    // TODO: Implementerer ikke controller → service → DB. Flytt all forretningslogikk, *Repository-aksess og @Transactional til tjenestelaget.
    
    private final ProcessService service;
    private final ProcessRequestValidator requestValidator;
    private final ProcessRepository repository;

    @Operation(summary = "Create Processes")
    @ApiResponse(responseCode = "201", description = "Processes to be created successfully accepted")
    @PostMapping
    public ResponseEntity<ProcessResponse> createProcess(@RequestBody ProcessRequest request) {
        log.info("Received requests to create Process");

        requestValidator.validateRequest(request, false);

        request.setNewProcessNumber(repository.nextProcessNumber());
        Process process = new Process().copyFieldsFrom(request);
        service.setOverordnetBehandlingAndUpdateAktivitet(process, request, null);
        process = service.save(process);
        return new ResponseEntity<>(process.convertToResponseWithPoliciesAndUnderordnetBehandlinger(), HttpStatus.CREATED);
    }

    @Operation(summary = "Update Process")
    @ApiResponse(description = "Process updated")
    @PutMapping("/{id}")
    public ResponseEntity<ProcessResponse> updateProcess(@PathVariable UUID id, @Valid @RequestBody ProcessRequest request) {
        log.debug("Received request to update Process with id={}", id);
        if (!Objects.equals(id, request.getIdAsUUID())) {
            throw new ValidationException(String.format("id mismatch in request %s and path %s", request.getId(), id));
        }
        requestValidator.validateRequest(request, true);
        return ResponseEntity.ok(service.update(request).convertToResponseWithPoliciesAndUnderordnetBehandlinger());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ProcessResponse> deleteProcessById(@PathVariable UUID id, @RequestParam(required = false) Integer version) {
        log.info("Received a request to delete Process with id={} and version={}", id, version);
        return ResponseEntity.ok(service.deleteById(id, version).convertToResponse());
    }

    @Operation(summary = "Set revision for processe(s)")
    @PostMapping("/revision")
    public void requireRevision(@RequestBody ProcessRevisionRequest request) {
        log.info("Request for revision {}", request);
        request.validateFieldsAndThrow();

        service.requireRevision(request);
    }

}
