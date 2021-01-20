package no.nav.data.polly.process.dpprocess;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.exceptions.ValidationException;
import no.nav.data.common.rest.PageParameters;
import no.nav.data.common.rest.RestResponsePage;
import no.nav.data.polly.process.dpprocess.domain.DpProcess;
import no.nav.data.polly.process.dpprocess.domain.repo.DpProcessRepository;
import no.nav.data.polly.process.dpprocess.dto.DpProcessRequest;
import no.nav.data.polly.process.dpprocess.dto.DpProcessResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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

import static no.nav.data.common.utils.StreamUtils.convert;

@Slf4j
@RestController
@Tag(name = "DpProcess", description = "Data Catalog DpProcess")
@RequestMapping("/dpprocess")
public class DpProcessController {

    private final DpProcessRepository repository;
    private final DpProcessService service;

    public DpProcessController(DpProcessRepository repository, DpProcessService service) {
        this.repository = repository;
        this.service = service;
    }

    @Operation(summary = "Get DpProcessTypes")
    @ApiResponse(description = "DpProcess fetched")
    @GetMapping("/{id}")
    public ResponseEntity<DpProcessResponse> findForId(@PathVariable UUID id) {
        log.info("Received request for DpProcess with id={}", id);
        var process = repository.findById(id).map(DpProcess::convertToResponse);
        if (process.isEmpty()) {
            log.info("Cannot find DpProcess with id={}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(process.get());
    }

    @Operation(summary = "Get All DpProcesses")
    @ApiResponse(description = "All Processes fetched")
    @GetMapping
    public ResponseEntity<RestResponsePage<DpProcessResponse>> getAll(PageParameters pageParameters) {
        log.info("Received request for all DpProcesses");
        var page = repository.findAll(pageParameters.createIdSortedPage()).map(DpProcess::convertToResponse);
        return ResponseEntity.ok(new RestResponsePage<>(page));
    }

    @Operation(summary = "Search DpProcesses")
    @ApiResponse(description = "DpProcesses fetched")
    @GetMapping("/search/{search}")
    public ResponseEntity<RestResponsePage<DpProcessResponse>> search(@PathVariable String search) {
        log.info("Received request for DpProcesses search={}", search);
        if (search.length() < 3) {
            throw new ValidationException("Search term must be at least 3 characters");
        }
        var processes = repository.findByNameContaining(search);
        return ResponseEntity.ok(new RestResponsePage<>(convert(processes, DpProcess::convertToResponse)));
    }

    @Operation(summary = "Create DpProcesses")
    @ApiResponse(responseCode = "201", description = "DpProcesses to be created successfully accepted")
    @PostMapping
    public ResponseEntity<DpProcessResponse> create(@RequestBody DpProcessRequest request) {
        log.info("Received requests to create DpProcess");
        service.validateRequest(request, false);

        DpProcess process = service.save(new DpProcess().convertFromRequest(request));
        return new ResponseEntity<>(process.convertToResponse(), HttpStatus.CREATED);
    }

    @Operation(summary = "Update DpProcess")
    @ApiResponse(description = "DpProcess updated")
    @PutMapping("/{id}")
    public ResponseEntity<DpProcessResponse> update(@PathVariable UUID id, @Valid @RequestBody DpProcessRequest request) {
        log.debug("Received request to update DpProcess with id={}", id);
        if (!Objects.equals(id, request.getIdAsUUID())) {
            throw new ValidationException(String.format("id mismatch in request %s and path %s", request.getId(), id));
        }
        Optional<DpProcess> fromRepository = repository.findById(id);
        if (fromRepository.isEmpty()) {
            log.info("Cannot find DpProcess with id={}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        service.validateRequest(request, true);
        return ResponseEntity.ok(service.update(request).convertToResponse());
    }

    @Operation(summary = "Delete DpProcess")
    @ApiResponse(description = "DpProcess deleted")
    @DeleteMapping("/{id}")
    public ResponseEntity<DpProcessResponse> delete(@PathVariable UUID id) {
        log.info("Received a request to delete DpProcess with id={}", id);
        Optional<DpProcess> fromRepository = repository.findById(id);
        if (fromRepository.isEmpty()) {
            log.info("Cannot find DpProcess with id={}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        service.deleteById(id);
        return new ResponseEntity<>(fromRepository.get().convertToResponse(), HttpStatus.OK);
    }

    static class DpProcessPage extends RestResponsePage<DpProcessResponse> {

    }

}
