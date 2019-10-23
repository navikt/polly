package no.nav.data.polly.policy.mapper;

import no.nav.data.polly.codelist.CodeResponse;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.ListName;
import no.nav.data.polly.policy.domain.PolicyRequest;
import no.nav.data.polly.policy.domain.PolicyResponse;
import no.nav.data.polly.policy.entities.Policy;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.UUID;

@Component
public class PolicyMapper {

    private static final LocalDate DEFAULT_FOM = LocalDate.of(1, 1, 1);
    private static final LocalDate DEFAULT_TOM = LocalDate.of(9999, 12, 31);

    public Policy mapRequestToPolicy(PolicyRequest policyRequest, UUID id) {
        Policy policy = new Policy();
//        policy.setDatasetId(policyRequest.getDatasetId());
//        policy.setDatasetTitle(policyRequest.getDatasetTitle());
        policy.setPurposeCode(policyRequest.getPurposeCode());
        policy.setStart(parse(policyRequest.getStart(), DEFAULT_FOM));
        policy.setEnd(parse(policyRequest.getEnd(), DEFAULT_TOM));
        if (id != null) {
            policy.setId(id);
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
        response.setPolicyId(policy.getId());
//        response.setLegalBasisDescription(policy.getLegalBasisDescription());
//        response.setDataset(new DatasetResponse(policy.getDatasetId(), policy.getDatasetTitle()));
        CodeResponse purposeCode = CodelistService.getCodeResponseForCodelistItem(ListName.PURPOSE, policy.getPurposeCode());
        response.setPurpose(purposeCode);
        response.setStart(policy.getStart());
        response.setEnd(policy.getEnd());
        response.setActive(policy.isActive());
        return response;
    }

    private LocalDate parse(String date, LocalDate defaultValue) {
        return date == null ? defaultValue : LocalDate.parse(date);
    }
}
