package no.nav.data.polly.policy.rest;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.exceptions.NotFoundException;
import no.nav.data.common.exceptions.ValidationException;
import no.nav.data.common.rest.PageParameters;
import no.nav.data.common.rest.RestResponsePage;
import no.nav.data.polly.policy.PolicyService;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.policy.domain.PolicyRepository;
import no.nav.data.polly.policy.dto.PolicyRequest;
import no.nav.data.polly.policy.dto.PolicyRequestValidator;
import no.nav.data.polly.policy.dto.PolicyResponse;
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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

import static java.util.stream.Collectors.toList;

@Slf4j
@RestController
@Tag(name = "Policy", description = "Data Catalog Policies")
@RequestMapping("/policy")
@Transactional // TODO: Flytt dette inn til tjenestelaget
@RequiredArgsConstructor
public class PolicyRestController {

    // TODO: Implementerer ikke controller → service → DB. Flytt all forretningslogikk, *Repository-aksess og @Transactional til tjenestelaget.
    
    private final PolicyService service;
    private final PolicyRequestValidator requestValidator;
    private final PolicyRepository policyRepository;

    @Operation(summary = "Get all Policies, filtered  request will always return all policies")
    @ApiResponse(description = "All policies fetched")
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

    @Operation(summary = "Count all Policies")
    @ApiResponse(description = "Count policies fetched")
    @GetMapping("/count")
    public ResponseEntity<Long> countPolicies() {
        log.debug("Received request for number of Policies");
        return ResponseEntity.ok(policyRepository.count());
    }

    @Operation(summary = "Delete all Policies by process id")
    @ApiResponse(description = "Delete all Policies by process id")
    @DeleteMapping("/process/{id}")
    public ResponseEntity<List<PolicyResponse>> deletePoliciesByProcessId(@PathVariable UUID id) {
        log.debug("Received request to delete Policies with process id={}", id);
         List<Policy> deletedPolicies = service.deleteByProcessId(id);
         List<PolicyResponse> deletedPoliciesResponse = new ArrayList<>();

         deletedPolicies.forEach(policy -> {
             deletedPoliciesResponse.add(policy.convertToResponse(false));
         });

        return ResponseEntity.ok(deletedPoliciesResponse);
    }

    @Operation(summary = "Count Policies by InformationType")
    @ApiResponse(description = "Count fetched")
    @GetMapping(path = "/count", params = {"informationTypeId"})
    public ResponseEntity<Long> countPoliciesByInformationType(@RequestParam UUID informationTypeId) {
        log.debug("Received request for number of policies related to InformationTypes with id={}", informationTypeId);
        return ResponseEntity.ok(policyRepository.countByInformationTypeId(informationTypeId));
    }

    @Operation(summary = "Create Policy")
    @ApiResponse(responseCode = "201", description = "Policy successfully created")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<RestResponsePage<PolicyResponse>> createPolicy(@Valid @RequestBody List<PolicyRequest> policyRequests) {
        log.debug("Received request to create Policies");
        requestValidator.validateRequests(policyRequests, false);
        List<Policy> policies = policyRequests.stream().map(Policy::mapRequestToPolicy).collect(toList());
        List<PolicyResponse> responses = service.saveAll(policies).stream().map(policy -> policy.convertToResponse(true)).collect(toList());
        return new ResponseEntity<>(new RestResponsePage<>(responses), HttpStatus.CREATED);
    }

    @Operation(summary = "Get Policy")
    @ApiResponse(description = "Fetched policy")
    @GetMapping("/{id}")
    public ResponseEntity<PolicyResponse> getPolicy(@PathVariable UUID id) {
        log.debug("Received request for Policy with id={}", id);
        Optional<Policy> optionalPolicy = policyRepository.findById(id);
        if (optionalPolicy.isEmpty()) {
            throw notFoundError(id);
        }
        return ResponseEntity.ok(optionalPolicy.get().convertToResponse(true));
    }

    @Operation(summary = "Delete Policy")
    @ApiResponse(description = "Policy deleted")
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

    @Operation(summary = "Update Policy")
    @ApiResponse(description = "Policy updated")
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
        requestValidator.validateRequests(List.of(policyRequest), true);
        Policy policy = Policy.mapRequestToPolicy(policyRequest);
        return ResponseEntity.ok(service.saveAll(List.of(policy)).get(0).convertToResponse(true));
    }

    @Operation(summary = "Update Policies")
    @ApiResponse(description = "Polices updated")
    @PutMapping
    public ResponseEntity<RestResponsePage<PolicyResponse>> updatePolicies(@Valid @RequestBody List<PolicyRequest> policyRequests) {
        log.debug("Received requests to update Policies");
        requestValidator.validateRequests(policyRequests, true);
        List<Policy> policies = policyRequests.stream().map(Policy::mapRequestToPolicy).collect(toList());
        List<PolicyResponse> response = service.saveAll(policies).stream().map(policy -> policy.convertToResponse(true)).collect(toList());
        return ResponseEntity.ok(new RestResponsePage<>(response));
    }

    private RuntimeException notFoundError(UUID id) {
        String message = String.format("Cannot find Policy with id: %s", id);
        log.warn(message);
        throw new NotFoundException(message);
    }

    public static final class PolicyPage extends RestResponsePage<PolicyResponse> {
    }

}
