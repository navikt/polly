package no.nav.data.polly.policy;

import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.ListName;
import no.nav.data.polly.common.exceptions.ValidationException;
import no.nav.data.polly.common.validator.ValidationError;
import no.nav.data.polly.dataset.Dataset;
import no.nav.data.polly.dataset.repo.DatasetRepository;
import no.nav.data.polly.policy.domain.PolicyRequest;
import no.nav.data.polly.policy.entities.Policy;
import no.nav.data.polly.policy.repository.PolicyRepository;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Slf4j
@Service
public class PolicyService {

    private final PolicyRepository policyRepository;
    private final DatasetRepository datasetRepository;

    public PolicyService(PolicyRepository policyRepository, DatasetRepository datasetRepository) {
        this.policyRepository = policyRepository;
        this.datasetRepository = datasetRepository;
    }

    public void validateRequests(List<PolicyRequest> requests, boolean isUpdate) {
        PolicyRequest.initialize(requests, isUpdate);
        List<ValidationError> validations = new ArrayList<>();
        Map<String, Integer> titlesUsedInRequest = new HashMap<>();
        final AtomicInteger i = new AtomicInteger(1);
        requests.forEach(request -> {
            List<ValidationError> requestValidations = validatePolicyRequest(request);
            if (titlesUsedInRequest.containsKey(request.getDatasetTitle() + request.getPurposeCode())) {
                requestValidations.add(new ValidationError(request.getReference(), "combinationNotUniqueInThisRequest", String.format(
                        "A request combining Dataset: %s and Purpose: %s is not unique because " +
                                "it is already used in this request (see request nr:%s)",
                        request.getDatasetTitle(), request.getPurposeCode(), titlesUsedInRequest.get(request.getDatasetTitle() + request.getPurposeCode()))));
            } else if (request.getDatasetTitle() != null && request.getPurposeCode() != null) {
                titlesUsedInRequest.put(request.getDatasetTitle() + request.getPurposeCode(), i.intValue());
            }
            if (request.isUpdate()) {
                validateUpdate(request, validations);
            }
            validations.addAll(requestValidations);
            i.getAndIncrement();
        });
        if (!validations.isEmpty()) {
            log.error("Validation errors occurred when validating DatasetRequest: {}", validations);
            throw new ValidationException(validations, "Validation errors occurred when validating DatasetRequest.");
        }
    }

    private void validateUpdate(PolicyRequest request, List<ValidationError> validations) {
        if (request.getId() == null) {
            validations.add(new ValidationError(request.getReference(), "missingIdForUpdate", "Id is missing for update"));
            return;
        }
        Policy policy = policyRepository.findById(request.getId()).orElse(null);
        if (policy == null) {
            validations.add(new ValidationError(request.getReference(), "notFound", String.format("A policy with id: %d was not found", request.getId())));
        } else if (!StringUtils.equals(policy.getPurposeCode(), request.getPurposeCode())) {
            validations.add(new ValidationError(request.getReference(), "cannotChangePurpose",
                    String.format("Cannot change purpose from %s to %s for policy %s", policy.getPurposeCode(), request.getPurposeCode(), request.getId())));
        } else {
            request.setExistingPolicy(policy);
        }
    }

    private List<ValidationError> validatePolicyRequest(PolicyRequest request) {
        List<ValidationError> validations = new ArrayList<>();
        if (request.getDatasetTitle() == null) {
            validations.add(new ValidationError(request.getReference(), "datasetTitle", "datasetTitle cannot be null"));
        }
        if (request.getLegalBasisDescription() == null) {
            validations.add(new ValidationError(request.getReference(), "legalBasisDescription", "legalBasisDescription cannot be null"));
        }
        if (request.getPurposeCode() == null) {
            validations.add(new ValidationError(request.getReference(), "purposeCode", "purposeCode cannot be null"));
        } else {
            var codelist = CodelistService.getCodelist(ListName.PURPOSE, request.getPurposeCode());
            if (codelist == null) {
                validations.add(new ValidationError(request.getReference(), "purposeCode",
                        String.format("The purposeCode %s was not found in the PURPOSE codelist.", request.getPurposeCode())));
            }
        }
        // Combination of Dataset and purpose must be unique
        if (request.getPurposeCode() != null && request.getDatasetTitle() != null) {
            Dataset dataset = datasetRepository.findByTitle(request.getDatasetTitle()).orElse(null);
            if (dataset == null) {
                validations.add(new ValidationError(request.getReference(), "datasetTitle", String.format("A dataset with title %s does not exist", request.getDatasetTitle())));
            } else {
                request.setDatasetId(dataset.getId().toString());
            }

            if (!request.isUpdate() && dataset != null && exists(dataset.getId().toString(), request.getPurposeCode())) {
                validations.add(new ValidationError(request.getReference(), "datasetAndPurpose",
                        String.format("A policy combining Dataset %s and Purpose %s already exists", request.getDatasetTitle(), request.getPurposeCode())));
            }
        }

        if (!validations.isEmpty()) {
            log.error("Validation errors occurred when validating DatasetRequest: {}", validations);
        }
        return validations;
    }

    private boolean exists(String datasetId, String purposeCode) {
        return policyRepository.findByDatasetIdAndPurposeCode(datasetId, purposeCode).stream().anyMatch(Policy::isActive);
    }

    public List<Policy> findActiveByPurposeCode(String purpose) {
        return policyRepository.findByPurposeCode(purpose).stream()
                .filter(Policy::isActive)
                .collect(Collectors.toList());
    }
}
