package no.nav.data.polly.policy;

import lombok.RequiredArgsConstructor;
import no.nav.data.common.exceptions.NotFoundException;
import no.nav.data.common.utils.OptimisticLockingUtil;
import no.nav.data.polly.alert.AlertService;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.policy.domain.PolicyRepository;
import no.nav.data.polly.policy.dto.PolicyRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PolicyService {

    private final PolicyRepository policyRepository;
    private final AlertService alertService;

    @Transactional
    public List<Policy> create(List<PolicyRequest> policyRequests) {
        List<Policy> policies = new ArrayList<>();
        for (PolicyRequest request : policyRequests) {
            Policy policy = Policy.builder().generateId().build().copyFieldsFrom(request);
            policies.add(policy);
        }
        return saveAll(policies);
    }

    @Transactional
    public List<Policy> saveAll(List<Policy> policies) {
        var all = policyRepository.saveAll(policies);
        // Flush slik at Hibernate har økt version (i tilfelle omsluttende transaksjon utsetter flush)
        policyRepository.flush();
        onChange(all, false);
        return all;
    }

    @Transactional
    public Policy update(PolicyRequest request) {
        return update(List.of(request)).get(0);
    }

    @Transactional
    public List<Policy> update(List<PolicyRequest> requests) {
        List<Policy> result = new ArrayList<>();
        for (PolicyRequest request : requests) {
            Policy policy = policyRepository.findById(request.getIdAsUUID()).orElseThrow(() -> new NotFoundException("Cannot find Policy with id=" + request.getId()));
            OptimisticLockingUtil.checkVersion(policy, request.getVersion()); // Kaster OptimisticLockingFailureException hvis feil version
            policy.copyFieldsFrom(request);
            result.add(policy);
        }
        return saveAll(result);
    }        

    @Transactional
    public List<Policy> deleteByProcessId(UUID processId) {
        List<Policy> policies = policyRepository.findByProcessId(processId);
        policies.forEach((this::delete));
        return policies;
    }

    @Transactional
    public Policy deleteById(UUID id, Integer expectedVersion) {
        Policy existing = policyRepository.findById(id).orElseThrow(() -> new NotFoundException("Cannot find Disclosure with id=" + id));
        OptimisticLockingUtil.checkVersion(existing, expectedVersion); // Kaster OptimisticLockingFailureException hvis feil version 
        delete(existing);
        return existing;
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

}
