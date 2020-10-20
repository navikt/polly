package no.nav.data.polly.process;

import no.nav.data.common.utils.StreamUtils;
import no.nav.data.common.validator.RequestElement;
import no.nav.data.common.validator.RequestValidator;
import no.nav.data.common.validator.ValidationError;
import no.nav.data.polly.alert.AlertService;
import no.nav.data.polly.codelist.codeusage.CodeUsageService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodeUsageResponse;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.repo.ProcessRepository;
import no.nav.data.polly.process.dto.ProcessRequest;
import no.nav.data.polly.process.dto.ProcessShortResponse;
import no.nav.data.polly.teams.ResourceService;
import no.nav.data.polly.teams.TeamService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import static java.lang.String.format;
import static no.nav.data.common.utils.StreamUtils.convert;
import static no.nav.data.common.utils.StreamUtils.filter;
import static no.nav.data.common.utils.StreamUtils.union;
import static org.apache.commons.lang3.StringUtils.isNotBlank;

@Service
public class ProcessService extends RequestValidator<ProcessRequest> {

    private final ProcessRepository processRepository;
    private final TeamService teamService;
    private final ResourceService resourceService;
    private final AlertService alertService;
    private final CodeUsageService codeUsageService;

    public ProcessService(
            ProcessRepository processRepository,
            TeamService teamService,
            ResourceService resourceService,
            AlertService alertService, CodeUsageService codeUsageService) {
        this.processRepository = processRepository;
        this.teamService = teamService;
        this.resourceService = resourceService;
        this.alertService = alertService;
        this.codeUsageService = codeUsageService;
    }

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

    private List<UUID> getAllProcessIds(CodeUsageResponse usage) {
        return union(
                convert(usage.getProcesses(), ProcessShortResponse::getId),
                convert(usage.getPolicies(), p -> UUID.fromString(p.getProcessId()))
        ).stream().distinct().collect(Collectors.toList());
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
}
