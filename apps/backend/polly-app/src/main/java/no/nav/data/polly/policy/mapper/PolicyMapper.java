package no.nav.data.polly.policy.mapper;

import no.nav.data.polly.codelist.dto.CodeResponse;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.policy.domain.LegalBasis;
import no.nav.data.polly.policy.dto.LegalBasisRequest;
import no.nav.data.polly.policy.dto.InformationTypeNameResponse;
import no.nav.data.polly.policy.dto.PolicyRequest;
import no.nav.data.polly.policy.dto.PolicyResponse;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessRepository;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.UUID;

import static no.nav.data.polly.common.utils.StreamUtils.convert;

@Component
public class PolicyMapper {

    private static final LocalDate DEFAULT_FOM = LocalDate.of(1, 1, 1);
    private static final LocalDate DEFAULT_TOM = LocalDate.of(9999, 12, 31);

    private final ProcessRepository processRepository;

    public PolicyMapper(ProcessRepository processRepository) {
        this.processRepository = processRepository;
    }

    public Policy mapRequestToPolicy(PolicyRequest policyRequest) {
        Policy policy = policyRequest.getExistingPolicy() != null ? policyRequest.getExistingPolicy() : new Policy();
        policyRequest.getInformationType().addPolicy(policy);
        policy.setPurposeCode(policyRequest.getPurposeCode());
        policy.setSubjectCategories(policyRequest.getSubjectCategories());
        policy.setStart(parse(policyRequest.getStart(), DEFAULT_FOM));
        policy.setEnd(parse(policyRequest.getEnd(), DEFAULT_TOM));
        policy.setLegalBases(convert(policyRequest.getLegalBases(), LegalBasisRequest::convertToLegalBasis));
        if (policy.getId() == null) {
            policy.setId(UUID.randomUUID());
        }
        processRepository.findByName(policyRequest.getProcess())
                .orElseGet(() -> processRepository.save(createProcess(policyRequest)))
                .addPolicy(policy);
        return policy;
    }

    public PolicyResponse mapPolicyToResponse(Policy policy) {
        PolicyResponse response = new PolicyResponse();
        response.setId(policy.getId());
        if (policy.getInformationType() != null) {
            response.setInformationType(new InformationTypeNameResponse(policy.getInformationTypeId().toString(), policy.getInformationTypeName()));
        }
        CodeResponse purposeCode = CodelistService.getCodeResponseForCodelistItem(ListName.PURPOSE, policy.getPurposeCode());
        response.setPurposeCode(purposeCode);
        response.setSubjectCategories(policy.getSubjectCategories());
        response.setProcess(policy.getProcess().getName());
        response.setStart(policy.getStart());
        response.setEnd(policy.getEnd());
        response.setActive(policy.isActive());
        response.setLegalBases(convert(policy.getLegalBases(), LegalBasis::convertToResponse));
        return response;
    }

    private Process createProcess(PolicyRequest policyRequest) {
        return Process.builder().generateId().name(policyRequest.getProcess()).purposeCode(policyRequest.getPurposeCode()).build();
    }

    private LocalDate parse(String date, LocalDate defaultValue) {
        return date == null ? defaultValue : LocalDate.parse(date);
    }
}
