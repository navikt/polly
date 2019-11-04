package no.nav.data.polly.policy.mapper;

import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.common.utils.DateUtil;
import no.nav.data.polly.legalbasis.dto.LegalBasisRequest;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.policy.dto.PolicyRequest;
import no.nav.data.polly.policy.dto.PolicyResponse;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessRepository;
import no.nav.data.polly.process.dto.ProcessRequest;
import org.apache.commons.lang3.BooleanUtils;
import org.springframework.stereotype.Component;

import java.util.UUID;

import static no.nav.data.polly.common.utils.StreamUtils.convert;

@Component
public class PolicyMapper {

    private final ProcessRepository processRepository;

    public PolicyMapper(ProcessRepository processRepository) {
        this.processRepository = processRepository;
    }

    public Policy mapRequestToPolicy(PolicyRequest policyRequest) {
        Policy policy = policyRequest.getExistingPolicy() != null ? policyRequest.getExistingPolicy() : new Policy();
        policyRequest.getInformationType().addPolicy(policy);
        policy.setPurposeCode(CodelistService.format(ListName.PURPOSE, policyRequest.getPurposeCode()));
        policy.setSubjectCategory(CodelistService.format(ListName.SUBJECT_CATEGORY, policyRequest.getSubjectCategory()));
        policy.setStart(DateUtil.parseStart(policyRequest.getStart()));
        policy.setEnd(DateUtil.parseEnd(policyRequest.getEnd()));
        policy.setLegalBasesInherited(BooleanUtils.toBoolean(policyRequest.getLegalBasesInherited()));
        policy.setLegalBases(convert(policyRequest.getLegalBases(), LegalBasisRequest::convertToLegalBasis));
        if (policy.getId() == null) {
            policy.setId(UUID.randomUUID());
        }
        processRepository.findByNameAndPurposeCode(policyRequest.getProcess(), policyRequest.getPurposeCode())
                .orElseGet(() -> processRepository.save(createProcess(policyRequest)))
                .addPolicy(policy);
        return policy;
    }

    public PolicyResponse mapPolicyToResponse(Policy policy) {
        return policy.convertToResponse();
    }

    private Process createProcess(PolicyRequest policyRequest) {
        return ProcessRequest.builder()
                .name(policyRequest.getProcess())
                .purposeCode(policyRequest.getPurposeCode())
                .build()
                .convertToProcess();
    }

}
