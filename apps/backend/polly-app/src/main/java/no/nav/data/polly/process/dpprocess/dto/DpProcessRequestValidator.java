package no.nav.data.polly.process.dpprocess.dto;

import lombok.RequiredArgsConstructor;
import no.nav.data.common.utils.StreamUtils;
import no.nav.data.common.validator.RequestElement;
import no.nav.data.common.validator.RequestValidator;
import no.nav.data.common.validator.ValidationError;
import no.nav.data.polly.process.dpprocess.domain.DpProcess;
import no.nav.data.polly.process.dpprocess.domain.repo.DpProcessRepository;
import no.nav.data.polly.teams.TeamService;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static java.lang.String.format;

@Component
@RequiredArgsConstructor
public class DpProcessRequestValidator extends RequestValidator<DpProcessRequest> {

    private final DpProcessRepository repository;
    private final TeamService teamService;

    public void validateRequest(DpProcessRequest request, boolean update) {
        initialize(List.of(request), update);

        var validationErrors = StreamUtils.applyAll(request,
                RequestElement::validateFields,
                this::validateProcessRepositoryValues
        );

        ifErrorsThrowValidationException(validationErrors);
    }

    private List<ValidationError> validateProcessRepositoryValues(DpProcessRequest request) {
        var validations = new ArrayList<ValidationError>();
        if (request.isUpdate()) {
            var repoValue = Optional.ofNullable(request.getIdAsUUID()).flatMap(repository::findById);
            validations.addAll(validateRepositoryValues(request, repoValue.isPresent()));
            repoValue.ifPresent(existing -> validateTeams(request, existing.getData().getAffiliation().getProductTeams(), validations));
        } else {
            validations.addAll(validateRepositoryValues(request, false));
            validateTeams(request, List.of(), validations);
        }
        Optional<DpProcess> byName = repository.findByName(request.getName()).filter(p -> !p.getId().equals(request.getIdAsUUID()));
        if (byName.isPresent()) {
            validations.add(new ValidationError(request.getReference(), "nameAndPurposeExists",
                    format("DpProcess with name %s already exists", request.getName())));
        }
        return validations;
    }

    private void validateTeams(DpProcessRequest dpRequest, List<String> existingTeams, ArrayList<ValidationError> validations) {
        var request = dpRequest.getAffiliation();
        if (!request.getProductTeams().isEmpty() && !existingTeams.equals(request.getProductTeams())) {
            request.getProductTeams().forEach(t -> {
                if (!teamService.teamExists(t)) {
                    validations.add(new ValidationError(request.getReference(), "invalidProductTeam", "Product team " + t + " does not exist"));
                }
            });
        }
    }
}
