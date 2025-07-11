package no.nav.data.polly.process.dpprocess;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.exceptions.ValidationException;
import no.nav.data.common.rest.PageParameters;
import no.nav.data.common.rest.RestResponsePage;
import no.nav.data.polly.disclosure.domain.Disclosure;
import no.nav.data.polly.disclosure.dto.DisclosureResponse;
import no.nav.data.polly.process.dpprocess.domain.DpProcess;
import no.nav.data.polly.process.dpprocess.domain.repo.DpProcessRepository;
import no.nav.data.polly.process.dpprocess.dto.DpProcessRequest;
import no.nav.data.polly.process.dpprocess.dto.DpProcessRequestValidator;
import no.nav.data.polly.process.dpprocess.dto.DpProcessResponse;
import org.apache.commons.lang3.StringUtils;
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

import java.util.ArrayList;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

import static no.nav.data.common.utils.StreamUtils.convert;

@Slf4j
@RestController
@Tag(name = "DpProcess", description = "Data Catalog DpProcess")
@RequiredArgsConstructor
@RequestMapping("/dpprocess")
public class DpProcessController {

    // TODO: Implementerer ikke controller → service → DB. Flytt all forretningslogikk og *Repository-aksess til tjenestelaget.
    
    private final DpProcessRepository repository;
    private final DpProcessService service;
    private final DpProcessRequestValidator requestValidator;

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

        if(search.toLowerCase().matches("d[0-9]+")){
            repository.searchByDpProcessNumber(search.substring(1)).ifPresent(processes::addAll);
        }
        if (StringUtils.isNumeric(search)) {
            repository.searchByDpProcessNumber(search).ifPresent(processes::addAll);
        }

        return ResponseEntity.ok(new RestResponsePage<>(convert(processes, DpProcess::convertToResponse)));
    }

    @Operation(summary = "Get DpProcesses by department")
    @ApiResponse(description = "DpProcesses fetched")
    @GetMapping("/department/{department}")
    public ResponseEntity<RestResponsePage<DpProcessResponse>> getByDepartment(@PathVariable String department) {
        log.info("Received request for DpProcesses with department={}", department);
        var dpProcessList = new ArrayList<>(repository.findByDepartment(department));
        return ResponseEntity.ok(new RestResponsePage<>(convert(dpProcessList, DpProcess::convertToResponse)));
    }

    @Operation(summary = "Get DpProcesses by productTeam")
    @ApiResponse(description = "DpProcesses fetched")
    @GetMapping("/productTeam/{productTeam}")
    public ResponseEntity<RestResponsePage<DpProcessResponse>> getByProductTeam(@PathVariable String productTeam) {
        log.info("Received request for DpProcesses with productTeam={}", productTeam);
        var dpProcessList = new ArrayList<>(repository.findByProductTeam(productTeam));
        return returnResults(new RestResponsePage<>(convert(dpProcessList, DpProcess::convertToResponse)));
    }

    @Operation(summary = "Create DpProcesses")
    @ApiResponse(responseCode = "201", description = "DpProcesses to be created successfully accepted")
    @PostMapping
    public ResponseEntity<DpProcessResponse> create(@RequestBody DpProcessRequest request) {
        log.info("Received requests to create DpProcess");
        requestValidator.validateRequest(request, false);

        request.setNewDpProcessNmber(repository.nextDpProcessNumber());

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
        requestValidator.validateRequest(request, true);
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

    private ResponseEntity<RestResponsePage<DpProcessResponse>> returnResults(RestResponsePage<DpProcessResponse> page) {
        log.info("Returned {} DpProcesses", page.getNumberOfElements());
        return ResponseEntity.ok(page);
    }

}
