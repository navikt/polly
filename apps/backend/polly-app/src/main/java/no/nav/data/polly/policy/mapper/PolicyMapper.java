package no.nav.data.polly.policy.mapper;

import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.ListName;
import no.nav.data.polly.policy.domain.DatasetResponse;
import no.nav.data.polly.policy.domain.PolicyRequest;
import no.nav.data.polly.policy.domain.PolicyResponse;
import no.nav.data.polly.policy.entities.Policy;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class PolicyMapper {

    private static final LocalDate DEFAULT_FOM = LocalDate.of(1, 1, 1);
    private static final LocalDate DEFAULT_TOM = LocalDate.of(9999, 12, 31);

    public Policy mapRequestToPolicy(PolicyRequest policyRequest, Long id) {
        Policy policy = new Policy();
        policy.setDatasetId(policyRequest.getDatasetId());
        policy.setDatasetTitle(policyRequest.getDatasetTitle());
        policy.setPurposeCode(policyRequest.getPurposeCode());
        policy.setLegalBasisDescription(policyRequest.getLegalBasisDescription());
        policy.setFom(parse(policyRequest.getFom(), DEFAULT_FOM));
        policy.setTom(parse(policyRequest.getTom(), DEFAULT_TOM));
        if (id != null) {
            policy.setPolicyId(id);
        }
        Policy existingPolicy = policyRequest.getExistingPolicy();
        if (existingPolicy != null) {
            policy.setCreatedBy(existingPolicy.getCreatedBy());
            policy.setCreatedDate(existingPolicy.getCreatedDate());
        }
        return policy;
    }

    public PolicyResponse mapPolicyToResponse(Policy policy) {
        PolicyResponse response = new PolicyResponse();
        response.setPolicyId(policy.getPolicyId());
        response.setLegalBasisDescription(policy.getLegalBasisDescription());
        response.setDataset(new DatasetResponse(policy.getDatasetId(), policy.getDatasetTitle()));
        response.setPurpose(CodelistService.getCodeResponseForCodelistItem(ListName.CATEGORY, policy.getPurposeCode()));
        response.setFom(policy.getFom());
        response.setTom(policy.getTom());
        response.setActive(policy.isActive());
        return response;
    }

    private LocalDate parse(String date, LocalDate defaultValue) {
        return date == null ? defaultValue : LocalDate.parse(date);
    }
}
