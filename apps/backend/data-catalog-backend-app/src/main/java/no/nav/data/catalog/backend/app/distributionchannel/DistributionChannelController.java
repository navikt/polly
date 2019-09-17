package no.nav.data.catalog.backend.app.distributionchannel;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.catalog.backend.app.common.rest.PageParameters;
import no.nav.data.catalog.backend.app.common.rest.RestResponsePage;
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
@RequestMapping("/distributionchannel")
@Api(value = "DistributionChannel", description = "REST API for DistributionChannel", tags = {"DistributionChannel"})
public class DistributionChannelController {

    private final DistributionChannelService service;
    private final DistributionChannelRepository repository;

    public DistributionChannelController(DistributionChannelService service, DistributionChannelRepository repository) {
        this.service = service;
        this.repository = repository;
    }

    @ApiOperation(value = "Get DistributionChannelById", tags = {"DistributionChannel"})
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "DistributionChannel fetched", response = DistributionChannel.class),
            @ApiResponse(code = 404, message = "DistributionChannel  not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/{id}")
    public ResponseEntity<DistributionChannelResponse> getDistributionChannelById(@PathVariable UUID id) {
        log.info("Received request for DistributionChannel with the id={}", id);
        Optional<DistributionChannel> distributionChannel = repository.findById(id);
        if (distributionChannel.isEmpty()) {
            log.info("Cannot find the DistributionChannel with id={}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        log.info("Returned DistributionChannel");
        return new ResponseEntity<>(distributionChannel.get().convertToResponse(), HttpStatus.OK);
    }

    @ApiOperation(value = "Get all DistributionChannels", tags = {"DistributionChannel"})
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "All distributionChannels fetched", response = DistributionChannelPage.class),
            @ApiResponse(code = 404, message = "No DistributionChannel found in repository"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping
    public ResponseEntity<RestResponsePage<DistributionChannelResponse>> getAllDistributionChannel(PageParameters pageParameters) {
        log.info("Received request for all DistributionChannels");
        Page<DistributionChannelResponse> pagedResponse = service.getAllDistributionChannels(pageParameters.createIdSortedPage());
        log.info("Returned DistributionChannels");
        return ResponseEntity.ok(new RestResponsePage<>(pagedResponse.getContent(), pagedResponse.getPageable(), pagedResponse.getTotalElements()));
    }

    @ApiOperation(value = "Count all DistributionChannels", tags = {"DistributionChannel"})
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Count of distributionchannel fetched", response = Long.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/count")
    public Long countAllDistributionChannels() {
        log.info("Received request for count all DistributionChannels");
        return repository.count();
    }

    @ApiOperation(value = "Create DistributionChannel", tags = {"DistributionChannel"})
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "DistributionChannels to be created successfully accepted", response = DistributionChannel.class, responseContainer = "List"),
            @ApiResponse(code = 400, message = "Illegal arguments"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @PostMapping
    public ResponseEntity<List<DistributionChannelResponse>> createDistributionChannels(@RequestBody List<DistributionChannelRequest> requests) {
        log.info("Received requests to create DistributionChannels");
        //TODO: ValidateRequest
//		service.validateRequests(requests, false);
        return new ResponseEntity<>(service.createDistributionChannels(requests).stream().map(DistributionChannel::convertToResponse).collect(Collectors.toList()),
                HttpStatus.CREATED);
    }

    @ApiOperation(value = "Update DistributionChannel", tags = {"DistributionChannel"})
    @ApiResponses(value = {
            @ApiResponse(code = 202, message = "DistributionChannels to be updated successfully accepted", response = DistributionChannel.class, responseContainer = "List"),
            @ApiResponse(code = 400, message = "Illegal arguments"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @PutMapping
    public ResponseEntity<List<DistributionChannelResponse>> updateDistributionChannels(@RequestBody List<DistributionChannelRequest> requests) {
        log.info("Received requests to create DistributionChannels");
        //TODO: ValidateRequest
//		service.validateRequests(requests, true);
        return ResponseEntity.ok(service.updateDistributionChannels(requests).stream().map(DistributionChannel::convertToResponse).collect(Collectors.toList()));
    }

    @ApiOperation(value = "Delete DistributionChannel", tags = {"DistributionChannel"})
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "DistributionChannel deleted", response = DistributionChannelResponse.class),
            @ApiResponse(code = 404, message = "DistributionChannel not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<DistributionChannelResponse> deleteDistributionChannelById(@PathVariable UUID id) {
        log.info("Received a request to delete DistributionChannel with id={}", id);
        Optional<DistributionChannel> fromRepository = service.findDistributionChannelById(id);
        if (fromRepository.isEmpty()) {
            log.info("Cannot find DistributionChannel with id={}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        log.info("DistributionChannel with id={} has been set to be deleted during the next scheduled task", id);
        return new ResponseEntity<>(service.deleteDistributionChannel(fromRepository.get()).convertToResponse(), HttpStatus.OK);
    }

    private static final class DistributionChannelPage extends RestResponsePage<DistributionChannelResponse> {

    }
}
