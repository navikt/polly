package no.nav.data.polly.process;

import no.nav.data.polly.common.utils.StreamUtils;
import no.nav.data.polly.common.validator.RequestElement;
import no.nav.data.polly.common.validator.RequestValidator;
import no.nav.data.polly.common.validator.ValidationError;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessDistribution;
import no.nav.data.polly.process.domain.ProcessDistributionRepository;
import no.nav.data.polly.process.domain.ProcessRepository;
import no.nav.data.polly.process.dto.ProcessRequest;
import no.nav.data.polly.teams.TeamService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import static java.lang.String.format;
import static org.apache.commons.lang3.StringUtils.isNotBlank;

@Service
public class ProcessService extends RequestValidator<ProcessRequest> {

    private final ProcessDistributionRepository distributionRepository;
    private final ProcessRepository processRepository;
    private final TeamService teamService;

    public ProcessService(ProcessDistributionRepository distributionRepository,
            ProcessRepository processRepository, TeamService teamService) {
        this.distributionRepository = distributionRepository;
        this.processRepository = processRepository;
        this.teamService = teamService;
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
                validateTeam(request, process.getData().getProductTeam(), validations);
                if (!Objects.equals(process.getPurposeCode(), request.getPurposeCode())) {
                    validations.add(new ValidationError(request.getReference(), "purposeChanged",
                            format("Cannot change purpose from %s to %s", process.getPurposeCode(), request.getPurposeCode())));
                }
            }
        } else {
            validateTeam(request, null, validations);
            validations.addAll(validateRepositoryValues(request, false));
            if (processRepository.findByNameAndPurposeCode(request.getName(), request.getPurposeCode()).isPresent()) {
                validations.add(new ValidationError(request.getReference(), "nameAndPurposeExists",
                        format("Process with name %s and Purpose %s already exists", request.getName(), request.getPurposeCode())));
            }
        }
        return validations;
    }

    private void validateTeam(ProcessRequest request, String existingTeam, ArrayList<ValidationError> validations) {
        if (isNotBlank(request.getProductTeam()) && !Objects.equals(request.getProductTeam(), existingTeam) && !teamService.teamExists(request.getProductTeam())) {
            validations.add(new ValidationError(request.getReference(), "invalidProductTeam", "Product team " + request.getProductTeam() + " does not exist"));
        }
    }

}
