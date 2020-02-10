package no.nav.data.polly.policy.mapper;

import no.nav.data.polly.common.utils.DateUtil;
import no.nav.data.polly.legalbasis.dto.LegalBasisRequest;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.policy.domain.PolicyData;
import no.nav.data.polly.policy.dto.PolicyRequest;
import org.apache.commons.lang3.BooleanUtils;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

import static no.nav.data.polly.common.utils.StreamUtils.convert;

@Component
public class PolicyMapper {

    public Policy mapRequestToPolicy(PolicyRequest policyRequest) {
        Policy policy = policyRequest.getExistingPolicy() != null ? policyRequest.getExistingPolicy() : Policy.builder().generateId().data(new PolicyData()).build();
        policyRequest.getInformationType().addPolicy(policy);
        policyRequest.getProcess().addPolicy(policy);
        policy.setPurposeCode(policyRequest.getPurposeCode());
        policy.getData().setSubjectCategories(List.copyOf(policyRequest.getSubjectCategories()));
        policy.getData().setStart(DateUtil.parseStart(policyRequest.getStart()));
        policy.getData().setEnd(DateUtil.parseEnd(policyRequest.getEnd()));
        policy.getData().setLegalBasesInherited(BooleanUtils.toBoolean(policyRequest.getLegalBasesInherited()));
        policy.getData().setLegalBases(convert(policyRequest.getLegalBases(), LegalBasisRequest::convertToLegalBasis));
        policy.getData().setDocumentIds(convert(policyRequest.getDocumentIds(), UUID::fromString));
        return policy;
    }

}
