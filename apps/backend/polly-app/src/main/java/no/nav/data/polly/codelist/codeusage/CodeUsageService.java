package no.nav.data.polly.codelist.codeusage;

import io.prometheus.client.Summary;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodeUsageRequest;
import no.nav.data.polly.codelist.dto.CodeUsageResponse;
import no.nav.data.polly.codelist.dto.UsedInInstance;
import no.nav.data.polly.codelist.dto.UsedInInstancePurpose;
import no.nav.data.polly.common.utils.MetricUtils;
import no.nav.data.polly.disclosure.domain.Disclosure;
import no.nav.data.polly.disclosure.domain.DisclosureRepository;
import no.nav.data.polly.document.domain.Document;
import no.nav.data.polly.document.domain.DocumentRepository;
import no.nav.data.polly.informationtype.InformationTypeRepository;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.legalbasis.domain.LegalBasis;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.policy.domain.PolicyRepository;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.stream.Stream;

import static java.util.Collections.replaceAll;
import static java.util.stream.Collectors.toList;
import static no.nav.data.polly.common.utils.StreamUtils.convert;
import static no.nav.data.polly.common.utils.StreamUtils.nullToEmptyList;

@Service
@Transactional
public class CodeUsageService {

    private final CodelistService codelistService;
    private final ProcessRepository processRepository;
    private final PolicyRepository policyRepository;
    private final InformationTypeRepository informationTypeRepository;
    private final DisclosureRepository disclosureRepository;
    private final DocumentRepository documentRepository;
    private final Summary summary;

    public CodeUsageService(CodelistService codelistService, ProcessRepository processRepository, PolicyRepository policyRepository,
            InformationTypeRepository informationTypeRepository, DisclosureRepository disclosureRepository, DocumentRepository documentRepository) {
        this.codelistService = codelistService;
        this.processRepository = processRepository;
        this.policyRepository = policyRepository;
        this.informationTypeRepository = informationTypeRepository;
        this.disclosureRepository = disclosureRepository;
        this.documentRepository = documentRepository;
        List<String[]> listnames = Stream.of(ListName.values()).map(e -> new String[]{e.name()}).collect(toList());
        this.summary = MetricUtils.summary()
                .labels(listnames)
                .labelNames("listname")
                .name("polly_codeusage_find_summary")
                .help("Time taken for listname usage lookup times")
                .quantile(.9, .01).quantile(.99, .001)
                .register();
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

    public List<CodeUsageResponse> findCodeUsageOfList(ListName list) {
        return CodelistService.getCodelist(list).stream().map(c -> findCodeUsage(c.getList(), c.getCode())).collect(toList());
    }

    public CodeUsageResponse findCodeUsage(ListName listName, String code) {
        return summary.labels(listName.name()).time(() -> {
            CodeUsageResponse codeUsage = new CodeUsageResponse(listName, code);
            codeUsage.setProcesses(findProcesses(listName, code));
            codeUsage.setPolicies(findPolicies(listName, code));
            codeUsage.setInformationTypes(findInformationTypes(listName, code));
            codeUsage.setDisclosures(findDisclosures(listName, code));
            codeUsage.setDocuments(findDocuments(listName, code));
            return codeUsage;
        });
    }

    @SuppressWarnings({"ResultOfMethodCallIgnored"})
    public CodeUsageResponse replaceUsage(ListName listName, String oldCode, String newCode) {
        var usage = findCodeUsage(listName, oldCode);
        if (usage.isInUse()) {
            switch (listName) {
                case PURPOSE:
                    getProcesses(usage).forEach(p -> p.setPurposeCode(newCode));
                    getPolicies(usage).forEach(p -> p.setPurposeCode(newCode));
                    break;
                case CATEGORY:
                    getInformationTypes(usage).forEach(it -> replaceAll(it.getData().getCategories(), oldCode, newCode));
                    break;
                case THIRD_PARTY:
                    getInformationTypes(usage).forEach(it -> replaceAll(it.getData().getSources(), oldCode, newCode));
                    getDisclosures(usage).forEach(d -> d.getData().setRecipient(newCode));
                    getProcesses(usage).forEach(d -> d.getData().setCommonExternalProcessResponsible(newCode));
                    break;
                case SENSITIVITY:
                    getInformationTypes(usage).forEach(it -> it.getData().setSensitivity(newCode));
                    break;
                case SUBJECT_CATEGORY:
                    getPolicies(usage).forEach(p -> replaceAll(p.getData().getSubjectCategories(), oldCode, newCode));
                    getDocuments(usage).forEach(d -> nullToEmptyList(d.getData().getInformationTypes())
                            .forEach(it -> replaceAll(nullToEmptyList(it.getSubjectCategories()), oldCode, newCode)));
                    break;
                case NATIONAL_LAW:
                    replaceNationalLaw(
                            oldCode, newCode,
                            convert(getProcesses(usage), p -> p.getData().getLegalBases()),
                            convert(getPolicies(usage), p -> p.getData().getLegalBases()),
                            convert(getDisclosures(usage), p -> p.getData().getLegalBases())
                    );
                    break;
                case GDPR_ARTICLE:
                    replaceGdprArticle(
                            oldCode, newCode,
                            convert(getProcesses(usage), p -> p.getData().getLegalBases()),
                            convert(getPolicies(usage), p -> p.getData().getLegalBases()),
                            convert(getDisclosures(usage), p -> p.getData().getLegalBases())
                    );
                    break;
                case DEPARTMENT:
                    getProcesses(usage).forEach(p -> p.getData().setDepartment(newCode));
                    break;
                case SUB_DEPARTMENT:
                    getProcesses(usage).forEach(p -> replaceAll(p.getData().getSubDepartments(), oldCode, newCode));
                    break;
                case SYSTEM:
                    getInformationTypes(usage).forEach(it -> it.getData().setNavMaster(newCode));
                    getProcesses(usage).forEach(p -> replaceAll(p.getData().getProducts(), oldCode, newCode));
                    break;
            }
        }
        return usage;
    }

    @SafeVarargs
    private void replaceNationalLaw(String oldCode, String newCode, List<List<LegalBasis>>... legalBases) {
        Stream.of(legalBases)
                .flatMap(Collection::stream).flatMap(Collection::stream)
                .filter(lb -> lb.getNationalLaw().equals(oldCode))
                .forEach(lb -> lb.setNationalLaw(newCode));
    }

    @SafeVarargs
    private void replaceGdprArticle(String oldCode, String newCode, List<List<LegalBasis>>... legalBases) {
        Stream.of(legalBases)
                .flatMap(Collection::stream).flatMap(Collection::stream)
                .filter(lb -> lb.getGdpr().equals(oldCode))
                .forEach(lb -> lb.setGdpr(newCode));
    }

    private List<UsedInInstancePurpose> findProcesses(ListName listName, String code) {
        switch (listName) {
            case PURPOSE:
                return processRepository.findByPurposeCode(code).stream().map(Process::getInstanceIdentification).collect(toList());
            case DEPARTMENT:
                return processRepository.findByDepartment(code).stream().map(Process::getInstanceIdentification).collect(toList());
            case SUB_DEPARTMENT:
                return processRepository.findBySubDepartment(code).stream().map(Process::getInstanceIdentification).collect(toList());
            case GDPR_ARTICLE:
                return processRepository.findByGDPRArticle(code).stream().map(Process::getInstanceIdentification).collect(toList());
            case NATIONAL_LAW:
                return processRepository.findByNationalLaw(code).stream().map(Process::getInstanceIdentification).collect(toList());
            case SYSTEM:
                return processRepository.findByProduct(code).stream().map(Process::getInstanceIdentification).collect(toList());
            case THIRD_PARTY:
                return processRepository.findByCommonExternalProcessResponsible(code).stream().map(Process::getInstanceIdentification).collect(toList());
            default:
                return Collections.emptyList();
        }
    }

    private List<UsedInInstancePurpose> findPolicies(ListName listName, String code) {
        switch (listName) {
            case PURPOSE:
                return policyRepository.findByPurposeCode(code).stream().map(Policy::getInstanceIdentification).collect(toList());
            case SUBJECT_CATEGORY:
                return policyRepository.findBySubjectCategory(code).stream().map(Policy::getInstanceIdentification).collect(toList());
            case GDPR_ARTICLE:
                return policyRepository.findByGDPRArticle(code).stream().map(Policy::getInstanceIdentification).collect(toList());
            case NATIONAL_LAW:
                return policyRepository.findByNationalLaw(code).stream().map(Policy::getInstanceIdentification).collect(toList());
            default:
                return Collections.emptyList();
        }
    }

    private List<UsedInInstance> findInformationTypes(ListName listName, String code) {
        switch (listName) {
            case SENSITIVITY:
                return informationTypeRepository.findBySensitivity(code).stream().map(InformationType::getInstanceIdentification).collect(toList());
            case SYSTEM:
                return informationTypeRepository.findByNavMaster(code).stream().map(InformationType::getInstanceIdentification).collect(toList());
            case CATEGORY:
                return informationTypeRepository.findByCategory(code).stream().map(InformationType::getInstanceIdentification).collect(toList());
            case THIRD_PARTY:
                return informationTypeRepository.findBySource(code).stream().map(InformationType::getInstanceIdentification).collect(toList());
            default:
                return Collections.emptyList();
        }
    }

    private List<UsedInInstance> findDisclosures(ListName listName, String code) {
        switch (listName) {
            case GDPR_ARTICLE:
                return disclosureRepository.findByGDPRArticle(code).stream().map(Disclosure::getInstanceIdentification).collect(toList());
            case NATIONAL_LAW:
                return disclosureRepository.findByNationalLaw(code).stream().map(Disclosure::getInstanceIdentification).collect(toList());
            case THIRD_PARTY:
                return disclosureRepository.findByRecipient(code).stream().map(Disclosure::getInstanceIdentification).collect(toList());
            default:
                return Collections.emptyList();
        }
    }

    private List<UsedInInstance> findDocuments(ListName listName, String code) {
        if (listName == ListName.SUBJECT_CATEGORY) {
            return documentRepository.findBySubjectCategory(code).stream().map(Document::getInstanceIdentification).collect(toList());
        }
        return Collections.emptyList();
    }

    private List<InformationType> getInformationTypes(CodeUsageResponse usage) {
        return informationTypeRepository.findAllById(convert(usage.getInformationTypes(), UsedInInstance::getIdAsUUID));
    }

    private List<Policy> getPolicies(CodeUsageResponse usage) {
        return policyRepository.findAllById(convert(usage.getPolicies(), UsedInInstancePurpose::getIdAsUUID));
    }

    private List<Process> getProcesses(CodeUsageResponse usage) {
        return processRepository.findAllById(convert(usage.getProcesses(), UsedInInstancePurpose::getIdAsUUID));
    }

    private List<Disclosure> getDisclosures(CodeUsageResponse usage) {
        return disclosureRepository.findAllById(convert(usage.getDisclosures(), UsedInInstance::getIdAsUUID));
    }

    private List<Document> getDocuments(CodeUsageResponse usage) {
        return documentRepository.findAllById(convert(usage.getDocuments(), UsedInInstance::getIdAsUUID));
    }


}
