package no.nav.data.catalog.backend.app.system;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.catalog.backend.app.common.rest.PageParameters;
import no.nav.data.catalog.backend.app.common.rest.RestResponsePage;
import no.nav.data.catalog.backend.app.common.utils.StreamUtils;
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

@Slf4j
@RestController
@CrossOrigin
@RequestMapping("/system")
@Api(value = "System", description = "REST API for Systems", tags = {"System"})
public class SystemController {

    private final SystemService service;

    public SystemController(SystemService service) {
        this.service = service;
    }

    @ApiOperation(value = "Get SystemById", tags = {"System"})
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "System fetched", response = SystemResponse.class),
            @ApiResponse(code = 404, message = "System  not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/id/{uuid}")
    public ResponseEntity<SystemResponse> getSystemById(@PathVariable UUID uuid) {
        log.info("Received request for System with the id={}", uuid);
        Optional<System> system = service.findSystemById(uuid);
        if (system.isEmpty()) {
            log.info("Cannot find the System with id={}", uuid);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        log.info("Returned System");
        return new ResponseEntity<>(system.get().convertToResponse(), HttpStatus.OK);
    }

    @ApiOperation(value = "Get all Systems", tags = {"System"})
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "All systems fetched", response = SystemPage.class),
            @ApiResponse(code = 404, message = "No System found in repository"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping
    public RestResponsePage<SystemResponse> getAllSystems(PageParameters pageParameters) {
        log.info("Received request for all Systems");
        Page<SystemResponse> pagedResponse = service.getAllSystems(pageParameters.createIdSortedPage());
        log.info("Returned systems");
        return new RestResponsePage<>(pagedResponse.getContent(), pagedResponse.getPageable(), pagedResponse.getTotalElements());
    }

    @ApiOperation(value = "Count all Systems", tags = {"System"})
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Count of systems fetched", response = Long.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/count")
    public Long countAllSystems() {
        log.info("Received request for count all Systems");
        return service.getRepositoryCount();
    }

    @ApiOperation(value = "Create Systems", tags = {"System"})
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "Systems to be created successfully accepted", response = SystemResponse.class, responseContainer = "List"),
            @ApiResponse(code = 400, message = "Illegal arguments"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @PostMapping
    public ResponseEntity<List<SystemResponse>> createSystems(@RequestBody List<SystemRequest> requests) {
        log.info("Received requests to create Systems");
        requests = StreamUtils.nullToEmptyList(requests);
        SystemRequest.initiateRequests(requests, false);
        service.validateRequestsFromREST(requests);

        return new ResponseEntity<>(service.saveAll(requests).stream().map(System::convertToResponse).collect(Collectors.toList()), HttpStatus.CREATED);
    }

    @ApiOperation(value = "Update Systems", tags = {"System"})
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Systems to be updated successfully accepted", response = SystemResponse.class, responseContainer = "List"),
            @ApiResponse(code = 400, message = "Illegal arguments"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @PutMapping
    public ResponseEntity<List<SystemResponse>> updateSystems(@RequestBody List<SystemRequest> requests) {
        log.info("Received requests to create Systems");
        requests = StreamUtils.nullToEmptyList(requests);
        SystemRequest.initiateRequests(requests, true);
        service.validateRequestsFromREST(requests);

        return new ResponseEntity<>(service.updateAll(requests).stream().map(System::convertToResponse).collect(Collectors.toList()), HttpStatus.OK);
    }

    @ApiOperation(value = "Delete System", tags = {"System"})
    @ApiResponses(value = {
            @ApiResponse(code = 202, message = "System deleted", response = SystemResponse.class),
            @ApiResponse(code = 404, message = "System not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<SystemResponse> deleteDistributionChannelById(@PathVariable UUID id) {
        log.info("Received a request to delete System with id={}", id);
        Optional<System> fromRepository = service.findSystemById(id);
        if (fromRepository.isEmpty()) {
            log.info("Cannot find System with id={}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
//        log.info("System with id={} has been set to be deleted during the next scheduled task", id);
        return new ResponseEntity<>(service.delete(fromRepository.get()).convertToResponse(), HttpStatus.ACCEPTED);
    }

    private static final class SystemPage extends RestResponsePage<SystemResponse> {

    }
}
