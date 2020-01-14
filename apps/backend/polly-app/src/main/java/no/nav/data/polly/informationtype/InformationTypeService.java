package no.nav.data.polly.informationtype;

import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.common.exceptions.PollyNotFoundException;
import no.nav.data.polly.common.utils.StreamUtils;
import no.nav.data.polly.common.validator.RequestElement;
import no.nav.data.polly.common.validator.RequestValidator;
import no.nav.data.polly.common.validator.ValidationError;
import no.nav.data.polly.sync.domain.SyncStatus;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.domain.InformationTypeData;
import no.nav.data.polly.informationtype.dto.InformationTypeRequest;
import no.nav.data.polly.policy.domain.PolicyRepository;
import no.nav.data.polly.term.TermService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

import static java.util.stream.Collectors.toList;
import static no.nav.data.polly.common.utils.StreamUtils.convert;
import static no.nav.data.polly.common.utils.StreamUtils.nullToEmptyList;

@Slf4j
@Service
@Transactional
public class InformationTypeService extends RequestValidator<InformationTypeRequest> {

    private final InformationTypeRepository repository;
    private final PolicyRepository policyRepository;
    private final TermService termService;

    public InformationTypeService(InformationTypeRepository repository, PolicyRepository policyRepository, TermService termService) {
        this.repository = repository;
        this.policyRepository = policyRepository;
        this.termService = termService;
    }

    public InformationType save(InformationTypeRequest request) {
        return saveAll(List.of(request)).get(0);
    }

    public InformationType update(InformationTypeRequest request) {
        return updateAll(List.of(request)).get(0);
    }

    public List<InformationType> saveAll(List<InformationTypeRequest> requests) {
        List<InformationType> informationTypes = requests.stream().map(this::convertNew).collect(toList());
        return repository.saveAll(informationTypes);
    }

    public List<InformationType> updateAll(List<InformationTypeRequest> requests) {
        List<UUID> ids = convert(requests, InformationTypeRequest::getIdAsUUID);
        List<InformationType> informationTypes = repository.findAllById(ids);

        requests.forEach(request -> find(informationTypes, request.getIdAsUUID()).ifPresent(informationType -> convertUpdate(request, informationType)));
        return repository.saveAll(informationTypes);
    }

    public InformationType delete(UUID id) {
        InformationType infoType = repository.findById(id).orElseThrow(() -> new PollyNotFoundException("Fant ikke id=" + id));
        infoType.setSyncStatus(SyncStatus.TO_BE_DELETED);
        long deletes = policyRepository.deleteByInformationTypeId(id);
        log.debug("Deleted {} policies", deletes);
        log.info("InformationType with id={} has been set to be deleted during the next scheduled task", id);
        infoType.getData().setName(infoType.getData().getName() + " (To be deleted)");
        return infoType;
    }

    public void deleteAll(Collection<UUID> ids) {
        ids.forEach(this::delete);
    }

    public void sync(List<UUID> ids) {
        int informationTypesUpdated = repository.setSyncForInformationTypeIds(ids);
        log.info("marked {} informationTypes for sync", informationTypesUpdated);
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
        List<ValidationError> validationErrors = new ArrayList<>(validateRepositoryValues(request, existingInformationType.isPresent()));

        if (!request.isUpdate() && repository.findByName(request.getName()).isPresent()) {
            validationErrors.add(new ValidationError(request.getReference(), "nameAlreadyExists"
                    , String.format("The InformationType %s already exists", request.getIdentifyingFields())));
        }

        if (request.isUpdate() && existingInformationType.isPresent()) {
            InformationTypeData existingInformationTypeData = existingInformationType.get().getData();

            if (!existingInformationTypeData.getName().equals(request.getName()) && repository.findByName(request.getName()).isPresent()) {
                validationErrors.add(new ValidationError(request.getReference(), "nameAlreadyExistsNameChange"
                        , String.format("Cannot change name, InformationType %s already exists", request.getIdentifyingFields())));
            }
        }
        validateTerm(request, existingInformationType.map(InformationType::getTermId).orElse(null), validationErrors);
        return validationErrors;
    }
}
