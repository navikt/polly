package no.nav.data.polly.process;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.exceptions.ValidationException;
import no.nav.data.common.rest.PageParameters;
import no.nav.data.common.rest.RestResponsePage;
import no.nav.data.polly.process.domain.DpProcess;
import no.nav.data.polly.process.domain.repo.DpProcessRepository;
import no.nav.data.polly.process.dto.DpProcessRequest;
import no.nav.data.polly.process.dto.DpProcessResponse;
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
@Api(value = "Data Catalog DpProcess", tags = {"DpProcess"})
@RequestMapping("/dpprocess")
public class DpProcessController {

    private final DpProcessRepository repository;
    private final DpProcessService service;

    public DpProcessController(DpProcessRepository repository, DpProcessService service) {
        this.repository = repository;
        this.service = service;
    }

    @ApiOperation(value = "Get DpProcessTypes")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "DpProcess fetched", response = DpProcessResponse.class),
            @ApiResponse(code = 404, message = "DpProcess not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
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

    @ApiOperation(value = "Get All DpProcesses")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "All Processes fetched", response = DpProcessPage.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping
    public ResponseEntity<RestResponsePage<DpProcessResponse>> getAll(PageParameters pageParameters) {
        log.info("Received request for all DpProcesses");
        var page = repository.findAll(pageParameters.createIdSortedPage()).map(DpProcess::convertToResponse);
        return ResponseEntity.ok(new RestResponsePage<>(page));
    }

    @ApiOperation(value = "Search DpProcesses")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "DpProcesses fetched", response = DpProcessPage.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/search/{search}")
    public ResponseEntity<RestResponsePage<DpProcessResponse>> search(@PathVariable String search) {
        log.info("Received request for DpProcesses search={}", search);
        if (search.length() < 3) {
            throw new ValidationException("Search term must be at least 3 characters");
        }
        var processes = repository.findByNameContaining(search);
        return ResponseEntity.ok(new RestResponsePage<>(convert(processes, DpProcess::convertToResponse)));
    }

    @ApiOperation(value = "Create DpProcesses")
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "DpProcesses to be created successfully accepted", response = DpProcessResponse.class),
            @ApiResponse(code = 400, message = "Illegal arguments"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @PostMapping
    public ResponseEntity<DpProcessResponse> create(@RequestBody DpProcessRequest request) {
        log.info("Received requests to create DpProcess");
        service.validateRequest(request, false);

        DpProcess process = service.save(new DpProcess().convertFromRequest(request));
        return new ResponseEntity<>(process.convertToResponse(), HttpStatus.CREATED);
    }

    @ApiOperation(value = "Update DpProcess")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "DpProcess updated", response = DpProcessResponse.class),
            @ApiResponse(code = 404, message = "DpProcess not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
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

    @ApiOperation(value = "Delete DpProcess")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "DpProcess deleted", response = DpProcessResponse.class),
            @ApiResponse(code = 404, message = "DpProcess not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
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
