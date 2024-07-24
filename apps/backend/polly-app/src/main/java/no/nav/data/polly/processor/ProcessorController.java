package no.nav.data.polly.processor;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.exceptions.ValidationException;
import no.nav.data.common.rest.PageParameters;
import no.nav.data.common.rest.RestResponsePage;
import no.nav.data.polly.processor.domain.Processor;
import no.nav.data.polly.processor.domain.repo.ProcessorRepository;
import no.nav.data.polly.processor.dto.ProcessorRequest;
import no.nav.data.polly.processor.dto.ProcessorRequestValidator;
import no.nav.data.polly.processor.dto.ProcessorResponse;
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

import static no.nav.data.common.utils.StreamUtils.convert;

@Slf4j
@RestController
@Tag(name = "Data Processor")
@RequiredArgsConstructor
@RequestMapping("/processor")
public class ProcessorController {

    // TODO: Implementerer ikke controller → service → DB. Flytt all forretningslogikk, *Repository-aksess og @Transactional til tjenestelaget.
    
    private final ProcessorRepository repository;
    private final ProcessorService service;
    private final ProcessorRequestValidator requestValidator;

    @Operation(summary = "Get ProcessorTypes")
    @ApiResponse(description = "Processor fetched")
    @GetMapping("/{id}")
    public ResponseEntity<ProcessorResponse> findForId(@PathVariable UUID id) {
        log.info("Received request for Processor with id={}", id);
        var processor = repository.findById(id).map(ProcessorResponse::buidFrom);
        if (processor.isEmpty()) {
            log.info("Cannot find Processor with id={}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(processor.get());
    }

    @Operation(summary = "Get All Processors")
    @ApiResponse(description = "All Processes fetched")
    @GetMapping
    public ResponseEntity<RestResponsePage<ProcessorResponse>> getAll(PageParameters pageParameters) {
        log.info("Received request for all Processors");
        var page = repository.findAll(pageParameters.createIdSortedPage()).map(ProcessorResponse::buidFrom);
        return ResponseEntity.ok(new RestResponsePage<>(page));
    }

    @Operation(summary = "Search Processors")
    @ApiResponse(description = "Processors fetched")
    @GetMapping("/search/{search}")
    public ResponseEntity<RestResponsePage<ProcessorResponse>> search(@PathVariable String search) {
        log.info("Received request for Processors search={}", search);
        if (search.length() < 3) {
            throw new ValidationException("Search term must be at least 3 characters");
        }
        var processors = repository.findByNameContaining(search);
        return ResponseEntity.ok(new RestResponsePage<>(convert(processors, ProcessorResponse::buidFrom)));
    }

    @Operation(summary = "Create Processors")
    @ApiResponse(responseCode = "201", description = "Processors to be created successfully accepted")
    @PostMapping
    public ResponseEntity<ProcessorResponse> create(@RequestBody ProcessorRequest request) {
        log.info("Received requests to create Processor");
        requestValidator.validateRequest(request, false);

        Processor processor = service.save(new Processor().convertFromRequest(request));
        return new ResponseEntity<>(ProcessorResponse.buidFrom(processor), HttpStatus.CREATED);
    }

    @Operation(summary = "Update Processor")
    @ApiResponse(description = "Processor updated")
    @PutMapping("/{id}")
    public ResponseEntity<ProcessorResponse> update(@PathVariable UUID id, @Valid @RequestBody ProcessorRequest request) {
        log.debug("Received request to update Processor with id={}", id);
        if (!Objects.equals(id, request.getIdAsUUID())) {
            throw new ValidationException(String.format("id mismatch in request %s and path %s", request.getId(), id));
        }
        Optional<Processor> fromRepository = repository.findById(id);
        if (fromRepository.isEmpty()) {
            log.info("Cannot find Processor with id={}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        requestValidator.validateRequest(request, true);
        return ResponseEntity.ok(ProcessorResponse.buidFrom(service.update(request)));
    }

    @Operation(summary = "Delete Processor")
    @ApiResponse(description = "Processor deleted")
    @DeleteMapping("/{id}")
    public ResponseEntity<ProcessorResponse> delete(@PathVariable UUID id) {
        log.info("Received a request to delete Processor with id={}", id);
        Optional<Processor> fromRepository = repository.findById(id);
        if (fromRepository.isEmpty()) {
            log.info("Cannot find Processor with id={}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        service.deleteById(id);
        return new ResponseEntity<>(ProcessorResponse.buidFrom(fromRepository.get()), HttpStatus.OK);
    }

    static class ProcessorPage extends RestResponsePage<ProcessorResponse> {
    }

}
