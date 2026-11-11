package no.nav.data.polly.databehandler;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.exceptions.ValidationException;
import no.nav.data.common.rest.PageParameters;
import no.nav.data.common.rest.RestResponsePage;
import no.nav.data.polly.databehandler.domain.Databehandler;
import no.nav.data.polly.databehandler.domain.repo.DatabehandlerRepository;
import no.nav.data.polly.databehandler.dto.DatabehandlerRequest;
import no.nav.data.polly.databehandler.dto.DatabehandlerRequestValidator;
import no.nav.data.polly.databehandler.dto.DatabehandlerResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

import static no.nav.data.common.utils.StreamUtils.convert;

@Slf4j
@RestController
@Tag(name = "Databehandler")
@RequiredArgsConstructor
@RequestMapping("/databehandler")
public class DatabehandlerController {

    // TODO: Implementerer ikke controller → service → DB. Flytt all forretningslogikk, *Repository-aksess og @Transactional til tjenestelaget.
    
    private final DatabehandlerRepository repository;
    private final DatabehandlerService service;
    private final DatabehandlerRequestValidator requestValidator;

    @Operation(summary = "Get Databehandler")
    @ApiResponse(description = "Databehandler fetched")
    @GetMapping("/{id}")
    public ResponseEntity<DatabehandlerResponse> findForId(@PathVariable UUID id) {
        log.info("Received request for Databehandler with id={}", id);
        var databehandler = repository.findById(id).map(DatabehandlerResponse::buidFrom);
        if (databehandler.isEmpty()) {
            log.info("Cannot find Databehandler with id={}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(databehandler.get());
    }

    @Operation(summary = "Get All Databehandlere")
    @ApiResponse(description = "All Databehandlere fetched")
    @GetMapping
    public ResponseEntity<RestResponsePage<DatabehandlerResponse>> getAll(PageParameters pageParameters) {
        log.info("Received request for all Databehandlere");
        var page = repository.findAll(pageParameters.createIdSortedPage()).map(DatabehandlerResponse::buidFrom);
        return ResponseEntity.ok(new RestResponsePage<>(page));
    }

    @Operation(summary = "Search Databehandlere")
    @ApiResponse(description = "Databehandlere fetched")
    @GetMapping("/search/{search}")
    public ResponseEntity<RestResponsePage<DatabehandlerResponse>> search(@PathVariable String search) {
        log.info("Received request for Databehandlere search={}", search);
        if (search.length() < 3) {
            throw new ValidationException("Search term must be at least 3 characters");
        }
        var databehandlere = repository.findByNavnContaining(search);
        return ResponseEntity.ok(new RestResponsePage<>(convert(databehandlere, DatabehandlerResponse::buidFrom)));
    }

    @Operation(summary = "Create Databehandler")
    @ApiResponse(responseCode = "201", description = "Databehandler to be created successfully accepted")
    @PostMapping
    public ResponseEntity<DatabehandlerResponse> create(@RequestBody DatabehandlerRequest request) {
        log.info("Received requests to create Databehandler");
        requestValidator.validateRequest(request, false);

        Databehandler databehandler = service.save(new Databehandler().convertFromRequest(request));
        return new ResponseEntity<>(DatabehandlerResponse.buidFrom(databehandler), HttpStatus.CREATED);
    }

    @Operation(summary = "Update Databehandler")
    @ApiResponse(description = "Databehandler updated")
    @PutMapping("/{id}")
    public ResponseEntity<DatabehandlerResponse> update(@PathVariable UUID id, @Valid @RequestBody DatabehandlerRequest request) {
        log.debug("Received request to update Databehandler with id={}", id);
        if (!Objects.equals(id, request.getIdAsUUID())) {
            throw new ValidationException(String.format("id mismatch in request %s and path %s", request.getId(), id));
        }
        Optional<Databehandler> fromRepository = repository.findById(id);
        if (fromRepository.isEmpty()) {
            log.info("Cannot find Databehandler with id={}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        requestValidator.validateRequest(request, true);
        return ResponseEntity.ok(DatabehandlerResponse.buidFrom(service.update(request)));
    }

    @Operation(summary = "Delete Databehandler")
    @ApiResponse(description = "Databehandler deleted")
    @DeleteMapping("/{id}")
    public ResponseEntity<DatabehandlerResponse> delete(@PathVariable UUID id, @RequestParam(required = false) Integer expectedVersion) {
        log.info("Received a request to delete Databehandler with id={} and version={}", id, expectedVersion);
        Databehandler deletedDatabehandler = service.deleteById(id, expectedVersion);
        log.info("Databehandler with id={} deleted", id);
        return ResponseEntity.ok(DatabehandlerResponse.buidFrom(deletedDatabehandler));
    }

    static class DatabehandlerPage extends RestResponsePage<DatabehandlerResponse> {
    }

}
