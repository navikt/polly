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
import no.nav.data.polly.elasticsearch.ElasticsearchService;
import no.nav.data.polly.elasticsearch.dto.InformationTypeElasticsearch;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.dto.InformationTypeRequest;
import no.nav.data.polly.informationtype.dto.InformationTypeResponse;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import javax.validation.Valid;

import static no.nav.data.polly.informationtype.domain.InformationTypeMaster.REST;

@Slf4j
@RestController
@CrossOrigin
@RequestMapping("/informationtype")
@Api(value = "InformationType", description = "REST API for InformationType", tags = {"InformationType"})
public class InformationTypeController {

    private final InformationTypeRepository repository;
    private final InformationTypeService service;
    private final ElasticsearchService elasticsearchService;

    public InformationTypeController(InformationTypeRepository informationTypeRepository,
            InformationTypeService informationTypeService,
            ElasticsearchService elasticsearchService) {
        this.repository = informationTypeRepository;
        this.service = informationTypeService;
        this.elasticsearchService = elasticsearchService;
    }

    @ApiOperation(value = "Get InformationType")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "InformationType fetched", response = InformationTypeResponse.class),
            @ApiResponse(code = 404, message = "InformationType not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/{id}")
    public ResponseEntity<InformationTypeResponse> findForId(
            @PathVariable UUID id
    ) {
        log.info("Received request for InformationType with the id={}", id);
        Optional<InformationTypeResponse> informationTypeResponse = repository.findById(id).map(InformationType::convertToResponse);
        if (informationTypeResponse.isEmpty()) {
            log.info("Cannot find the InformationType with id={}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        log.info("Returned InformationType");
        return new ResponseEntity<>(informationTypeResponse.get(), HttpStatus.OK);
    }

    @ApiOperation(value = "Get InformationType in Elasticsearch format")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "InformationType fetched", response = InformationTypeElasticsearch.class),
            @ApiResponse(code = 404, message = "InformationType not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/elasticsearch/{id}")
    public ResponseEntity<InformationTypeElasticsearch> findElasticsearchFormatForId(@PathVariable UUID id) {
        log.info("Received request for InformationType ElasticsearchFormat with the id={}", id);
        Optional<InformationType> informationTypeResponse = repository.findById(id);
        if (informationTypeResponse.isEmpty()) {
            log.info("Cannot find the InformationType with id={}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        log.info("Returned InformationType ElasticsearchFormat");
        return new ResponseEntity<>(elasticsearchService.mapInformationType(informationTypeResponse.get()), HttpStatus.OK);
    }

    @ApiOperation(value = "Get InformationType")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "InformationType fetched", response = InformationTypeResponse.class),
            @ApiResponse(code = 404, message = "InformationType not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/name/{name}")
    public ResponseEntity<InformationTypeResponse> getInformationTypeByName(@PathVariable String name) {
        log.info("Received request for InformationType with the name={}", name);
        Optional<InformationType> informationType = repository.findByName(name);
        if (informationType.isEmpty()) {
            log.info("Cannot find the InformationType with name={}", name);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        log.info("Returned InformationType");
        return new ResponseEntity<>(informationType.get().convertToResponse(), HttpStatus.OK);
    }

    @ApiOperation(value = "Get All InformationTypes")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "InformationTypes fetched", response = InformationTypePage.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/")
    public ResponseEntity<RestResponsePage<InformationTypeResponse>> findAll(PageParameters page) {
        log.info("Received request for all InformationTypes");
        Page<InformationTypeResponse> informationTypes = repository.findAll(page.createIdSortedPage()).map(InformationType::convertToResponse);
        log.info("Returned {} InformationTypes", informationTypes.getContent().size());
        return ResponseEntity.ok(new RestResponsePage<>(informationTypes.getContent(), informationTypes.getPageable(), informationTypes.getTotalElements()));
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
            @ApiResponse(code = 201, message = "InformationTypes to be created successfully accepted", response = InformationTypeResponse.class, responseContainer = "List"),
            @ApiResponse(code = 400, message = "Illegal arguments"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @PostMapping
    public ResponseEntity<List<InformationTypeResponse>> createInformationTypes(@RequestBody List<InformationTypeRequest> requests) {
        log.info("Received requests to create InformationTypes");
        requests = StreamUtils.nullToEmptyList(requests);
        InformationTypeRequest.initiateRequests(requests, false, REST);
        service.validateRequest(requests);

        return new ResponseEntity<>(service.saveAll(requests, REST).stream().map(InformationType::convertToResponse).collect(Collectors.toList()), HttpStatus.CREATED);
    }

    @ApiOperation(value = "Update InformationType")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "InformationType to be updated successfully accepted", response = InformationTypeResponse.class, responseContainer = "List"),
            @ApiResponse(code = 400, message = "Illegal arguments"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @PutMapping
    public ResponseEntity<List<InformationTypeResponse>> updateInformationTypes(@RequestBody List<InformationTypeRequest> requests) {
        log.info("Received requests to update InformationTypes");
        requests = StreamUtils.nullToEmptyList(requests);
        InformationTypeRequest.initiateRequests(requests, true, REST);
        service.validateRequest(requests);

        return ResponseEntity.ok(service.updateAll(requests).stream().map(InformationType::convertToResponse).collect(Collectors.toList()));
    }

    @ApiOperation(value = "Update InformationType")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Accepted one InformationType to be updated", response = InformationType.class),
            @ApiResponse(code = 400, message = "Illegal arguments"),
            @ApiResponse(code = 404, message = "InformationType not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @PutMapping("/{id}")
    public ResponseEntity<InformationTypeResponse> updateOneInformationTypeById(@PathVariable UUID id, @Valid @RequestBody InformationTypeRequest request) {
        log.info("Received a request to update InformationType with id={}", id);
        Optional<InformationType> byId = repository.findById(id);
        if (byId.isEmpty()) {
            log.info("Cannot find InformationType with id={}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        String existingName = byId.get().getData().getName();
        if (!existingName.equals(request.getName())) {
            throw new ValidationException(String.format("Cannot change name of informationType in update, id=%s has name=%s", id, existingName));
        }
        InformationTypeRequest.initiateRequests(List.of(request), true, REST);
        service.validateRequest(List.of(request));

        InformationType informationType = service.update(request);

        log.info("Updated the InformationType");
        return new ResponseEntity<>(repository.save(informationType).convertToResponse(), HttpStatus.OK);
    }

    @ApiOperation(value = "Delete InformationType")
    @ApiResponses(value = {
            @ApiResponse(code = 202, message = "InformationType deleted"),
            @ApiResponse(code = 404, message = "InformationType not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity deleteInformationTypeById(@PathVariable UUID id) {
        log.info("Received a request to delete InformationType with id={}", id);
        Optional<InformationType> fromRepository = repository.findById(id);
        if (fromRepository.isEmpty()) {
            log.info("Cannot find InformationType with id={}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        log.info("InformationType with id={} has been set to be deleted during the next scheduled task", id);
        InformationTypeRequest deleteRequest = InformationTypeRequest.builder().informationTypeMaster(REST).name(fromRepository.get().getData().getName()).build();
        return new ResponseEntity<>(service.delete(deleteRequest).convertToResponse(), HttpStatus.ACCEPTED);
    }

    @ApiOperation(value = "Trigger InformationType Sync mot elasticsearch")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "InformationTypes will be synced"),
            @ApiResponse(code = 400, message = "Illegal arguments"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @PostMapping("/sync")
    public void syncInformationType(@RequestBody List<UUID> ids) {
        log.info("Received requests to sync InformationType");
        service.sync(ids);
    }

    private static final class InformationTypePage extends RestResponsePage<InformationTypeResponse> {

    }

}
