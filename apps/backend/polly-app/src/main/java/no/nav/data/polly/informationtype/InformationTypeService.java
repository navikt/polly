package no.nav.data.polly.informationtype;

import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.common.exceptions.ValidationException;
import no.nav.data.polly.common.validator.RequestValidator;
import no.nav.data.polly.common.validator.ValidationError;
import no.nav.data.polly.elasticsearch.domain.ElasticsearchStatus;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.domain.InformationTypeData;
import no.nav.data.polly.informationtype.domain.InformationTypeMaster;
import no.nav.data.polly.informationtype.dto.InformationTypeRequest;
import no.nav.data.polly.policy.domain.PolicyRepository;
import no.nav.data.polly.term.domain.Term;
import no.nav.data.polly.term.domain.TermRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.transaction.Transactional;

import static java.util.stream.Collectors.toList;
import static no.nav.data.polly.common.utils.StreamUtils.nullToEmptyList;

@Slf4j
@Service
public class InformationTypeService extends RequestValidator<InformationTypeRequest> {

    private final InformationTypeRepository repository;
    private final TermRepository termRepository;
    private final PolicyRepository policyRepository;

    public InformationTypeService(InformationTypeRepository repository, TermRepository termRepository, PolicyRepository policyRepository) {
        this.repository = repository;
        this.termRepository = termRepository;
        this.policyRepository = policyRepository;
    }

    @Transactional
    public InformationType save(InformationTypeRequest request, InformationTypeMaster master) {
        return repository.save(convertNew(request, master));
    }

    @Transactional
    public List<InformationType> saveAll(List<InformationTypeRequest> requests, InformationTypeMaster master) {
        List<InformationType> informationTypes = requests.stream().map(request -> convertNew(request, master)).collect(toList());
        return repository.saveAll(informationTypes);
    }

    @Transactional
    public InformationType update(InformationTypeRequest request) {
        return updateAll(Collections.singletonList(request)).get(0);
    }

    @Transactional
    public List<InformationType> updateAll(List<InformationTypeRequest> requests) {
        List<InformationType> informationTypes = repository.findAllByName(requests.stream()
                .map(InformationTypeRequest::getName)
                .collect(Collectors.toList()));

        informationTypes.forEach(
                ds -> {
                    Optional<InformationTypeRequest> request = requests.stream()
                            .filter(r -> r.getName().equals(ds.getData().getName()))
                            .findFirst();
                    request.ifPresent(informationTypeRequest -> convertUpdate(informationTypeRequest, ds));
                });

        return repository.saveAll(informationTypes);
    }

    @Transactional
    public InformationType delete(InformationTypeRequest request) {
        Optional<InformationType> fromRepository = repository.findByName(request.getName());
        if (fromRepository.isEmpty()) {
            log.warn("Cannot find InformationType with title={} for deletion", request.getName());
            return null;
        }
        InformationType informationType = fromRepository.get();
        request.assertMaster(informationType);
        informationType.setElasticsearchStatus(ElasticsearchStatus.TO_BE_DELETED);
        return informationType;
    }

    @Transactional
    public void deleteAll(Collection<InformationTypeRequest> requests) {
        requests.forEach(this::delete);
    }

    private InformationType convertNew(InformationTypeRequest request, InformationTypeMaster master) {
        InformationType informationType = new InformationType().convertNewFromRequest(request, master);
        attachDependencies(informationType, request);
        return informationType;
    }

    private InformationType convertUpdate(InformationTypeRequest request, InformationType informationType) {
        request.assertMaster(informationType);
        informationType.convertUpdateFromRequest(request);
        attachDependencies(informationType, request);
        return informationType;
    }

    private void attachDependencies(InformationType informationType, InformationTypeRequest request) {
        Term term = termRepository.findByName(request.getTerm())
                .orElseGet(() -> termRepository.save(Term.builder().generateId().name(request.getTerm()).description("autogenerert").build()));

        term.addInformationType(informationType);
    }

    public void validateRequest(List<InformationTypeRequest> requests) {
        List<ValidationError> validationErrors = validateRequestsAndReturnErrors(requests);

        if (!validationErrors.isEmpty()) {
            log.error("The request was not accepted. The following errors occurred during validation: {}", validationErrors);
            throw new ValidationException(validationErrors, "The request was not accepted. The following errors occurred during validation: ");
        }
    }

    public List<ValidationError> validateRequestsAndReturnErrors(List<InformationTypeRequest> requests) {
        requests = nullToEmptyList(requests);
        if (requests.isEmpty()) {
            return Collections.emptyList();
        }
        if (requests.stream().anyMatch(r -> r.getInformationTypeMaster() == null)) {
            throw new IllegalStateException("missing InformationTypeMaster on request");
        }

        List<ValidationError> validationErrors = new ArrayList<>(validateNoDuplicates(requests));

        requests.forEach(request -> {
            validationErrors.addAll(request.validateFields());
            request.format();
            validationErrors.addAll(validateInformationTypeRepositoryValues(request));
        });
        return validationErrors;
    }

    private List<ValidationError> validateInformationTypeRepositoryValues(InformationTypeRequest request) {
        Optional<InformationType> existingInformationType = repository.findByName(request.getName());
        List<ValidationError> validationErrors = new ArrayList<>(validateRepositoryValues(request, existingInformationType.isPresent()));

        if (updatingExistingElement(request.isUpdate(), existingInformationType.isPresent())) {
            InformationTypeData existingInformationTypeData = existingInformationType.get().getData();

            if (existingInformationTypeData.getInformationTypeMaster() == null) {
                validationErrors.add(new ValidationError(request.getReference(), "missingMasterInExistingInformationType"
                        , String.format("The InformationType %s has not defined where it is mastered", request.getIdentifyingFields())));
            } else if (!correlatingMaster(existingInformationTypeData.getInformationTypeMaster(), request.getInformationTypeMaster())) {
                validationErrors.add(new ValidationError(request.getReference(), "nonCorrelatingMaster",
                        String.format("The InformationType %s is mastered in %s and therefore cannot be updated from %s",
                                request.getIdentifyingFields(), existingInformationTypeData.getInformationTypeMaster(), request.getInformationTypeMaster())));
            }
        }
        return validationErrors;
    }

    private boolean updatingExistingElement(boolean isUpdate, boolean existInRepository) {
        return isUpdate && existInRepository;
    }

    private boolean correlatingMaster(InformationTypeMaster existingMaster, InformationTypeMaster requestMaster) {
        return existingMaster.equals(requestMaster);
    }

    public void sync(List<UUID> ids) {
        int informationTypesUpdated = repository.setSyncForInformationTypeIds(ids);
        log.info("marked {} informationTypes for sync", informationTypesUpdated);
    }

}
