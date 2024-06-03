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
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.repo.ProcessRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static java.util.stream.Collectors.toMap;
import static no.nav.data.common.utils.StreamUtils.convert;
import static no.nav.data.common.utils.StreamUtils.filter;
import static no.nav.data.common.utils.StreamUtils.safeStream;

@Slf4j
@Service
public class PolicyService extends RequestValidator<PolicyRequest> {

    private final PolicyRepository policyRepository;
    private final InformationTypeRepository informationTypeRepository;
    private final ProcessRepository processRepository;
    private final AlertService alertService;

    public PolicyService(PolicyRepository policyRepository, InformationTypeRepository informationTypeRepository,
            ProcessRepository processRepository, AlertService alertService) {
        this.policyRepository = policyRepository;
        this.informationTypeRepository = informationTypeRepository;
        this.processRepository = processRepository;
        this.alertService = alertService;
    }

    @Transactional
    public List<Policy> saveAll(List<Policy> policies) {
        var all = policyRepository.saveAll(policies);
        onChange(all, false);
        return all;
    }

    @Transactional
    public List<Policy> deleteByProcessId(UUID processId) {
        List<Policy> policeis = policyRepository.findByProcessId(processId);
        policeis.forEach((this::delete));
        return policeis;
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
    }

    public void validateRequests(List<PolicyRequest> requests, boolean isUpdate) {
        initialize(requests, isUpdate);
        List<ValidationError> validations = new ArrayList<>();
        Map<PolicyIdent, Integer> requestIdents = new HashMap<>();
        requests.forEach(PolicyRequest::format); // format all first to ensure duplicate logic is correct
        requests.forEach(r -> PolicyIdent.from(r).forEach(ident -> requestIdents.put(ident, r.getRequestIndex())));
        requests.forEach(request -> {
            validations.addAll(request.validateFields());
            validations.addAll(validateRepositoryForPolicyRequest(request));
            validateDuplicates(validations, requestIdents, request);
            if (request.isUpdate()) {
                validateUpdate(request, validations);
            }
        });
        if (!validations.isEmpty()) {
            log.warn("Validation errors occurred when validating PolicyRequest: {}", validations);
            throw new ValidationException(validations, "Validation errors occurred when validating PolicyRequest.");
        }
    }

    private void validateDuplicates(List<ValidationError> validations, Map<PolicyIdent, Integer> allRequestIdents, PolicyRequest request) {
        Map<UUID, List<PolicyIdent>> processPolicyIdents = request.getProcess() == null ? Map.of() :
                safeStream(request.getProcess().getPolicies()).collect(toMap(Policy::getId, PolicyIdent::from));
        var requestIdents = PolicyIdent.from(request);

        var requestCollisions = filter(allRequestIdents.entrySet(), ident -> requestIdents.contains(ident.getKey()) && ident.getValue() != request.getRequestIndex());
        var processCollisions = filter(processPolicyIdents.entrySet(),
                process -> !process.getKey().toString().equals(request.getId()) && requestIdents.stream().anyMatch(reqIdent -> process.getValue().contains(reqIdent)));
        requestCollisions.forEach(rc -> validations.add(duplicateRequestError(request, rc.getValue())));
        processCollisions.forEach(pc -> validations.add(duplicateInProcessError(request)));
    }

    private ValidationError duplicateRequestError(PolicyRequest request, int duplicateIndex) {
        return new ValidationError(request.getReference(), "combinationNotUniqueInThisRequest", String.format(
                "A request combining %s is not unique because it is already used in this request (see request nr: %d and %d)",
                PolicyIdent.from(request), request.getRequestIndex(), duplicateIndex));
    }

    private ValidationError duplicateInProcessError(PolicyRequest request) {
        return new ValidationError(request.getReference(), "combinationNotUniqueInThisProcess", String.format(
                "A request combining %s is not unique because it is already used in this process (see request nr: %d)",
                PolicyIdent.from(request), request.getRequestIndex()));
    }

    private void validateUpdate(PolicyRequest request, List<ValidationError> validations) {
        if (request.getId() == null) {
            validations.add(new ValidationError(request.getReference(), "missingIdForUpdate", "Id is missing for update"));
            return;
        }
        Policy policy = Optional.ofNullable(request.getIdAsUUID()).flatMap(policyRepository::findById).orElse(null);
        if (policy == null) {
            validations.add(new ValidationError(request.getReference(), "notFound", String.format("A policy with id: %s was not found", request.getId())));
        } else if (!policy.getData().getPurposes().equals(request.getPurposes())) {
            validations.add(new ValidationError(request.getReference(), "cannotChangePurpose",
                    String.format("Cannot change purpose from %s to %s for policy %s", policy.getData().getPurposes(), request.getPurposes(), request.getId())));
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

    record PolicyIdent(UUID informationTypeId, UUID processId, String subjectCategory) {

        static List<PolicyIdent> from(PolicyRequest request) {
            return convert(request.getSubjectCategories(), subjectCategory -> new PolicyIdent(request.getInformationTypeIdAsUUID(), request.getProcessIdAsUUID(), subjectCategory));
        }

        static List<PolicyIdent> from(Policy policy) {
            return convert(policy.getData().getSubjectCategories(),
                    subjectCategory -> new PolicyIdent(policy.getInformationTypeId(), policy.getProcess().getId(), subjectCategory));
        }

        @Override
        public String toString() {
            return String.format("InformationType: %s Process: %s SubjectCategory: %s", informationTypeId, processId, subjectCategory);
        }
    }
}
