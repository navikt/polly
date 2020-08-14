package no.nav.data.polly.process;

import no.nav.data.common.utils.StreamUtils;
import no.nav.data.common.validator.RequestElement;
import no.nav.data.common.validator.RequestValidator;
import no.nav.data.common.validator.ValidationError;
import no.nav.data.polly.alert.AlertService;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessDistribution;
import no.nav.data.polly.process.domain.ProcessDistributionRepository;
import no.nav.data.polly.process.domain.ProcessRepository;
import no.nav.data.polly.process.dto.ProcessRequest;
import no.nav.data.polly.teams.ResourceService;
import no.nav.data.polly.teams.TeamService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

import static java.lang.String.format;
import static org.apache.commons.lang3.StringUtils.isNotBlank;

@Service
public class ProcessService extends RequestValidator<ProcessRequest> {

    private final ProcessDistributionRepository distributionRepository;
    private final ProcessRepository processRepository;
    private final TeamService teamService;
    private final ResourceService resourceService;
    private final AlertService alertService;

    public ProcessService(ProcessDistributionRepository distributionRepository,
            ProcessRepository processRepository,
            TeamService teamService,
            ResourceService resourceService,
            AlertService alertService) {
        this.distributionRepository = distributionRepository;
        this.processRepository = processRepository;
        this.teamService = teamService;
        this.resourceService = resourceService;
        this.alertService = alertService;
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
        var oldPurpose = process.getPurposeCode();
        process.convertFromRequest(request);
        if (!oldPurpose.equals(request.getPurposeCode())) {
            process.getPolicies().forEach(p -> p.setPurposeCode(request.getPurposeCode()));
        }
//        alertService.deleteEventsForProcess(process.getId());
        return save(process);
    }

    @Transactional
    public void deleteById(UUID id) {
        processRepository.deleteById(id);
        alertService.deleteEventsForProcess(id);
    }

    public void scheduleDistributeForProcess(Process process) {
        distributionRepository.save(ProcessDistribution.newForProcess(process));
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
                validateTeams(request, process.getData().getProductTeams(), validations);
                String existingRiskOwner = process.getData().getDpia() == null ? null : process.getData().getDpia().getRiskOwner();
                validateRiskOwner(request, existingRiskOwner, validations);
            }
        } else {
            validateTeams(request, List.of(), validations);
            validateRiskOwner(request, null, validations);
            validations.addAll(validateRepositoryValues(request, false));
        }
        Optional<Process> byNameAndPurpose = processRepository.findByNameAndPurposeCode(request.getName(), request.getPurposeCode())
                .filter(p -> !p.getId().equals(request.getIdAsUUID()));
        if (byNameAndPurpose.isPresent()) {
            validations.add(new ValidationError(request.getReference(), "nameAndPurposeExists",
                    format("Process with name %s and Purpose %s already exists", request.getName(), request.getPurposeCode())));
        }
        return validations;
    }

    private void validateTeams(ProcessRequest request, List<String> existingTeams, ArrayList<ValidationError> validations) {
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
