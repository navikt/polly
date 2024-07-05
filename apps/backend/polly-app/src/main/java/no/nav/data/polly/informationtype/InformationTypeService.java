package no.nav.data.polly.informationtype;

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
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.domain.InformationTypeData;
import no.nav.data.polly.informationtype.dto.InformationTypeRequest;
import no.nav.data.polly.policy.domain.PolicyRepository;
import no.nav.data.polly.teams.TeamService;
import no.nav.data.polly.term.TermService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

import static java.util.stream.Collectors.toList;
import static no.nav.data.common.utils.StreamUtils.convert;
import static no.nav.data.common.utils.StreamUtils.nullToEmptyList;

@Slf4j
@Service
@Transactional
public class InformationTypeService extends RequestValidator<InformationTypeRequest> {

    // TODO: Denne klassen skal ikke subklasse RequestValidator. Flytt dette ut til en egen komponent (XxxRequestValidator).

    private final InformationTypeRepository repository;
    private final PolicyRepository policyRepository;
    private final DocumentRepository documentRepository;
    private final DisclosureRepository disclosureRepository;
    private final TermService termService;
    private final AlertService alertService;
    private final TeamService teamService;

    public InformationTypeService(InformationTypeRepository repository, PolicyRepository policyRepository,
            DocumentRepository documentRepository, DisclosureRepository disclosureRepository, TermService termService,
            AlertService alertService, TeamService teamService) {
        this.repository = repository;
        this.policyRepository = policyRepository;
        this.documentRepository = documentRepository;
        this.disclosureRepository = disclosureRepository;
        this.termService = termService;
        this.alertService = alertService;
        this.teamService = teamService;
    }

    public InformationType save(InformationTypeRequest request) {
        return saveAll(List.of(request)).get(0);
    }

    public InformationType update(InformationTypeRequest request) {
        return updateAll(List.of(request)).get(0);
    }

    public List<InformationType> saveAll(List<InformationTypeRequest> requests) {
        List<InformationType> informationTypes = requests.stream().map(this::convertNew).collect(toList());
        List<InformationType> all = repository.saveAll(informationTypes);
        all.forEach(it -> alertService.calculateEventsForInforamtionType(it.getId()));
        return all;
    }

    public List<InformationType> updateAll(List<InformationTypeRequest> requests) {
        List<UUID> ids = convert(requests, InformationTypeRequest::getIdAsUUID);
        List<InformationType> informationTypes = repository.findAllById(ids);

        requests.forEach(request -> find(informationTypes, request.getIdAsUUID()).ifPresent(informationType -> convertUpdate(request, informationType)));
        List<InformationType> all = repository.saveAll(informationTypes);
        all.forEach(it -> alertService.calculateEventsForInforamtionType(it.getId()));
        return all;
    }

    public InformationType delete(UUID id) {
        InformationType infoType = repository.findById(id).orElseThrow(() -> new NotFoundException("Fant ikke id=" + id));
        if (!infoType.getPolicies().isEmpty()) {
            throw new ValidationException(String.format("InformationType %s is used by %d policie(s)", id, infoType.getPolicies().size()));
        }
        List<Document> documents = documentRepository.findByInformationTypeId(id);
        if (!documents.isEmpty()) {
            throw new ValidationException(String.format("InformationType %s is used by %d document(s)", id, documents.size()));
        }
        List<Disclosure> disclosures = disclosureRepository.findByInformationTypeId(id);
        if (!disclosures.isEmpty()) {
            throw new ValidationException(String.format("InformationType %s is used by %d disclosure(s)", id, disclosures.size()));
        }

        log.info("InformationType with id={} deleted", id);
        repository.delete(infoType);
        alertService.deleteEventsForInformationType(infoType.getId());
        return infoType;
    }

    private Optional<InformationType> find(List<InformationType> informationTypes, UUID id) {
        return informationTypes.stream().filter(informationType -> id.equals(informationType.getId())).findFirst();
    }

    private InformationType convertNew(InformationTypeRequest request) {
        return new InformationType().convertNewFromRequest(request);
    }

    private void convertUpdate(InformationTypeRequest request, InformationType informationType) {
        if (!request.getName().equals(informationType.getData().getName())) {
            policyRepository.updateInformationTypeName(request.getIdAsUUID(), request.getName());
        }
        informationType.convertUpdateFromRequest(request);
    }

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
