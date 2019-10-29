package no.nav.data.polly.purpose;

import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.policy.PolicyService;
import no.nav.data.polly.policy.entities.Policy;
import no.nav.data.polly.purpose.domain.InformationTypePurposeResponse;
import org.springframework.stereotype.Service;

import java.util.List;

import static java.util.stream.Collectors.toList;

@Slf4j
@Service
public class PurposeService {

    private final PolicyService policyService;

    public PurposeService(PolicyService policyService) {
        this.policyService = policyService;
    }

    List<InformationTypePurposeResponse> findPurpose(String purpose) {
        return policyService.findActiveByPurposeCode(purpose).stream()
                .map(Policy::convertToPurposeResponse)
                .collect(toList());
    }
}
