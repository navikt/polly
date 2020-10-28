package no.nav.data.polly.disclosure;


import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.rest.PageParameters;
import no.nav.data.common.rest.RestResponsePage;
import no.nav.data.polly.disclosure.domain.Disclosure;
import no.nav.data.polly.disclosure.domain.DisclosureRepository;
import no.nav.data.polly.disclosure.dto.DisclosureRequest;
import no.nav.data.polly.disclosure.dto.DisclosureResponse;
import no.nav.data.polly.document.DocumentService;
import no.nav.data.polly.informationtype.InformationTypeRepository;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.repo.ProcessRepository;
import org.apache.commons.lang3.StringUtils;
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

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import javax.validation.Valid;

import static no.nav.data.common.utils.StreamUtils.convert;

@Slf4j
@RestController
@RequestMapping("/disclosure")
@Api(value = "Disclosure", tags = {"Disclosure"})
public class DisclosureController {

    private final DisclosureRepository repository;
    private final DisclosureService service;

    private final DocumentService documentService;
    private final InformationTypeRepository informationTypeRepository;
    private final ProcessRepository processRepository;

    public DisclosureController(DisclosureRepository repository, DisclosureService service, DocumentService documentService,
            InformationTypeRepository informationTypeRepository, ProcessRepository processRepository) {
        this.repository = repository;
        this.service = service;
        this.documentService = documentService;
        this.informationTypeRepository = informationTypeRepository;
        this.processRepository = processRepository;
    }

    @ApiOperation(value = "Get All Disclosures")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "All Disclosures fetched", response = DisclosurePage.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping
    public ResponseEntity<RestResponsePage<DisclosureResponse>> getAll(PageParameters pageParameters,
            @RequestParam(required = false) UUID informationTypeId,
            @RequestParam(required = false) UUID processId,
            @RequestParam(required = false) String recipient,
            @RequestParam(required = false) UUID documentId
    ) {
        log.info("Received request for all Disclosures. informationType={} process={} recipient={}, documentId={}", informationTypeId, processId, recipient, documentId);
        List<Disclosure> filtered = null;
        if (informationTypeId != null) {
            filtered = repository.findByInformationTypeId(informationTypeId);
        } else if (processId != null) {
            filtered = repository.findByProcessId(processId);
        } else if (StringUtils.isNotBlank(recipient)) {
            filtered = repository.findByRecipient(recipient);
        } else if (documentId != null) {
            filtered = repository.findByDocumentId(documentId.toString());
        }
        if (filtered != null) {
            return returnResults(new RestResponsePage<>(convert(filtered, Disclosure::convertToResponse)));
        }
        return returnResults(new RestResponsePage<>(repository.findAll(pageParameters.createIdSortedPage()).map(Disclosure::convertToResponse)));
    }

    private ResponseEntity<RestResponsePage<DisclosureResponse>> returnResults(RestResponsePage<DisclosureResponse> page) {
        log.info("Returned {} Disclosures", page.getNumberOfElements());
        return ResponseEntity.ok(page);
    }

    @ApiOperation(value = "Get Disclosure")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Disclosure fetched", response = DisclosureResponse.class),
            @ApiResponse(code = 404, message = "Disclosure not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/{id}")
    public ResponseEntity<DisclosureResponse> findForId(@PathVariable UUID id) {
        log.info("Received request for Disclosure with the id={}", id);
        Optional<DisclosureResponse> disclosureResponse = repository.findById(id).map(this::convertAndAddObjects);
        if (disclosureResponse.isEmpty()) {
            log.info("Cannot find the Disclosure with id={}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        log.info("Returned Disclosure");
        return new ResponseEntity<>(disclosureResponse.get(), HttpStatus.OK);
    }

    @ApiOperation(value = "Create Disclosure")
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "Disclosure successfully created", response = DisclosureResponse.class),
            @ApiResponse(code = 400, message = "Illegal arguments"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<DisclosureResponse> createPolicy(@Valid @RequestBody DisclosureRequest request) {
        log.debug("Received request to create Disclosure");
        return new ResponseEntity<>(convertAndAddObjects(service.save(request)), HttpStatus.CREATED);
    }

    @ApiOperation(value = "Update Disclosure")
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "Disclosure successfully updated", response = DisclosureResponse.class),
            @ApiResponse(code = 400, message = "Illegal arguments"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @PutMapping("/{id}")
    public ResponseEntity<DisclosureResponse> updatePolicy(@PathVariable UUID id, @Valid @RequestBody DisclosureRequest request) {
        log.debug("Received request to update Disclosure");
        Assert.isTrue(id.equals(request.getIdAsUUID()), "id mismatch");
        return ResponseEntity.ok(convertAndAddObjects(service.update(request)));
    }

    @ApiOperation(value = "Delete Disclosure")
    @ApiResponses(value = {
            @ApiResponse(code = 202, message = "Disclosure deleted"),
            @ApiResponse(code = 404, message = "Disclosure not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<DisclosureResponse> deleteDisclosureById(@PathVariable UUID id) {
        log.info("Received a request to delete Disclosure with id={}", id);
        Optional<Disclosure> fromRepository = repository.findById(id);
        if (fromRepository.isEmpty()) {
            log.info("Cannot find Disclosure with id={}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        service.deleteById(id);
        log.info("Disclosure with id={} deleted", id);
        return new ResponseEntity<>(convertAndAddObjects(fromRepository.get()), HttpStatus.OK);
    }

    private DisclosureResponse convertAndAddObjects(Disclosure disclosure) {
        var response = disclosure.convertToResponse();
        if (response.getDocumentId() != null) {
            response.setDocument(documentService.getDocumentAsResponse(disclosure.getData().getDocumentId()));
        }
        if (!response.getInformationTypeIds().isEmpty()) {
            var its = informationTypeRepository.findAllById(response.getInformationTypeIds());
            response.setInformationTypes(convert(its, InformationType::convertToShortResponse));
        }
        if (!response.getProcessIds().isEmpty()) {
            var processes = processRepository.findAllById(response.getProcessIds());
            response.setProcesses(convert(processes, Process::convertToShortResponse));
        }
        return response;
    }

    static class DisclosurePage extends RestResponsePage<DisclosureResponse> {

    }
}
