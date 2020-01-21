package no.nav.data.polly.policy;

import lombok.extern.slf4j.Slf4j;
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
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

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
        initialize(requests, isUpdate);
        List<ValidationError> validations = new ArrayList<>();
        Map<String, Integer> titlesUsedInRequest = new HashMap<>();
        final AtomicInteger i = new AtomicInteger(1);
        requests.forEach(request -> {
            List<ValidationError> requestValidations = new ArrayList<>(request.validateFields());
            requestValidations.addAll(validateRepositoryForPolicyRequest(request));
            if (titlesUsedInRequest.containsKey(request.getIdentifyingFields())) {
                requestValidations.add(new ValidationError(request.getReference(), "combinationNotUniqueInThisRequest", String.format(
                        "A request combining %s is not unique because it is already used in this request (see request nr:%s)",
                        identifiers(request), titlesUsedInRequest.get(request.getIdentifyingFields()))));
            } else {
                titlesUsedInRequest.put(request.getIdentifyingFields(), i.intValue());
            }
            if (request.isUpdate()) {
                validateUpdate(request, validations);
            }
            validations.addAll(requestValidations);
            i.getAndIncrement();
        });
        if (!validations.isEmpty()) {
            log.warn("Validation errors occurred when validating PolicyRequest: {}", validations);
            throw new ValidationException(validations, "Validation errors occurred when validating PolicyRequest.");
        }
    }

    private void validateUpdate(PolicyRequest request, List<ValidationError> validations) {
        if (request.getId() == null) {
            validations.add(new ValidationError(request.getReference(), "missingIdForUpdate", "Id is missing for update"));
            return;
        }
        Policy policy = Optional.ofNullable(request.getIdAsUUID()).flatMap(policyRepository::findById).orElse(null);
        if (policy == null) {
            validations.add(new ValidationError(request.getReference(), "notFound", String.format("A policy with id: %s was not found", request.getId())));
        } else if (!StringUtils.equals(policy.getPurposeCode(), request.getPurposeCode())) {
            validations.add(new ValidationError(request.getReference(), "cannotChangePurpose",
                    String.format("Cannot change purpose from %s to %s for policy %s", policy.getPurposeCode(), request.getPurposeCode(), request.getId())));
        } else {
            request.setExistingPolicy(policy);
        }
    }

    private List<ValidationError> validateRepositoryForPolicyRequest(PolicyRequest request) {
        List<ValidationError> validations = new ArrayList<>();
        if (request.getInformationTypeName() != null) {
            InformationType informationType = informationTypeRepository.findByName(request.getInformationTypeName()).orElse(null);
            if (informationType == null) {
                validations.add(new ValidationError(request.getReference(), "informationTypeName",
                        String.format("An InformationType with name %s does not exist", request.getInformationTypeName())));
            } else {
                request.setInformationType(informationType);
            }
        }
        return validations;
    }

    private String identifiers(PolicyRequest request) {
        return String.format("InformationType: %s and Process: %s Purpose: %s SubjectCategories: %s",
                request.getInformationTypeName(), request.getProcess(), request.getPurposeCode(), request.getSubjectCategories());
    }

}
