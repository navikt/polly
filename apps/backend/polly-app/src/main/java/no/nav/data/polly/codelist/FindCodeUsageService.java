package no.nav.data.polly.codelist;

import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.FindCodeUsageRequest;
import no.nav.data.polly.codelist.dto.FindCodeUsageResponse;
import no.nav.data.polly.informationtype.InformationTypeRepository;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.dto.InformationTypeResponse;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.policy.domain.PolicyRepository;
import no.nav.data.polly.policy.dto.PolicyResponse;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessRepository;
import no.nav.data.polly.process.dto.ProcessResponse;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FindCodeUsageService {

    private CodelistService codelistService;
    private ProcessRepository processRepository;
    private PolicyRepository policyRepository;
    private InformationTypeRepository informationTypeRepository;

    public FindCodeUsageService(CodelistService codelistService, ProcessRepository processRepository, PolicyRepository policyRepository, InformationTypeRepository informationTypeRepository) {
        this.codelistService = codelistService;
        this.processRepository = processRepository;
        this.policyRepository = policyRepository;
        this.informationTypeRepository = informationTypeRepository;
    }


    void validateRequests(String listName, String code) {
        validateRequests(List.of(FindCodeUsageRequest.builder().listName(listName).code(code).build()));
    }

    void validateRequests(List<FindCodeUsageRequest> requests) {
        codelistService.validateCodeUsageRequests(requests);
    }

    FindCodeUsageResponse findCodeUsage(String listName, String code) {
        return findCodeUsage(List.of(FindCodeUsageRequest.builder().listName(listName).code(code).build())).get(0);
    }

    List<FindCodeUsageResponse> findCodeUsage(List<FindCodeUsageRequest> requests) {
        return requests.stream().map(request -> processByListName(request.getAsListName(), request.getCode())).collect(Collectors.toList());
    }

    private FindCodeUsageResponse processByListName(ListName listName, String code) {
        FindCodeUsageResponse response = new FindCodeUsageResponse(listName);
        switch (listName) {
            // process only
            case PURPOSE:
            case DEPARTMENT:
            case SUB_DEPARTMENT:
                response.setProcessResponses(findProcesses(listName, code));
                break;
            // process and Policy
            case GDPR_ARTICLE:
            case NATIONAL_LAW:
                response.setProcessResponses(findProcesses(listName, code));
                response.setPolicyResponses(findPolicies(listName, code));
                break;
            // policy only
            case SUBJECT_CATEGORY:
                response.setPolicyResponses(findPolicies(listName, code));
                break;
            // informationtypes only
            case SENSITIVITY:
            case SYSTEM:
            case CATEGORY:
            case SOURCE:
                response.setInformationTypeResponses(findInformationTypes(listName, code));
                break;
            default:
                break;
        }
        return response;
    }

    private List<ProcessResponse> findProcesses(ListName listName, String code) {
        switch (listName) {
            case PURPOSE:
                return processRepository.findByPurposeCode(code).stream().map(Process::convertToResponse).collect(Collectors.toList());
            case DEPARTMENT:
                return processRepository.findByDepartment(code).stream().map(Process::convertToResponse).collect(Collectors.toList());
            case SUB_DEPARTMENT:
                return processRepository.findBySubDepartment(code).stream().map(Process::convertToResponse).collect(Collectors.toList());
            case GDPR_ARTICLE:
                return processRepository.findByGDPRArticle(code).stream().map(Process::convertToResponse).collect(Collectors.toList());
            case NATIONAL_LAW:
                return processRepository.findByNationalLaw(code).stream().map(Process::convertToResponse).collect(Collectors.toList());
            default:
                //TODO: ErrorHandling
                return Collections.emptyList();
        }
    }

    private List<PolicyResponse> findPolicies(ListName listName, String code) {
        switch (listName) {
            case SUBJECT_CATEGORY:
                return policyRepository.findBySubjectCategory(code).stream().map(Policy::convertToResponse).collect(Collectors.toList());
            case GDPR_ARTICLE:
                return policyRepository.findByGDPRArticle(code).stream().map(Policy::convertToResponse).collect(Collectors.toList());
            case NATIONAL_LAW:
                return policyRepository.findByNationalLaw(code).stream().map(Policy::convertToResponse).collect(Collectors.toList());
            default:
                //TODO: ErrorHandling
                return Collections.emptyList();
        }
    }

    private List<InformationTypeResponse> findInformationTypes(ListName listName, String code) {
        switch (listName) {
            case SENSITIVITY:
                return informationTypeRepository.findBySensitivity(code).stream().map(InformationType::convertToResponse).collect(Collectors.toList());
            case SYSTEM:
                return informationTypeRepository.findByNavMaster(code).stream().map(InformationType::convertToResponse).collect(Collectors.toList());
            case CATEGORY:
                return informationTypeRepository.findByCategory(code).stream().map(InformationType::convertToResponse).collect(Collectors.toList());
            case SOURCE:
                return informationTypeRepository.findBySource(code).stream().map(InformationType::convertToResponse).collect(Collectors.toList());
            default:
                //TODO: ErrorHandling
                return Collections.emptyList();
        }
    }
}
