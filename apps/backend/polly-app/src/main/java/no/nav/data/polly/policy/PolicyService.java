package no.nav.data.polly.policy;

import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.common.exceptions.ValidationException;
import no.nav.data.polly.common.validator.RequestValidator;
import no.nav.data.polly.common.validator.ValidationError;
import no.nav.data.polly.informationtype.InformationTypeRepository;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.policy.domain.PolicyRepository;
import no.nav.data.polly.policy.dto.PolicyRequest;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Slf4j
@Service
public class PolicyService extends RequestValidator<PolicyRequest> {

    private final PolicyRepository policyRepository;
    private final InformationTypeRepository informationTypeRepository;

    public PolicyService(PolicyRepository policyRepository, InformationTypeRepository informationTypeRepository) {
        this.policyRepository = policyRepository;
        this.informationTypeRepository = informationTypeRepository;
    }

    public void validateRequests(List<PolicyRequest> requests, boolean isUpdate) {
        // TODO validate process, and that process/purposecode from request matches existing process
        initialize(requests, isUpdate);
        List<ValidationError> validations = new ArrayList<>();
        Map<String, Integer> titlesUsedInRequest = new HashMap<>();
        final AtomicInteger i = new AtomicInteger(1);
        requests.forEach(request -> {
            List<ValidationError> requestValidations = validatePolicyRequest(request);
            String informationTypeName = request.getInformationTypeName();
            String purposeCode = request.getPurposeCode();
            if (titlesUsedInRequest.containsKey(informationTypeName + purposeCode)) {
                requestValidations.add(new ValidationError(request.getReference(), "combinationNotUniqueInThisRequest", String.format(
                        "A request combining InformationType: %s and Purpose: %s is not unique because " +
                                "it is already used in this request (see request nr:%s)",
                        informationTypeName, purposeCode, titlesUsedInRequest.get(informationTypeName + purposeCode))));
            } else if (informationTypeName != null && purposeCode != null) {
                titlesUsedInRequest.put(informationTypeName + purposeCode, i.intValue());
            }
            if (request.isUpdate()) {
                validateUpdate(request, validations);
            }
            validations.addAll(requestValidations);
            i.getAndIncrement();
        });
        if (!validations.isEmpty()) {
            log.error("Validation errors occurred when validating PolicyRequest: {}", validations);
            throw new ValidationException(validations, "Validation errors occurred when validating PolicyRequest.");
        }
    }

    private void validateUpdate(PolicyRequest request, List<ValidationError> validations) {
        if (request.getId() == null) {
            validations.add(new ValidationError(request.getReference(), "missingIdForUpdate", "Id is missing for update"));
            return;
        }
        UUID uuid;
        try {
            uuid = UUID.fromString(request.getId());
        } catch (IllegalArgumentException e) {
            validations.add(new ValidationError(request.getReference(), "invalidIdForUpdate", "Id is invalid for update"));
            return;
        }
        Policy policy = policyRepository.findById(uuid).orElse(null);
        if (policy == null) {
            validations.add(new ValidationError(request.getReference(), "notFound", String.format("A policy with id: %s was not found", request.getId())));
        } else if (!StringUtils.equals(policy.getPurposeCode(), request.getPurposeCode())) {
            validations.add(new ValidationError(request.getReference(), "cannotChangePurpose",
                    String.format("Cannot change purpose from %s to %s for policy %s", policy.getPurposeCode(), request.getPurposeCode(), request.getId())));
        } else {
            request.setExistingPolicy(policy);
        }
    }

    private List<ValidationError> validatePolicyRequest(PolicyRequest request) {
        List<ValidationError> validations = new ArrayList<>();
        if (request.getProcess() == null) {
            validations.add(new ValidationError(request.getReference(), "process", "process cannot be null"));
        }
        if (request.getInformationTypeName() == null) {
            validations.add(new ValidationError(request.getReference(), "informationTypeName", "informationTypeName cannot be null"));
        }
        if (request.getLegalBases() == null) {
            validations.add(new ValidationError(request.getReference(), "legalBases", "legalBases cannot be null"));
            // todo validate content
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
        // Combination of InformationType and purpose must be unique
        if (request.getPurposeCode() != null && request.getInformationTypeName() != null) {
            InformationType informationType = informationTypeRepository.findByName(request.getInformationTypeName()).orElse(null);
            if (informationType == null) {
                validations.add(new ValidationError(request.getReference(), "informationTypeName",
                        String.format("An InformationType with name %s does not exist", request.getInformationTypeName())));
            } else {
                request.setInformationType(informationType);
            }

            if (!request.isUpdate() && informationType != null && exists(informationType.getId(), request.getPurposeCode())) {
                validations.add(new ValidationError(request.getReference(), "informationTypeAndPurpose",
                        String.format("A policy combining InformationType %s and Purpose %s already exists", request.getInformationTypeName(), request.getPurposeCode())));
            }
        }

        if (!validations.isEmpty()) {
            log.error("Validation errors occurred when validating PolicyRequest: {}", validations);
        }
        return validations;
    }

    private boolean exists(UUID informationTypeId, String purposeCode) {
        return policyRepository.findByInformationTypeIdAndPurposeCode(informationTypeId, purposeCode).stream().anyMatch(Policy::isActive);
    }

    public List<Policy> findByPurposeCodeAndProcessName(String purpose, String processName) {
        return policyRepository.findByPurposeCodeAndProcessName(purpose, processName).stream()
                .filter(Policy::isActive)
                .collect(Collectors.toList());
    }
}
