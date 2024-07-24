package no.nav.data.polly.process.dto;

import lombok.RequiredArgsConstructor;
import no.nav.data.common.utils.StreamUtils;
import no.nav.data.common.validator.RequestElement;
import no.nav.data.common.validator.RequestValidator;
import no.nav.data.common.validator.ValidationError;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.repo.ProcessRepository;
import no.nav.data.polly.processor.domain.repo.ProcessorRepository;
import no.nav.data.polly.teams.ResourceService;
import no.nav.data.polly.teams.TeamService;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import static java.lang.String.format;
import static org.apache.commons.lang3.StringUtils.isNotBlank;

@Component
@RequiredArgsConstructor
public class ProcessRequestValidator extends RequestValidator<ProcessRequest> {
    
    // MERK: Ingen testdekning

    private final ProcessRepository processRepository;
    private final ProcessorRepository processorRepository;
    private final TeamService teamService;
    private final ResourceService resourceService;


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

}
