package no.nav.data.polly.informationtype.dto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.exceptions.NotFoundException;
import no.nav.data.common.exceptions.ValidationException;
import no.nav.data.common.utils.StreamUtils;
import no.nav.data.common.validator.RequestElement;
import no.nav.data.common.validator.RequestValidator;
import no.nav.data.common.validator.ValidationError;
import no.nav.data.polly.alert.AlertService;
import no.nav.data.polly.disclosure.domain.Disclosure;
import no.nav.data.polly.disclosure.domain.DisclosureRepository;
import no.nav.data.polly.document.domain.Document;
import no.nav.data.polly.document.domain.DocumentRepository;
import no.nav.data.polly.informationtype.InformationTypeRepository;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.domain.InformationTypeData;
import no.nav.data.polly.policy.domain.PolicyRepository;
import no.nav.data.polly.teams.TeamService;
import no.nav.data.polly.term.TermService;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

import static java.util.stream.Collectors.toList;
import static no.nav.data.common.utils.StreamUtils.convert;
import static no.nav.data.common.utils.StreamUtils.nullToEmptyList;

@Component
@RequiredArgsConstructor
public class InformationTypeRequestValidator extends RequestValidator<InformationTypeRequest> {

    private final InformationTypeRepository repository;
    private final TermService termService;
    private final TeamService teamService;

    public void validateRequest(List<InformationTypeRequest> requests, boolean isUpdate) {
        requests = nullToEmptyList(requests);
        InformationTypeRequest.initiateRequests(requests, isUpdate);
        List<ValidationError> validationErrors = validateRequestsAndReturnErrors(requests);

        ifErrorsThrowValidationException(validationErrors);
    }

    public List<ValidationError> validateRequestsAndReturnErrors(List<InformationTypeRequest> requests) {
        requests = nullToEmptyList(requests);

        var validationErrors = StreamUtils.applyAll(requests,
                RequestElement::validateFields,
                this::validateInformationTypeRepositoryValues
        );
        validationErrors.addAll(validateNoDuplicates(requests));

        return validationErrors;
    }

    private void validateTerm(InformationTypeRequest request, String existingTermId, List<ValidationError> validationErrors) {
        if (request.getTerm() != null && !Objects.equals(request.getTerm(), existingTermId) && termService.getTerm(request.getTerm()).isEmpty()) {
            validationErrors.add(new ValidationError(request.getReference(), "termDoesNotExist", String.format("The Term %s doesnt exist", request.getTerm())));
        }
    }

    private List<ValidationError> validateInformationTypeRepositoryValues(InformationTypeRequest request) {
        var existingInformationType = Optional.ofNullable(request.getIdAsUUID()).flatMap(repository::findById);
        List<ValidationError> validations = new ArrayList<>(validateRepositoryValues(request, existingInformationType.isPresent()));

        if (!request.isUpdate()) {
            validateTeams(request, List.of(), validations);
            if (repository.findByName(request.getName()).isPresent()) {
                validations.add(new ValidationError(request.getReference(), "nameAlreadyExists"
                        , String.format("The InformationType %s already exists", request.getIdentifyingFields())));
            }
        }

        if (request.isUpdate() && existingInformationType.isPresent()) {
            InformationTypeData existingInformationTypeData = existingInformationType.get().getData();
            validateTeams(request, nullToEmptyList(existingInformationTypeData.getProductTeams()), validations);

            if (!existingInformationTypeData.getName().equals(request.getName()) && repository.findByName(request.getName()).isPresent()) {
                validations.add(new ValidationError(request.getReference(), "nameAlreadyExistsNameChange"
                        , String.format("Cannot change name, InformationType %s already exists", request.getIdentifyingFields())));
            }
        }
        validateTerm(request, existingInformationType.map(InformationType::getTermId).orElse(null), validations);
        return validations;
    }

    private void validateTeams(InformationTypeRequest request, List<String> existingTeams, List<ValidationError> validations) {
        if (!request.getProductTeams().isEmpty() && !existingTeams.equals(request.getProductTeams())) {
            request.getProductTeams().forEach(t -> {
                if (!teamService.teamExists(t)) {
                    validations.add(new ValidationError(request.getReference(), "invalidProductTeam", "Product team " + t + " does not exist"));
                }
            });
        }
    }
}
