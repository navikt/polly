package no.nav.data.polly.policy;

import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.exceptions.ValidationException;
import no.nav.data.common.validator.RequestValidator;
import no.nav.data.common.validator.ValidationError;
import no.nav.data.polly.alert.AlertService;
import no.nav.data.polly.informationtype.InformationTypeRepository;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.policy.domain.PolicyRepository;
import no.nav.data.polly.policy.dto.PolicyRequest;
import no.nav.data.polly.process.ProcessService;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessRepository;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final ProcessRepository processRepository;
    private final ProcessService processService;
    private final AlertService alertService;

    public PolicyService(PolicyRepository policyRepository, InformationTypeRepository informationTypeRepository,
            ProcessRepository processRepository, ProcessService processService, AlertService alertService) {
        this.policyRepository = policyRepository;
        this.informationTypeRepository = informationTypeRepository;
        this.processRepository = processRepository;
        this.processService = processService;
        this.alertService = alertService;
    }

    @Transactional
    public List<Policy> saveAll(List<Policy> policies) {
        var all = policyRepository.saveAll(policies);
        onChange(all, false);
        return all;
    }

    @Transactional
    public void delete(Policy policy) {
        policyRepository.deleteById(policy.getId());
        onChange(List.of(policy), true);
    }

    private void onChange(List<Policy> policies, boolean delete) {
        if (delete) {
            policies.forEach(alertService::deleteEventsForPolicy);
        } else {
            policies.forEach(alertService::calculateEventsForPolicy);
        }
        policies.stream().map(Policy::getProcess).distinct().forEach(processService::scheduleDistributeForProcess);
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
        if (request.getInformationTypeIdAsUUID() != null) {
            InformationType informationType = informationTypeRepository.findById(request.getInformationTypeIdAsUUID()).orElse(null);
            if (informationType == null) {
                validations.add(new ValidationError(request.getReference(), "informationTypeId",
                        String.format("An InformationType with id %s does not exist", request.getInformationTypeId())));
            } else {
                request.setInformationType(informationType);
            }
        }
        if (request.getProcessIdAsUUID() != null) {
            Process process = processRepository.findById(request.getProcessIdAsUUID()).orElse(null);
            if (process == null) {
                validations.add(new ValidationError(request.getReference(), "processId",
                        String.format("A Process with id %s does not exist", request.getProcessId())));
            } else {
                request.setProcess(process);
            }
        }
        return validations;
    }

    private String identifiers(PolicyRequest request) {
        return String.format("InformationType: %s and Process: %s Purpose: %s SubjectCategories: %s",
                request.getInformationTypeId(), request.getProcessId(), request.getPurposeCode(), request.getSubjectCategories());
    }
}
