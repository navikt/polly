package no.nav.data.polly.disclosure;


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
import no.nav.data.polly.disclosure.domain.DisclosureRepository;
import no.nav.data.polly.disclosure.dto.DisclosureRequest;
import no.nav.data.polly.disclosure.dto.DisclosureResponse;
import no.nav.data.polly.disclosure.dto.DisclosureSummaryResponse;
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

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static no.nav.data.common.utils.StreamUtils.contains;
import static no.nav.data.common.utils.StreamUtils.convert;
import static no.nav.data.common.utils.StreamUtils.convertFlat;
import static no.nav.data.common.utils.StreamUtils.filter;

@Slf4j
@RestController
@RequestMapping("/disclosure")
@Tag(name = "Disclosure")
@RequiredArgsConstructor
public class DisclosureController {

    private final DisclosureRepository repository;
    private final DisclosureService service;

    private final DocumentService documentService;
    private final InformationTypeRepository informationTypeRepository;
    private final ProcessRepository processRepository;

    @Operation(summary = "Get All Disclosures")
    @ApiResponse(description = "All Disclosures fetched")
    @GetMapping
    public ResponseEntity<RestResponsePage<DisclosureResponse>> getAll(PageParameters pageParameters,
            @RequestParam(required = false) UUID informationTypeId,
            @RequestParam(required = false) UUID processId,
            @RequestParam(required = false) String recipient,
            @RequestParam(required = false) UUID documentId,
            @RequestParam(required = false) Boolean emptyLegalBases
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
        } else if (Boolean.TRUE.equals(emptyLegalBases)) {
            filtered = repository.findByNoLegalBases();
        }
        if (filtered != null) {
            return returnResults(new RestResponsePage<>(convert(filtered, Disclosure::convertToResponse)));
        }
        return returnResults(new RestResponsePage<>(repository.findAll(pageParameters.createIdSortedPage()).map(Disclosure::convertToResponse)));
    }

    @Operation(summary = "Get All Disclosure summaries")
    @ApiResponse(description = "All Disclosure summaries fetched")
    @GetMapping("/summary")
    public ResponseEntity<RestResponsePage<DisclosureSummaryResponse>> getSummary() {
        log.info("Received request for all Disclosure summaries");
        var discs = repository.findAll();
        var processIds = convertFlat(discs, d -> d.getData().getProcessIds());
        var processes = processRepository.findSummaryById(processIds);
        return ResponseEntity.ok(new RestResponsePage<>(convert(discs, d -> {
            var procsForDisc = filter(processes, p ->  contains(d.getData().getProcessIds(), p.getId()));
            return d.convertToSummary(procsForDisc);
        })));
    }

    @Operation(summary = "Search disclosures")
    @ApiResponse(description = "Disclosures fetched")
    @GetMapping("/search/{search}")
    public ResponseEntity<RestResponsePage<DisclosureResponse>> search(@PathVariable String search) {
        log.info("Received request for Disclosure search={}", search);
        if (search.length() < 3) {
            throw new ValidationException("Search term must be at least 3 characters");
        }
        var discs = new ArrayList<>(repository.findByNameContaining(search));
        return returnResults(new RestResponsePage<>(convert(discs, Disclosure::convertToResponse)));
    }

    @Operation(summary = "Get disclosures by department")
    @ApiResponse(description = "Disclosures fetched")
    @GetMapping("/department/{department}")
    public ResponseEntity<RestResponsePage<DisclosureResponse>> getByDepartment(@PathVariable String department) {
        log.info("Received request for Disclosure with department={}", department);
        var discs = new ArrayList<>(repository.getByDepartment(department));
        return returnResults(new RestResponsePage<>(convert(discs, Disclosure::convertToResponse)));
    }

    private ResponseEntity<RestResponsePage<DisclosureResponse>> returnResults(RestResponsePage<DisclosureResponse> page) {
        log.info("Returned {} Disclosures", page.getNumberOfElements());
        return ResponseEntity.ok(page);
    }

    @Operation(summary = "Get Disclosure")
    @ApiResponse(description = "Disclosure fetched")
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

    @Operation(summary = "Create Disclosure")
    @ApiResponse(responseCode = "201", description = "Disclosure successfully created")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<DisclosureResponse> createPolicy(@Valid @RequestBody DisclosureRequest request) {
        log.debug("Received request to create Disclosure");
        return new ResponseEntity<>(convertAndAddObjects(service.save(request)), HttpStatus.CREATED);
    }

    @Operation(summary = "Update Disclosure")
    @ApiResponse(description = "Disclosure successfully updated")
    @PutMapping("/{id}")
    public ResponseEntity<DisclosureResponse> updatePolicy(@PathVariable UUID id, @Valid @RequestBody DisclosureRequest request) {
        log.debug("Received request to update Disclosure");
        Assert.isTrue(id.equals(request.getIdAsUUID()), "id mismatch");
        return ResponseEntity.ok(convertAndAddObjects(service.update(request)));
    }

    @Operation(summary = "Delete Disclosure")
    @ApiResponse(description = "Disclosure deleted")
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

    static class DisclosureSummaryPage extends RestResponsePage<DisclosureSummaryResponse> {

    }

    static class DisclosurePage extends RestResponsePage<DisclosureResponse> {

    }
}
