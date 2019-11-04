package no.nav.data.polly.informationtype;

import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.common.utils.StreamUtils;
import no.nav.data.polly.common.validator.RequestElement;
import no.nav.data.polly.common.validator.RequestValidator;
import no.nav.data.polly.common.validator.ValidationError;
import no.nav.data.polly.elasticsearch.domain.ElasticsearchStatus;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.domain.InformationTypeData;
import no.nav.data.polly.informationtype.domain.InformationTypeMaster;
import no.nav.data.polly.informationtype.dto.InformationTypeRequest;
import no.nav.data.polly.term.domain.Term;
import no.nav.data.polly.term.domain.TermRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import javax.transaction.Transactional;

import static java.util.stream.Collectors.toList;
import static no.nav.data.polly.common.utils.StreamUtils.convert;
import static no.nav.data.polly.common.utils.StreamUtils.nullToEmptyList;

@Slf4j
@Service
@Transactional
public class InformationTypeService extends RequestValidator<InformationTypeRequest> {

    private final InformationTypeRepository repository;
    private final TermRepository termRepository;

    public InformationTypeService(InformationTypeRepository repository, TermRepository termRepository) {
        this.repository = repository;
        this.termRepository = termRepository;
    }

    public InformationType save(InformationTypeRequest request, InformationTypeMaster master) {
        return saveAll(List.of(request), master).get(0);
    }

    public InformationType update(InformationTypeRequest request) {
        return updateAll(List.of(request)).get(0);
    }

    public List<InformationType> saveAll(List<InformationTypeRequest> requests, InformationTypeMaster master) {
        List<InformationType> informationTypes = requests.stream().map(request -> convertNew(request, master)).collect(toList());
        return repository.saveAll(informationTypes);
    }

    public List<InformationType> updateAll(List<InformationTypeRequest> requests) {
        List<String> names = convert(requests, InformationTypeRequest::getName);
        List<InformationType> informationTypes = repository.findAllByNameIn(names);

        requests.forEach(request -> find(informationTypes, request.getName()).ifPresent(informationType -> convertUpdate(request, informationType)));
        return repository.saveAll(informationTypes);
    }

    public InformationType delete(InformationTypeRequest request) {
        Optional<InformationType> optional = repository.findByName(request.getName());
        optional.ifPresent(request::assertMaster);
        optional.ifPresent(it -> it.setElasticsearchStatus(ElasticsearchStatus.TO_BE_DELETED));
        return optional.orElse(null);
    }

    public void deleteAll(Collection<InformationTypeRequest> requests) {
        requests.forEach(this::delete);
    }

    public void sync(List<UUID> ids) {
        int informationTypesUpdated = repository.setSyncForInformationTypeIds(ids);
        log.info("marked {} informationTypes for sync", informationTypesUpdated);
    }

    private Optional<InformationType> find(List<InformationType> informationTypes, String name) {
        return informationTypes.stream().filter(informationType -> name.equals(informationType.getData().getName())).findFirst();
    }

    private InformationType convertNew(InformationTypeRequest request, InformationTypeMaster master) {
        InformationType informationType = new InformationType().convertNewFromRequest(request, master);
        attachDependencies(informationType, request);
        return informationType;
    }

    private void convertUpdate(InformationTypeRequest request, InformationType informationType) {
        request.assertMaster(informationType);
        informationType.convertUpdateFromRequest(request);
        attachDependencies(informationType, request);
    }

    private void attachDependencies(InformationType informationType, InformationTypeRequest request) {
        if (request.getTerm() != null) {
            Term term = termRepository.findByName(request.getTerm())
                    .orElseGet(() -> termRepository.save(Term.builder().generateId().name(request.getTerm()).description("autogenerert").build()));

            term.addInformationType(informationType);
        }
    }

    public void validateRequest(List<InformationTypeRequest> requests) {
        List<ValidationError> validationErrors = validateRequestsAndReturnErrors(requests);

        checkForErrors(validationErrors);
    }

    public List<ValidationError> validateRequestsAndReturnErrors(List<InformationTypeRequest> requests) {
        requests = nullToEmptyList(requests);
        if (requests.isEmpty()) {
            return Collections.emptyList();
        }
        if (requests.stream().anyMatch(r -> r.getInformationTypeMaster() == null)) {
            throw new IllegalStateException("missing InformationTypeMaster on request");
        }

        var validationErrors = validateNoDuplicates(requests);
        requests.forEach(InformationTypeRequest::format);

        validationErrors.addAll(StreamUtils.applyAll(requests,
                RequestElement::validateFields,
                this::validateInformationTypeRepositoryValues));
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

}
