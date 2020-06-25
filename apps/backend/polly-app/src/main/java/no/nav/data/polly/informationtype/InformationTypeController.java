package no.nav.data.polly.informationtype;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.common.exceptions.ValidationException;
import no.nav.data.polly.common.rest.PageParameters;
import no.nav.data.polly.common.rest.RestResponsePage;
import no.nav.data.polly.common.utils.StreamUtils;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.dto.InformationTypeRequest;
import no.nav.data.polly.informationtype.dto.InformationTypeResponse;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.validation.Valid;

import static java.util.Comparator.comparing;
import static no.nav.data.polly.common.utils.StartsWithComparator.startsWith;
import static no.nav.data.polly.common.utils.StreamUtils.convert;

@Slf4j
@RestController
@RequestMapping("/informationtype")
@Api(value = "InformationType", description = "REST API for InformationType", tags = {"InformationType"})
public class InformationTypeController {

    private final InformationTypeRepository repository;
    private final InformationTypeService service;

    public InformationTypeController(InformationTypeRepository informationTypeRepository,
            InformationTypeService informationTypeService) {
        this.repository = informationTypeRepository;
        this.service = informationTypeService;
    }

    @ApiOperation(value = "Get InformationType")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "InformationType fetched", response = InformationTypeResponse.class),
            @ApiResponse(code = 404, message = "InformationType not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/{id}")
    public ResponseEntity<InformationTypeResponse> findForId(@PathVariable UUID id) {
        log.info("Received request for InformationType with the id={}", id);
        Optional<InformationTypeResponse> informationTypeResponse = repository.findById(id).map(InformationType::convertToResponse);
        if (informationTypeResponse.isEmpty()) {
            log.info("Cannot find the InformationType with id={}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        log.info("Returned InformationType");
        return new ResponseEntity<>(informationTypeResponse.get(), HttpStatus.OK);
    }

    @ApiOperation(value = "Search InformationTypes")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "InformationTypes fetched", response = InformationTypePage.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/search/{name}")
    public ResponseEntity<RestResponsePage<InformationTypeResponse>> searchInformationTypeByName(@PathVariable String name) {
        log.info("Received request for InformationTypes with the name like {}", name);
        if (name.length() < 3) {
            throw new ValidationException("Search term must be at least 3 characters");
        }
        List<InformationType> infoTypes = repository.findBySuggestLike(name);
        infoTypes.sort(comparing(it -> it.getData().getSuggest(), startsWith(name)));
        log.info("Returned {} InformationTypes", infoTypes.size());
        return new ResponseEntity<>(new RestResponsePage<>(convert(infoTypes, InformationType::convertToResponse)), HttpStatus.OK);
    }

    @ApiOperation(value = "Get All InformationTypes")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "InformationTypes fetched", response = InformationTypePage.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping
    public ResponseEntity<RestResponsePage<InformationTypeResponse>> findAll(PageParameters page,
            @RequestParam(required = false) String source,
            @RequestParam(required = false) String orgMaster,
            @RequestParam(required = false) String term
    ) {
        log.info("Received request for all InformationTypes source={} term={}", source, term);
        List<InformationType> infoTypes = null;
        if (term != null) {
            infoTypes = repository.findByTermId(term);
        } else if (source != null) {
            infoTypes = repository.findBySource(source);
        } else if (orgMaster != null) {
            infoTypes = repository.findByOrgMaster(orgMaster);
        }
        if (infoTypes != null) {
            infoTypes.sort(comparing(it -> it.getData().getName(), String.CASE_INSENSITIVE_ORDER));
            return ResponseEntity.ok(new RestResponsePage<>(convert(infoTypes, InformationType::convertToResponse)));
        }

        Page<InformationTypeResponse> informationTypes = repository.findAll(page.createIdSortedPage()).map(InformationType::convertToResponse);
        return ResponseEntity.ok(new RestResponsePage<>(informationTypes));
    }

    @ApiOperation(value = "Count all InformationTypes")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Count of InformationTypes fetched", response = Long.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/count")
    public Long countAllInformationTypes() {
        log.info("Received request for count all InformationTypes");
        return repository.count();
    }

    @ApiOperation(value = "Create InformationTypes")
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "InformationTypes to be created successfully accepted", response = InformationTypePage.class),
            @ApiResponse(code = 400, message = "Illegal arguments"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @PostMapping
    public ResponseEntity<RestResponsePage<InformationTypeResponse>> createInformationTypes(@RequestBody List<InformationTypeRequest> requests) {
        log.info("Received requests to create InformationTypes");
        requests = StreamUtils.nullToEmptyList(requests);
        service.validateRequest(requests, false);

        List<InformationTypeResponse> responses = service.saveAll(requests).stream().map(InformationType::convertToResponse).collect(Collectors.toList());
        return new ResponseEntity<>(new RestResponsePage<>(responses), HttpStatus.CREATED);
    }

    @ApiOperation(value = "Update InformationType")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "InformationType to be updated successfully accepted", response = InformationTypePage.class),
            @ApiResponse(code = 400, message = "Illegal arguments"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @PutMapping
    public ResponseEntity<RestResponsePage<InformationTypeResponse>> updateInformationTypes(@RequestBody List<InformationTypeRequest> requests) {
        log.info("Received requests to update InformationTypes");
        requests = StreamUtils.nullToEmptyList(requests);
        service.validateRequest(requests, true);

        List<InformationTypeResponse> responses = service.updateAll(requests).stream().map(InformationType::convertToResponse).collect(Collectors.toList());
        return ResponseEntity.ok(new RestResponsePage<>(responses));
    }

    @ApiOperation(value = "Update InformationType")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Accepted one InformationType to be updated", response = InformationTypeResponse.class),
            @ApiResponse(code = 400, message = "Illegal arguments"),
            @ApiResponse(code = 404, message = "InformationType not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @PutMapping("/{id}")
    public ResponseEntity<InformationTypeResponse> updateOneInformationTypeById(@PathVariable UUID id, @Valid @RequestBody InformationTypeRequest request) {
        log.info("Received a request to update InformationType with id={}", id);
        if (!id.equals(request.getIdAsUUID())) {
            throw new ValidationException(String.format("Mismatch between path and request id, id=%s request id=%s", id, request.getId()));
        }
        Optional<InformationType> byId = repository.findById(id);
        if (byId.isEmpty()) {
            log.info("Cannot find InformationType with id={}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        service.validateRequest(List.of(request), true);

        InformationType informationType = service.update(request);

        log.info("Updated the InformationType");
        return new ResponseEntity<>(informationType.convertToResponse(), HttpStatus.OK);
    }

    @ApiOperation(value = "Delete InformationType")
    @ApiResponses(value = {
            @ApiResponse(code = 202, message = "InformationType deleted", response = InformationTypeResponse.class),
            @ApiResponse(code = 404, message = "InformationType not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<InformationTypeResponse> deleteInformationTypeById(@PathVariable UUID id) {
        log.info("Received a request to delete InformationType with id={}", id);
        if (id == null) {
            log.info("id missing");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(service.delete(id).convertToResponse(), HttpStatus.ACCEPTED);
    }

    static final class InformationTypePage extends RestResponsePage<InformationTypeResponse> {

    }

}
