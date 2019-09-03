package no.nav.data.catalog.backend.app.dataset;

import no.nav.data.catalog.backend.app.dataset.repo.DatasetRelation;
import no.nav.data.catalog.backend.app.dataset.repo.DatasetRelationRepository;
import no.nav.data.catalog.backend.app.dataset.repo.DatasetRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Function;
import java.util.stream.Collectors;
import javax.transaction.Transactional;

import static java.util.stream.Collectors.toMap;

@Slf4j
@Service
public class DatasetService extends RequestValidator<DatasetRequest> {

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

    @Transactional
    public Dataset convertNewFromRequest(DatasetRequest request, DatasetMaster master) {
        Dataset dataset = new Dataset().convertNewFromRequest(request, master);
        attachChildren(dataset, request.getHaspart());
        return dataset;
    }

    @Transactional
    public Dataset convertUpdateFromRequest(DatasetRequest request, Dataset dataset) {
        dataset.convertUpdateFromRequest(request);
        attachChildren(dataset, request.getHaspart());
        return dataset;
    }

    private void attachChildren(Dataset dataset, List<String> titles) {
        List<Dataset> children = titles.isEmpty() ? Collections.emptyList() : datasetRepository.findAllByTitle(titles);
        if (titles.size() != children.size()) {
            throw new DataCatalogBackendNotFoundException(String.format("Could not find hasparts %s, found %s", titles, Dataset.titles(children)));
        }
        dataset.replaceChildren(children);
    }

    // TODO validate
    @Transactional
    public List<Dataset> returnUpdatedDatasetsIfAllArePresent(List<DatasetRequest> requests) {
        List<Dataset> datasets = datasetRepository.findAllByTitle(requests.stream().map(DatasetRequest::getTitle).collect(Collectors.toList()));
        datasets.forEach(
                ds -> {
                    Optional<DatasetRequest> request = requests.stream().filter(r -> r.getTitle().equals(ds.getDatasetData().getTitle())).findFirst();
                    request.ifPresent(datasetRequest -> convertUpdateFromRequest(datasetRequest, ds));
                });
        return datasets;
    }


    public void validateRequest(List<DatasetRequest> requests, boolean isUpdate, DatasetMaster master) {
        List<ValidationError> validationErrors = validateRequestsAndReturnErrors(requests, isUpdate, master);

        if (!validationErrors.isEmpty()) {
            log.error("The request was not accepted. The following errors occurred during validation: {}", validationErrors);
            throw new ValidationException(validationErrors, "The request was not accepted. The following errors occurred during validation: ");
        }
    }

    public List<ValidationError> validateRequestsAndReturnErrors(List<DatasetRequest> requests, boolean isUpdate, DatasetMaster master) {
        requests = StreamUtils.nullToEmptyList(requests);
        if (requests.isEmpty()) {
            return Collections.emptyList();
        }

        List<ValidationError> validationErrors = new ArrayList<>(validateListOfRequests(requests));
        if (validationErrors.isEmpty()) { // to avoid NPE
            validationErrors.addAll(validateDatasetRequest(requests, isUpdate, master));
        }
        return validationErrors;
    }

    public List<ValidationError> validateNoDuplicates(List<DatasetRequest> requests) {
        requests = StreamUtils.nullToEmptyList(requests);
        if (requests.isEmpty()) {
            return Collections.emptyList();
        }
        return validateListOfRequests(requests);
    }

    private List<ValidationError> validateDatasetRequest(List<DatasetRequest> requests, boolean isUpdate, DatasetMaster master) {
        List<ValidationError> validationErrors = new ArrayList<>();
        AtomicInteger requestIndex = new AtomicInteger();

        requests.forEach(request -> {
            requestIndex.incrementAndGet();
            String reference = request.getReference(master, requestIndex.toString());

            List<ValidationError> errorsInCurrentRequest = validateThatNoFieldsAreNullOrEmpty(request, reference);

            if (errorsInCurrentRequest.isEmpty()) {  // to avoid NPE in current request
                //TODO: Find out if request should be stored in uppercase format
//                request.toUpperCaseAndTrim();
                errorsInCurrentRequest.addAll(validateRepositoryValues(request, isUpdate, reference, master));
            }

            if (!errorsInCurrentRequest.isEmpty()) {
                validationErrors.addAll(errorsInCurrentRequest);
            }
        });
        return validationErrors;
    }

    private List<ValidationError> validateThatNoFieldsAreNullOrEmpty(DatasetRequest request, String reference) {
        ValidateFieldsInRequestNotNullOrEmpty nullOrEmpty = new ValidateFieldsInRequestNotNullOrEmpty(reference);

        // TODO: Find out which fields should be validated
        nullOrEmpty.checkField("title", request.getTitle());
//        nullOrEmpty.checkField("description", request.getDescription());
//        nullOrEmpty.checkListOfFields("categories", request.getCategories());
//        nullOrEmpty.checkListOfFields("provenances", request.getProvenances());
//        nullOrEmpty.checkField("pi", request.getPi());
//        nullOrEmpty.checkField("issued", request.getIssued());
//        nullOrEmpty.checkListOfFields("keywords", request.getKeywords());
//        nullOrEmpty.checkField("theme", request.getTheme());
//        nullOrEmpty.checkField("accessRights", request.getAccessRights());
//        nullOrEmpty.checkField("publisher", request.getPublisher());
//        nullOrEmpty.checkField("spatial", request.getSpatial());
//        nullOrEmpty.checkField("haspart", request.getHaspart());
//        nullOrEmpty.checkListOfFields("distributionChannels", request.getDistributionChannels());

        return nullOrEmpty.getErrors();
    }

    private List<ValidationError> validateRepositoryValues(DatasetRequest request, boolean isUpdate, String reference, DatasetMaster requestMaster) {
        List<ValidationError> validationErrors = new ArrayList<>();
        Optional<Dataset> existingDataset = datasetRepository.findByTitle(request.getTitle());

        if (creatingExistingElement(isUpdate, existingDataset.isPresent())) {
            validationErrors.add(new ValidationError(reference, "creatingExistingDataset",
                    String.format("The dataset %s already exists and therefore cannot be created", request.getTitle())));
        }

        if (updatingNonExistingElement(isUpdate, existingDataset.isPresent())) {
            validationErrors.add(new ValidationError(reference, "updatingNonExistingDataset",
                    String.format("The dataset %s does not exist and therefore cannot be updated", request.getTitle())));
        }

        if (updatingExistingElement(isUpdate, existingDataset.isPresent())) {
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

    private boolean correlatingMaster(DatasetMaster existingMaster, DatasetMaster requestMaster) {
        return existingMaster.equals(requestMaster);
    }
}
