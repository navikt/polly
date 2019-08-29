package no.nav.data.catalog.backend.app.dataset;

import lombok.extern.slf4j.Slf4j;
import no.nav.data.catalog.backend.app.common.exceptions.ValidationException;
import no.nav.data.catalog.backend.app.common.validator.ValidationError;
import no.nav.data.catalog.backend.app.dataset.repo.DatasetRelation;
import no.nav.data.catalog.backend.app.dataset.repo.DatasetRelationRepository;
import no.nav.data.catalog.backend.app.dataset.repo.DatasetRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Function;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toMap;

@Slf4j
@Service
public class DatasetService {

    private final DatasetRelationRepository datasetRelationRepository;
    private final DatasetRepository datasetRepository;

    public DatasetService(DatasetRelationRepository datasetRelationRepository, DatasetRepository datasetRepository) {
        this.datasetRelationRepository = datasetRelationRepository;
        this.datasetRepository = datasetRepository;
    }

    public DatasetResponse findDatasetWithAllDescendants(UUID uuid) {
        Optional<Dataset> datasetOptional = datasetRepository.findById(uuid);
        if (datasetOptional.isEmpty()) {
            return null;
        }
        Set<DatasetRelation> relations = datasetRelationRepository.findAllDescendantsOf(uuid);
        Dataset dataset = datasetOptional.get();
        if (relations.isEmpty()) {
            return dataset.convertToResponse();
        }

        Set<UUID> allIds = relations.stream()
                .map(DatasetRelation::getParentOfId)
                .collect(Collectors.toSet());
        Map<UUID, Dataset> allDatasets = datasetRepository.findAllById(allIds).stream()
                .collect(toMap(Dataset::getId, Function.identity()));

        return new DatasetResponse(dataset, allDatasets, relations);
    }

    public Page<DatasetResponse> findAllRootDatasets(boolean includeDescendants, Pageable pageable) {
        Page<Dataset> datasets = datasetRepository.findAllRootDatasets(pageable);
        if (includeDescendants) {
            return datasets
                    .map(Dataset::getId)
                    .map(this::findDatasetWithAllDescendants);
        }
        return datasets.map(Dataset::convertToResponse);
    }

    public List<DatasetResponse> save(List<DatasetRequest> requests, DatasetMaster master) {
        List<Dataset> datasets = requests.stream()
                .map(request -> new Dataset().convertNewFromRequest(request, master))
                .collect(Collectors.toList());

        return datasetRepository.saveAll(datasets).stream()
                .map(Dataset::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<DatasetResponse> update(List<DatasetRequest> requests) {
        List<Dataset> updatedDatasets = returnUpdatedDatasetsIfAllArePresent(requests);

        return datasetRepository.saveAll(updatedDatasets).stream()
                .map(Dataset::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<Dataset> returnUpdatedDatasetsIfAllArePresent(List<DatasetRequest> requests) {
        List<Dataset> datasets = datasetRepository.findAllByTitle(requests.stream()
                .map(DatasetRequest::getTitle)
                .collect(Collectors.toList()));
        datasets.forEach(ds -> requests.stream()
                .filter(r -> r.getTitle().equals(ds.getDatasetData().getTitle()))
                .findFirst()
                .ifPresent(ds::convertUpdateFromRequest));
        return datasets;
    }


    public void validate(List<DatasetRequest> requests, boolean isUpdate, DatasetMaster master) {
        List<ValidationError> validationErrors = validateRequestsAndReturnErrors(requests, isUpdate, master);

        if (!validationErrors.isEmpty()) {
            log.error("The request was not accepted. The following errors occurremd during validation: {}", validationErrors);
            throw new ValidationException(validationErrors, "The request was not accepted. The following errors occurred during validation: ");
        }
    }

    public List<ValidationError> validateRequestsAndReturnErrors(List<DatasetRequest> requests, boolean isUpdate, DatasetMaster master) {
        List<ValidationError> validationErrors = new ArrayList<>(validateListNotNullOrEmpty(requests));

        if (validationErrors.isEmpty()) {
            validationErrors.addAll(validateThatTheSameElementIsNotDuplicatedInTheRequest(requests));
            validationErrors.addAll(validateThatElementsDoNotUseTheSameIdentifyingFieldsInTheRequest(requests));
            validationErrors.addAll(validateFieldsInRequest(requests, isUpdate, master));
        }
        return validationErrors;
    }

    public List<ValidationError> validateNoDuplicates(List<DatasetRequest> requests) {
        List<ValidationError> validationErrors = new ArrayList<>(validateListNotNullOrEmpty(requests));

        if (validationErrors.isEmpty()) {
            validationErrors.addAll(validateThatTheSameElementIsNotDuplicatedInTheRequest(requests));
            validationErrors.addAll(validateThatElementsDoNotUseTheSameIdentifyingFieldsInTheRequest(requests));
        }
        return validationErrors;
    }

    private List<ValidationError> validateListNotNullOrEmpty(List<DatasetRequest> requests) {
        List<ValidationError> validationErrors = new ArrayList<>();
        if (requests == null || requests.isEmpty()) {
            validationErrors.add(new ValidationError("RequestNotAccepted", "RequestWasNullOrEmpty",
                    "The request was not accepted because it is null or empty"));
        }
        return validationErrors;
    }

    private List<ValidationError> validateThatTheSameElementIsNotDuplicatedInTheRequest(List<DatasetRequest> requests) {
        Set requestSet = Set.copyOf(requests);
        if (requestSet.size() < requests.size()) {
            return recordDuplicatedElementsInTheRequest(requests);
        }
        return Collections.emptyList();
    }

    private List<ValidationError> recordDuplicatedElementsInTheRequest(List<DatasetRequest> requests) {
        List<ValidationError> validationErrors = new ArrayList<>();
        Map<String, Integer> elementIdentifierToRequestIndex = new HashMap<>();

        AtomicInteger requestIndex = new AtomicInteger();
        requests.forEach(request -> {
            requestIndex.incrementAndGet();
            String elementIdentifier = request.getTitle();
            if (elementIdentifierToRequestIndex.containsKey(elementIdentifier)) {
                validationErrors.add(new ValidationError("Request:" + requestIndex, "DuplicateElement",
                        String.format("The dataset %s is not unique because it has already been used in this request (see request:%s)",
                                elementIdentifier, elementIdentifierToRequestIndex.get(elementIdentifier)
                        )));
            } else {
                elementIdentifierToRequestIndex.put(elementIdentifier, requestIndex.intValue());
            }
        });
        return validationErrors;
    }


    private List<ValidationError> validateThatElementsDoNotUseTheSameIdentifyingFieldsInTheRequest(List<DatasetRequest> requests) {
        List<ValidationError> validationErrors = new ArrayList<>();

        requests.stream()
                .filter(element -> requests.stream()
                        .anyMatch(compare -> !element.equals(compare) && element.getTitle().equals(compare.getTitle())))
                .forEach(element -> validationErrors.add(new ValidationError(element.getTitle(), "DuplicatedIdentifyingFields",
                        String.format("Multipe elements in this request are using the same unique fields (%s)", element.getTitle()))));

        return validationErrors.stream().distinct().collect(Collectors.toList());
    }

    private List<ValidationError> validateFieldsInRequest(List<DatasetRequest> requests, boolean isUpdate, DatasetMaster master) {
        List<ValidationError> validationErrors = new ArrayList<>();
        AtomicInteger requestIndex = new AtomicInteger();

        requests.forEach(request -> {
            requestIndex.incrementAndGet();
            String reference = request.getReference(master, requestIndex.toString());

            List<ValidationError> errorsInCurrentRequest = request.validateThatNoFieldsAreNullOrEmpty(reference);

            if (errorsInCurrentRequest.isEmpty()) {  // to avoid NPE in current request
                request.toUpperCaseAndTrim();
                errorsInCurrentRequest.addAll(validateThatAllFieldsHaveValidValues(request, isUpdate, reference, master));
            }

            if (!errorsInCurrentRequest.isEmpty()) {
                validationErrors.addAll(errorsInCurrentRequest);
            }
        });
        return validationErrors;
    }

    private List<ValidationError> validateThatAllFieldsHaveValidValues(DatasetRequest request, boolean isUpdate, String reference, DatasetMaster requestMaster) {
        List<ValidationError> validationErrors = new ArrayList<>();
        Optional<Dataset> existingDataset = datasetRepository.findByTitle(request.getTitle());

        if (creatingExistingDataset(isUpdate, existingDataset.isPresent())) {
            validationErrors.add(new ValidationError(reference, "creatingExistingDataset",
                    String.format("The dataset %s already exists and therefore cannot be created", request.getTitle())));
        }

        if (updatingNonExistingDataset(isUpdate, existingDataset.isPresent())) {
            validationErrors.add(new ValidationError(reference, "updatingNonExistingDataset",
                    String.format("The dataset %s does not exist and therefore cannot be updated", request.getTitle())));
        }

        if (updatingExistingDataset(isUpdate, existingDataset.isPresent())) {
            DatasetData existingDatasetData = existingDataset.get().getDatasetData();

            if (!existingDatasetData.hasMaster()) {
                validationErrors.add(new ValidationError(reference, "missingMasterInExistingDataset"
                        , String.format("The dataset %s has not defined where it is mastered", existingDatasetData.getTitle())));
            } else if (!correlatingMaster(existingDatasetData.getMaster(), requestMaster)) {
                validationErrors.add(new ValidationError(reference, "nonCorrelatingMaster",
                        String.format("The dataset %s is mastered in %s and therefore cannot be updated from %s",
                                request.getTitle(), existingDatasetData.getMaster(), requestMaster)));
            }
        }
        return validationErrors;
    }


    private boolean creatingExistingDataset(boolean isUpdate, boolean datasetExists) {
        return !isUpdate && datasetExists;
    }

    private boolean updatingNonExistingDataset(boolean isUpdate, boolean datasetExists) {
        return isUpdate && !datasetExists;
    }

    private boolean updatingExistingDataset(boolean isUpdate, boolean datasetExists) {
        return isUpdate && datasetExists;
    }

    private boolean correlatingMaster(DatasetMaster existingMaster, DatasetMaster requestMaster) {
        return existingMaster.equals(requestMaster);
    }
}
