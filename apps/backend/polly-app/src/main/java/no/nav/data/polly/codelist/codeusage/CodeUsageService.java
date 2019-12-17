package no.nav.data.polly.codelist.codeusage;

import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodeUsageRequest;
import no.nav.data.polly.informationtype.InformationTypeRepository;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.policy.domain.PolicyRepository;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CodeUsageService {

    private CodelistService codelistService;
    private ProcessRepository processRepository;
    private PolicyRepository policyRepository;
    private InformationTypeRepository informationTypeRepository;

    public CodeUsageService(CodelistService codelistService, ProcessRepository processRepository, PolicyRepository policyRepository, InformationTypeRepository informationTypeRepository) {
        this.codelistService = codelistService;
        this.processRepository = processRepository;
        this.policyRepository = policyRepository;
        this.informationTypeRepository = informationTypeRepository;
    }

    public void validateListName(String list) {
        codelistService.validateListName(list);
    }

    void validateRequests(String listName, String code) {
        validateRequests(List.of(CodeUsageRequest.builder().listName(listName).code(code).build()));
    }

    void validateRequests(List<CodeUsageRequest> requests) {
        codelistService.validateCodeUsageRequests(requests);
    }

    public List<CodeUsage> findCodeUsageOfList(ListName list) {
        return CodelistService.getCodelist(list).stream().map(c -> findCodeUsage(c.getList(), c.getCode())).collect(Collectors.toList());
    }

    public CodeUsage findCodeUsage(ListName listName, String code) {
        CodeUsage codeUsage = new CodeUsage(listName.toString(), code);
        switch (listName) {
            // process only
            case DEPARTMENT:
            case SUB_DEPARTMENT:
                codeUsage.setProcesses(findProcesses(listName, code));
                break;
            // process and Policy
            case PURPOSE:
            case GDPR_ARTICLE:
            case NATIONAL_LAW:
                codeUsage.setProcesses(findProcesses(listName, code));
                codeUsage.setPolicies(findPolicies(listName, code));
                break;
            // policy only
            case SUBJECT_CATEGORY:
                codeUsage.setPolicies(findPolicies(listName, code));
                break;
            // informationtypes only
            case SENSITIVITY:
            case SYSTEM:
            case CATEGORY:
            case SOURCE:
                codeUsage.setInformationTypes(findInformationTypes(listName, code));
                break;
            default:
                break;
        }
        return codeUsage;
    }

    private List<UsedInInstance> findProcesses(ListName listName, String code) {
        switch (listName) {
            case PURPOSE:
                return processRepository.findByPurposeCode(code).stream().map(Process::getInstanceIdentification).collect(Collectors.toList());
            case DEPARTMENT:
                return processRepository.findByDepartment(code).stream().map(Process::getInstanceIdentification).collect(Collectors.toList());
            case SUB_DEPARTMENT:
                return processRepository.findBySubDepartment(code).stream().map(Process::getInstanceIdentification).collect(Collectors.toList());
            case GDPR_ARTICLE:
                return processRepository.findByGDPRArticle(code).stream().map(Process::getInstanceIdentification).collect(Collectors.toList());
            case NATIONAL_LAW:
                return processRepository.findByNationalLaw(code).stream().map(Process::getInstanceIdentification).collect(Collectors.toList());
            default:
                return Collections.emptyList();
        }
    }

    private List<UsedInInstance> findPolicies(ListName listName, String code) {
        switch (listName) {
            case PURPOSE:
                return policyRepository.findByPurposeCode(code).stream().map(Policy::getInstanceIdentification).collect(Collectors.toList());
            case SUBJECT_CATEGORY:
                return policyRepository.findBySubjectCategory(code).stream().map(Policy::getInstanceIdentification).collect(Collectors.toList());
            case GDPR_ARTICLE:
                return policyRepository.findByGDPRArticle(code).stream().map(Policy::getInstanceIdentification).collect(Collectors.toList());
            case NATIONAL_LAW:
                return policyRepository.findByNationalLaw(code).stream().map(Policy::getInstanceIdentification).collect(Collectors.toList());
            default:
                return Collections.emptyList();
        }
    }

    private List<UsedInInstance> findInformationTypes(ListName listName, String code) {
        switch (listName) {
            case SENSITIVITY:
                return informationTypeRepository.findBySensitivity(code).stream().map(InformationType::getInstanceIdentification).collect(Collectors.toList());
            case SYSTEM:
                return informationTypeRepository.findByNavMaster(code).stream().map(InformationType::getInstanceIdentification).collect(Collectors.toList());
            case CATEGORY:
                return informationTypeRepository.findByCategory(code).stream().map(InformationType::getInstanceIdentification).collect(Collectors.toList());
            case SOURCE:
                return informationTypeRepository.findBySource(code).stream().map(InformationType::getInstanceIdentification).collect(Collectors.toList());
            default:
                return Collections.emptyList();
        }
    }

}
