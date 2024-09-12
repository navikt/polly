package no.nav.data.polly.document;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.exceptions.ValidationException;
import no.nav.data.common.rest.PageParameters;
import no.nav.data.common.rest.RestResponsePage;
import no.nav.data.common.utils.StreamUtils;
import no.nav.data.polly.document.domain.Document;
import no.nav.data.polly.document.domain.DocumentRepository;
import no.nav.data.polly.document.dto.DocumentRequest;
import no.nav.data.polly.document.dto.DocumentRequestValidator;
import no.nav.data.polly.document.dto.DocumentResponse;
import no.nav.data.polly.informationtype.dto.InformationTypeShortResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static java.util.Comparator.comparing;
import static no.nav.data.common.utils.StartsWithComparator.startsWith;

@Slf4j
@RestController
@RequestMapping("/document")
@Tag(name = "Document", description = "REST API for Document")
@RequiredArgsConstructor
public class DocumentController {
    
    // TODO: Implementerer ikke controller → service → DB. Flytt all forretningslogikk, *Repository-aksess og @Transactional til tjenestelaget.

    private final DocumentRepository repository;
    private final DocumentService service;
    private final DocumentRequestValidator requestValidator;

    @Operation(summary = "Get All Documents")
    @ApiResponse(description = "All Documents fetched")
    @GetMapping
    public ResponseEntity<RestResponsePage<DocumentResponse>> getAll(PageParameters pageParameters,
            @RequestParam(required = false) UUID informationTypeId
    ) {
        log.info("Received request for all Documents. informationType={}", informationTypeId);
        if (informationTypeId != null) {
            var doc = repository.findByInformationTypeId(informationTypeId);
            return returnResults(new RestResponsePage<>(StreamUtils.convert(doc, this::convertToResponseWithInfoTypes)));
        }
        return returnResults(new RestResponsePage<>(repository.findAll(pageParameters.createIdSortedPage()).map(DocumentResponse::buildFrom)));
    }

    @Operation(summary = "Search Documents")
    @ApiResponse(description = "Found documents fetched")
    @GetMapping("/search/{name}")
    public ResponseEntity<RestResponsePage<DocumentResponse>> search(@PathVariable String name) {
        log.info("Received request for Documents name={}", name);
        if (name.length() < 3) {
            throw new ValidationException("Search term must be at least 3 characters");
        }
        var docs = repository.findByNameLike(name);
        docs.sort(comparing(it -> it.getData().getName(), startsWith(name)));
        return returnResults(new RestResponsePage<>(StreamUtils.convert(docs, this::convertToResponseWithInfoTypes)));
    }

    private ResponseEntity<RestResponsePage<DocumentResponse>> returnResults(RestResponsePage<DocumentResponse> page) {
        log.info("Returned {} Documents", page.getNumberOfElements());
        return ResponseEntity.ok(page);
    }

    @Operation(summary = "Get Document")
    @ApiResponse(description = "Document fetched")
    @GetMapping("/{id}")
    public ResponseEntity<DocumentResponse> findForId(@PathVariable UUID id) {
        log.info("Received request for Document with the id={}", id);
        Optional<DocumentResponse> documentResponse = repository.findById(id).map(this::convertToResponseWithInfoTypes);
        if (documentResponse.isEmpty()) {
            log.info("Cannot find the Document with id={}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        log.info("Returned Document");
        return new ResponseEntity<>(documentResponse.get(), HttpStatus.OK);
    }

    @Operation(summary = "Create Document")
    @ApiResponse(responseCode = "201", description = "Document successfully created")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<DocumentResponse> createPolicy(@Valid @RequestBody DocumentRequest request) {
        log.debug("Received request to create Document");
        requestValidator.validateRequest(request, false);
        var setup = service.save(request);
        return new ResponseEntity<>(convertToResponseWithInfoTypes(setup), HttpStatus.CREATED);
    }

    @Operation(summary = "Update Document")
    @ApiResponse(description = "Document successfully updated")
    @PutMapping("/{id}")
    public ResponseEntity<DocumentResponse> updatePolicy(@PathVariable UUID id, @Valid @RequestBody DocumentRequest request) {
        log.debug("Received request to update Document");
        Assert.isTrue(id.equals(request.getIdAsUUID()), "id mismatch");
        requestValidator.validateRequest(request, true);
        return ResponseEntity.ok(convertToResponseWithInfoTypes(service.update(request.convertToDocument())));
    }

    @Operation(summary = "Delete Document")
    @ApiResponse(description = "Document deleted")
    @DeleteMapping("/{id}")
    @Transactional // TODO: Flytt til tjenestelaget
    public ResponseEntity<DocumentResponse> deleteDocumentById(@PathVariable UUID id) {
        log.info("Received a request to delete Document with id={}", id);
        var doc = service.delete(id);
        log.info("Document with id={} deleted", id);
        return new ResponseEntity<>(convertToResponseWithInfoTypes(doc), HttpStatus.OK);
    }

    private DocumentResponse convertToResponseWithInfoTypes(Document document) {
        var response = DocumentResponse.buildFrom(document);
        Map<UUID, InformationTypeShortResponse> informationTypes = service.getInformationTypes(document);
        response.getInformationTypes().forEach(it -> it.setInformationType(informationTypes.get(it.getInformationTypeId())));
        return response;
    }

    static class DocumentPage extends RestResponsePage<DocumentResponse> {

    }
}
