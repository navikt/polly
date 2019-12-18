package no.nav.data.polly.disclosure;


import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.common.rest.PageParameters;
import no.nav.data.polly.common.rest.RestResponsePage;
import no.nav.data.polly.disclosure.domain.Disclosure;
import no.nav.data.polly.disclosure.domain.DisclosureRepository;
import no.nav.data.polly.disclosure.dto.DisclosureRequest;
import no.nav.data.polly.disclosure.dto.DisclosureResponse;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
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

import java.util.Optional;
import java.util.UUID;
import javax.validation.Valid;

import static no.nav.data.polly.common.utils.StreamUtils.convert;

@Slf4j
@RestController
@CrossOrigin
@RequestMapping("/disclosure")
@Api(value = "Disclosure", description = "REST API for Disclosure", tags = {"Disclosure"})
public class DisclosureController {

    private DisclosureRepository repository;
    private DisclosureService service;

    public DisclosureController(DisclosureRepository repository, DisclosureService service) {
        this.repository = repository;
        this.service = service;
    }

    @ApiOperation(value = "Get All Disclosures")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "All Disclosures fetched", response = DisclosurePage.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping
    public ResponseEntity<RestResponsePage<DisclosureResponse>> getAll(PageParameters pageParameters,
            @RequestParam(required = false) UUID informationTypeId,
            @RequestParam(required = false) String recipient
    ) {
        log.info("Received request for all Disclosures. informationType={} recipient={}", informationTypeId, recipient);
        if (informationTypeId != null) {
            var disc = repository.findByInformationTypesId(informationTypeId);
            return returnResults(new RestResponsePage<>(convert(disc, Disclosure::convertToResponseWithInformationType)));
        } else if (StringUtils.isNotBlank(recipient)) {
            var disc = repository.findByRecipient(recipient);
            return returnResults(new RestResponsePage<>(convert(disc, Disclosure::convertToResponseWithInformationType)));
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
        Optional<DisclosureResponse> disclosureResponse = repository.findById(id).map(Disclosure::convertToResponseWithInformationType);
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
        return new ResponseEntity<>(service.save(request).convertToResponseWithInformationType(), HttpStatus.CREATED);
    }

    @ApiOperation(value = "Update Disclosure")
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "Disclosure successfully updated", response = DisclosureResponse.class),
            @ApiResponse(code = 400, message = "Illegal arguments"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @PutMapping
    public ResponseEntity<DisclosureResponse> updatePolicy(@Valid @RequestBody DisclosureRequest request) {
        log.debug("Received request to update Disclosure");
        return ResponseEntity.ok(service.update(request).convertToResponseWithInformationType());
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
        repository.deleteById(id);
        log.info("Disclosure with id={} deleted", id);
        return new ResponseEntity<>(fromRepository.get().convertToResponseWithInformationType(), HttpStatus.OK);
    }

    static class DisclosurePage extends RestResponsePage<DisclosureResponse> {

    }
}
