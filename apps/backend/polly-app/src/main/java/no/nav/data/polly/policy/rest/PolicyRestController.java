package no.nav.data.polly.policy.rest;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.common.exceptions.PollyNotFoundException;
import no.nav.data.polly.common.exceptions.ValidationException;
import no.nav.data.polly.common.rest.PageParameters;
import no.nav.data.polly.common.rest.RestResponsePage;
import no.nav.data.polly.policy.PolicyService;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.policy.domain.PolicyRepository;
import no.nav.data.polly.policy.dto.PolicyRequest;
import no.nav.data.polly.policy.dto.PolicyResponse;
import org.springframework.data.domain.Page;
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

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import javax.validation.Valid;

import static java.util.stream.Collectors.toList;

@Slf4j
@RestController
@CrossOrigin
@Api(value = "Data Catalog Policies", description = "REST API for Policies", tags = {"Policies"})
@RequestMapping("/policy")
@Transactional
public class PolicyRestController {

    private final PolicyService service;
    private final PolicyRepository policyRepository;

    public PolicyRestController(PolicyService service, PolicyRepository policyRepository) {
        this.service = service;
        this.policyRepository = policyRepository;
    }

    @ApiOperation(value = "Get all Policies, filtered  request will always return all policies")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "All policies fetched", response = PolicyPage.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping
    public ResponseEntity<RestResponsePage<PolicyResponse>> getPolicies(PageParameters pageParameters,
            @RequestParam(required = false) UUID informationTypeId,
            @RequestParam(required = false) UUID processId
    ) {
        if (informationTypeId != null) {
            log.debug("Received request for Policies related to InformationType with id={}", informationTypeId);
            var policies = policyRepository.findByInformationTypeId(informationTypeId).stream()
                    .filter(policy -> processId == null || policy.getProcess().getId().equals(processId))
                    .map(policy1 -> policy1.convertToResponse(true))
                    .collect(toList());
            return ResponseEntity.ok(new RestResponsePage<>(policies));
        } else if (processId != null) {
            log.debug("Received request for Policies related to Process with id={}", processId);
            var policies = policyRepository.findByProcessId(processId).stream()
                    .map(policy1 -> policy1.convertToResponse(true))
                    .collect(toList());
            return ResponseEntity.ok(new RestResponsePage<>(policies));
        } else {
            log.debug("Received request for all Policies");
            Page<PolicyResponse> policyResponses = policyRepository.findAll(pageParameters.createIdSortedPage()).map(policy -> policy.convertToResponse(true));
            return ResponseEntity.ok(new RestResponsePage<>(policyResponses));
        }
    }

    @ApiOperation(value = "Count all Policies")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Count policies fetched", response = Long.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/count")
    public ResponseEntity<Long> countPolicies() {
        log.debug("Received request for number of Policies");
        return ResponseEntity.ok(policyRepository.count());
    }

    @ApiOperation(value = "Count Policies by InformationType")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Count fetched", response = Long.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping(path = "/count", params = {"informationTypeId"})
    public ResponseEntity<Long> countPoliciesByInformationType(@RequestParam UUID informationTypeId) {
        log.debug("Received request for number of policies related to InformationTypes with id={}", informationTypeId);
        return ResponseEntity.ok(policyRepository.countByInformationTypeId(informationTypeId));
    }

    @ApiOperation(value = "Create Policy")
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "Policy successfully created", response = PolicyPage.class),
            @ApiResponse(code = 400, message = "Illegal arguments"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<RestResponsePage<PolicyResponse>> createPolicy(@Valid @RequestBody List<PolicyRequest> policyRequests) {
        log.debug("Received request to create Policies");
        service.validateRequests(policyRequests, false);
        List<Policy> policies = policyRequests.stream().map(Policy::mapRequestToPolicy).collect(toList());
        List<PolicyResponse> responses = service.saveAll(policies).stream().map(policy -> policy.convertToResponse(true)).collect(toList());
        return new ResponseEntity<>(new RestResponsePage<>(responses), HttpStatus.CREATED);
    }

    @ApiOperation(value = "Get Policy")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Fetched policy", response = PolicyResponse.class),
            @ApiResponse(code = 404, message = "Policy not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/{id}")
    public ResponseEntity<PolicyResponse> getPolicy(@PathVariable UUID id) {
        log.debug("Received request for Policy with id={}", id);
        Optional<Policy> optionalPolicy = policyRepository.findById(id);
        if (optionalPolicy.isEmpty()) {
            throw notFoundError(id);
        }
        return ResponseEntity.ok(optionalPolicy.get().convertToResponse(true));
    }

    @ApiOperation(value = "Delete Policy")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Policy deleted", response = PolicyResponse.class),
            @ApiResponse(code = 404, message = "Policy not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @DeleteMapping("/{id}")
    public ResponseEntity<PolicyResponse> deletePolicy(@PathVariable UUID id) {
        log.debug("Received request to delete Policy with id={}", id);
        Optional<Policy> optionalPolicy = policyRepository.findById(id);
        if (optionalPolicy.isEmpty()) {
            throw notFoundError(id);
        }
        Policy policy = optionalPolicy.get();
        service.delete(policy);
        return ResponseEntity.ok(policy.convertToResponse(true));
    }

    @ApiOperation(value = "Update Policy")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Policy updated", response = PolicyResponse.class),
            @ApiResponse(code = 404, message = "Policy not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @PutMapping("/{id}")
    public ResponseEntity<PolicyResponse> updatePolicy(@PathVariable String id, @Valid @RequestBody PolicyRequest policyRequest) {
        log.debug("Received request to update Policy with id={}", id);
        if (!Objects.equals(id, policyRequest.getId())) {
            throw new ValidationException(String.format("id mismatch in request %s and path %s", policyRequest.getId(), id));
        }
        UUID uuid;
        try {
            uuid = UUID.fromString(id);
        } catch (Exception e) {
            throw new ValidationException(String.format("invalid UUID %s", id));
        }
        if (policyRepository.findById(uuid).isEmpty()) {
            throw notFoundError(uuid);
        }
        service.validateRequests(List.of(policyRequest), true);
        Policy policy = Policy.mapRequestToPolicy(policyRequest);
        return ResponseEntity.ok(service.saveAll(List.of(policy)).get(0).convertToResponse(true));
    }

    @ApiOperation(value = "Update Policies")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Polices updated", response = PolicyPage.class),
            @ApiResponse(code = 404, message = "Policy not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @PutMapping
    public ResponseEntity<RestResponsePage<PolicyResponse>> updatePolicies(@Valid @RequestBody List<PolicyRequest> policyRequests) {
        log.debug("Received requests to update Policies");
        service.validateRequests(policyRequests, true);
        List<Policy> policies = policyRequests.stream().map(Policy::mapRequestToPolicy).collect(toList());
        List<PolicyResponse> response = service.saveAll(policies).stream().map(policy -> policy.convertToResponse(true)).collect(toList());
        return ResponseEntity.ok(new RestResponsePage<>(response));
    }

    private RuntimeException notFoundError(UUID id) {
        String message = String.format("Cannot find Policy with id: %s", id);
        log.warn(message);
        throw new PollyNotFoundException(message);
    }

    static final class PolicyPage extends RestResponsePage<PolicyResponse> {

    }
}
