package no.nav.data.polly.process;

import lombok.RequiredArgsConstructor;
import no.nav.data.common.exceptions.ValidationException;
import no.nav.data.common.mail.EmailService;
import no.nav.data.common.mail.MailTask;
import no.nav.data.common.template.TemplateService;
import no.nav.data.common.utils.StreamUtils;
import no.nav.data.common.validator.RequestElement;
import no.nav.data.common.validator.RequestValidator;
import no.nav.data.common.validator.ValidationError;
import no.nav.data.polly.alert.AlertService;
import no.nav.data.polly.codelist.codeusage.CodeUsageService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodeUsageResponse;
import no.nav.data.polly.disclosure.domain.Disclosure;
import no.nav.data.polly.disclosure.domain.DisclosureRepository;
import no.nav.data.polly.informationtype.InformationTypeRepository;
import no.nav.data.polly.policy.domain.PolicyRepository;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessStatus;
import no.nav.data.polly.process.domain.repo.ProcessRepository;
import no.nav.data.polly.process.dto.ProcessRequest;
import no.nav.data.polly.process.dto.ProcessShortResponse;
import no.nav.data.polly.processor.domain.repo.ProcessorRepository;
import no.nav.data.polly.teams.ResourceService;
import no.nav.data.polly.teams.TeamService;
import no.nav.data.polly.teams.dto.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Consumer;
import java.util.stream.Collectors;

import static java.lang.String.format;
import static java.util.stream.Collectors.toList;
import static no.nav.data.common.security.SecurityUtils.changeStampToIdent;
import static no.nav.data.common.utils.StreamUtils.convert;
import static no.nav.data.common.utils.StreamUtils.filter;
import static no.nav.data.common.utils.StreamUtils.union;
import static org.apache.commons.lang3.StringUtils.isNotBlank;

@Service
@RequiredArgsConstructor
public class ProcessService extends RequestValidator<ProcessRequest> {

    private final ProcessRepository processRepository;
    private final ProcessorRepository processorRepository;
    private final DisclosureRepository disclosureRepository;
    private final TeamService teamService;
    private final ResourceService resourceService;
    private final AlertService alertService;
    private final CodeUsageService codeUsageService;
    private final TemplateService templateService;
    private final EmailService emailService;
    private final PolicyRepository policyRepository;



    @Transactional
    public Process save(Process process) {
        var saved = processRepository.save(process);
        alertService.calculateEventsForProcess(saved.getId());
        return saved;
    }

    @Transactional
    public Process update(ProcessRequest request) {
        var process = processRepository.findById(request.getIdAsUUID()).orElseThrow();
        var oldPurposes = process.getData().getPurposes();
        process.convertFromRequest(request);
        if (!oldPurposes.equals(request.getPurposes())) {
            process.getPolicies().forEach(p -> p.getData().setPurposes(List.copyOf(request.getPurposes())));
        }
        return save(process);
    }

    @Transactional
    public void deleteById(UUID id) {
        List<Disclosure> disclosures = disclosureRepository.findByProcessId(id);
        if (!disclosures.isEmpty()) {
            throw new ValidationException(String.format("Process %s is used by %d disclosure(s)", id, disclosures.size()));
        }

        processRepository.deleteById(id);
        alertService.deleteEventsForProcess(id);
    }

    public List<Process> getAllProcessesForGdprAndLaw(String gdprArticle, String nationalLaw) {
        var gdpr = Optional.ofNullable(gdprArticle).map(a -> codeUsageService.findCodeUsage(ListName.GDPR_ARTICLE, a)).orElse(new CodeUsageResponse());
        var law = Optional.ofNullable(nationalLaw).map(a -> codeUsageService.findCodeUsage(ListName.NATIONAL_LAW, a)).orElse(new CodeUsageResponse());
        return fetchAllProcessesAndFilter(gdpr, law);
    }

    private List<Process> fetchAllProcessesAndFilter(CodeUsageResponse gdpr, CodeUsageResponse law) {
        var gdprIds = getAllProcessIds(gdpr);
        var lawIds = getAllProcessIds(law);

        var all = union(gdprIds, lawIds);
        if (gdpr.getCode() != null) {
            all = filter(all, gdprIds::contains);
        }
        if (law.getCode() != null) {
            all = filter(all, lawIds::contains);
        }
        return processRepository.findAllById(all);
    }

    public List<Process> fetchAllProcessesByInformationTypeSensitivity(String sensitivity) {
        CodeUsageResponse codeUsageResponse = codeUsageService.findCodeUsage(ListName.SENSITIVITY,sensitivity);
        List<Process> processes = new ArrayList<>();
        codeUsageResponse.getInformationTypes().forEach(it->{
            var policies = policyRepository.findByInformationTypeId(it.getIdAsUUID());
            policies.forEach(policy -> {
                processes.add(policy.getProcess());
            });
        });
        return processes.stream().distinct().collect(Collectors.toList());
    }

    private List<UUID> getAllProcessIds(CodeUsageResponse usage) {
        return union(
                convert(usage.getProcesses(), ProcessShortResponse::getId),
                convert(usage.getPolicies(), p -> UUID.fromString(p.getProcessId()))
        ).stream().distinct().collect(toList());
    }

    public void validateRequest(ProcessRequest request, boolean update) {
        initialize(List.of(request), update);
        var validationErrors = StreamUtils.applyAll(request,
                RequestElement::validateFields,
                this::validateProcessRepositoryValues
        );

        ifErrorsThrowValidationException(validationErrors);
    }

    private List<ValidationError> validateProcessRepositoryValues(ProcessRequest request) {
        var validations = new ArrayList<ValidationError>();
        if (request.isUpdate()) {
            var repoValue = Optional.ofNullable(request.getIdAsUUID()).flatMap(processRepository::findById);
            validations.addAll(validateRepositoryValues(request, repoValue.isPresent()));

            if (repoValue.isPresent()) {
                Process process = repoValue.get();
                validateTeams(request, process.getData().getAffiliation().getProductTeams(), validations);
                String existingRiskOwner = process.getData().getDpia() == null ? null : process.getData().getDpia().getRiskOwner();
                validateRiskOwner(request, existingRiskOwner, validations);
            }
        } else {
            validateTeams(request, List.of(), validations);
            validateRiskOwner(request, null, validations);
            validations.addAll(validateRepositoryValues(request, false));
            validations.addAll(validateObjects(request.getDataProcessing().getProcessors(), processorRepository::findAllById, request.getReference(), "processor"));
        }
        Optional<Process> byNameAndPurpose = processRepository.findByNameAndPurposes(request.getName(), request.getPurposes())
                .filter(p -> !p.getId().equals(request.getIdAsUUID()));
        if (byNameAndPurpose.isPresent()) {
            validations.add(new ValidationError(request.getReference(), "nameAndPurposeExists",
                    format("Process with name %s and Purpose %s already exists", request.getName(), request.getPurposes())));
        }
        return validations;
    }

    private void validateTeams(ProcessRequest pRequest, List<String> existingTeams, ArrayList<ValidationError> validations) {
        var request = pRequest.getAffiliation();
        if (!request.getProductTeams().isEmpty() && !existingTeams.equals(request.getProductTeams())) {
            request.getProductTeams().forEach(t -> {
                if (!teamService.teamExists(t)) {
                    validations.add(new ValidationError(request.getReference(), "invalidProductTeam", "Product team " + t + " does not exist"));
                }
            });
        }
    }

    private void validateRiskOwner(ProcessRequest request, String existingRiskOwner, List<ValidationError> validations) {
        String riskOwner = request.getDpia().getRiskOwner();
        if (isNotBlank(riskOwner) && !Objects.equals(riskOwner, existingRiskOwner) && resourceService.getResource(riskOwner).isEmpty()) {
            validations.add(new ValidationError(request.getReference(), "invalidResource", "Resource " + riskOwner + " does not exist"));
        }
    }

    @Transactional
    public void requireRevision(List<UUID> processIds, String revisionText, boolean completedOnly) {
        var processes = processRepository.findAllById(processIds)
                .stream()
                .filter(p -> !completedOnly || p.getData().getStatus() == ProcessStatus.COMPLETED)
                .filter(p -> p.getData().getStatus() != ProcessStatus.NEEDS_REVISION || !revisionText.equals(p.getData().getRevisionText()))
                .collect(toList());

        if (processes.isEmpty()) {
            return;
        }

        processes.forEach(p -> {
            p.getData().setStatus(ProcessStatus.NEEDS_REVISION);
            p.getData().setRevisionText(revisionText);
        });

        String lastModifiedBy = processes.get(0).getLastModifiedBy();
        changeStampToIdent(lastModifiedBy)
                .flatMap(resourceService::getResource)
                .map(Resource::getEmail)
                .ifPresent(email -> emailService.scheduleMail(
                        MailTask.builder()
                                .to(email)
                                .subject("Behandling(er) med behov for revidering")
                                .body(templateService.needsRevision(processes))
                                .build()
                ));
    }

    public void runPaged(Consumer<Process> consumer, int pageSize) {
        PageRequest pageable = PageRequest.of(0, pageSize, Sort.by("id"));
        Page<Process> page = null;
        do {
            page = processRepository.findAll(
                    Optional.ofNullable(page)
                            .map(Page::nextPageable)
                            .orElse(pageable)
            );
            page.get().forEach(consumer);
        } while (page.hasNext());
    }

}
