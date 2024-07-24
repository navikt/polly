package no.nav.data.polly.policy;

import lombok.RequiredArgsConstructor;
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

@Service
@RequiredArgsConstructor
public class PolicyService {

    private final PolicyRepository policyRepository;
    private final AlertService alertService;

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

}
