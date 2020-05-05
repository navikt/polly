package no.nav.data.polly.document;


import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.common.exceptions.ValidationException;
import no.nav.data.polly.common.rest.PageParameters;
import no.nav.data.polly.common.rest.RestResponsePage;
import no.nav.data.polly.common.utils.StreamUtils;
import no.nav.data.polly.document.domain.Document;
import no.nav.data.polly.document.domain.DocumentRepository;
import no.nav.data.polly.document.dto.DocumentRequest;
import no.nav.data.polly.document.dto.DocumentResponse;
import no.nav.data.polly.informationtype.dto.InformationTypeShortResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.CrossOrigin;
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
import javax.validation.Valid;

import static java.util.Comparator.comparing;
import static no.nav.data.polly.common.utils.StartsWithComparator.startsWith;

@Slf4j
@RestController
@CrossOrigin
@RequestMapping("/document")
@Api(value = "Document", description = "REST API for Document", tags = {"Document"})
public class DocumentController {

    private final DocumentRepository repository;
    private final DocumentService service;

    public DocumentController(DocumentRepository repository, DocumentService service) {
        this.repository = repository;
        this.service = service;
    }

    @ApiOperation(value = "Get All Documents")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "All Documents fetched", response = DocumentPage.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping
    public ResponseEntity<RestResponsePage<DocumentResponse>> getAll(PageParameters pageParameters,
            @RequestParam(required = false) UUID informationTypeId
    ) {
        log.info("Received request for all Documents. informationType={}", informationTypeId);
        if (informationTypeId != null) {
            var doc = repository.findByInformationTypeId(informationTypeId);
            return returnResults(new RestResponsePage<>(StreamUtils.convert(doc, this::convertToResponseWithInfoTypes)));
        }
        return returnResults(new RestResponsePage<>(repository.findAll(pageParameters.createIdSortedPage()).map(Document::convertToResponse)));
    }

    @ApiOperation(value = "Get All Documents")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "All Documents fetched", response = DocumentPage.class),
            @ApiResponse(code = 500, message = "Internal server error")})
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

    @ApiOperation(value = "Get Document")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Document fetched", response = DocumentResponse.class),
            @ApiResponse(code = 404, message = "Document not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
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

    @ApiOperation(value = "Create Document")
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "Document successfully created", response = DocumentResponse.class),
            @ApiResponse(code = 400, message = "Illegal arguments"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<DocumentResponse> createPolicy(@Valid @RequestBody DocumentRequest request) {
        log.debug("Received request to create Document");
        return new ResponseEntity<>(convertToResponseWithInfoTypes(service.save(request)), HttpStatus.CREATED);
    }

    @ApiOperation(value = "Update Document")
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "Document successfully updated", response = DocumentResponse.class),
            @ApiResponse(code = 400, message = "Illegal arguments"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @PutMapping("/{id}")
    public ResponseEntity<DocumentResponse> updatePolicy(@PathVariable UUID id, @Valid @RequestBody DocumentRequest request) {
        log.debug("Received request to update Document");
        Assert.isTrue(id.equals(request.getIdAsUUID()), "id mismatch");
        return ResponseEntity.ok(convertToResponseWithInfoTypes(service.update(request)));
    }

    @ApiOperation(value = "Delete Document")
    @ApiResponses(value = {
            @ApiResponse(code = 202, message = "Document deleted"),
            @ApiResponse(code = 404, message = "Document not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<DocumentResponse> deleteDocumentById(@PathVariable UUID id) {
        log.info("Received a request to delete Document with id={}", id);
        var doc = service.delete(id);
        log.info("Document with id={} deleted", id);
        return new ResponseEntity<>(convertToResponseWithInfoTypes(doc), HttpStatus.OK);
    }

    private DocumentResponse convertToResponseWithInfoTypes(Document document) {
        var response = document.convertToResponse();
        Map<UUID, InformationTypeShortResponse> informationTypes = service.getInformationTypes(document);
        response.getInformationTypes().forEach(it -> it.setInformationType(informationTypes.get(it.getInformationTypeId())));
        return response;
    }

    static class DocumentPage extends RestResponsePage<DocumentResponse> {

    }
}
