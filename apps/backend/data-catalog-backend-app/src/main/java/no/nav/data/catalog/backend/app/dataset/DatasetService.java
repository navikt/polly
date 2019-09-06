package no.nav.data.catalog.backend.app.dataset;

import lombok.extern.slf4j.Slf4j;
import no.nav.data.catalog.backend.app.common.exceptions.DataCatalogBackendNotFoundException;
import no.nav.data.catalog.backend.app.common.exceptions.ValidationException;
import no.nav.data.catalog.backend.app.common.validator.RequestValidator;
import no.nav.data.catalog.backend.app.common.validator.ValidateFieldsInRequestNotNullOrEmpty;
import no.nav.data.catalog.backend.app.common.validator.ValidationError;
import no.nav.data.catalog.backend.app.dataset.repo.DatasetRelation;
import no.nav.data.catalog.backend.app.dataset.repo.DatasetRelationRepository;
import no.nav.data.catalog.backend.app.dataset.repo.DatasetRepository;
import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannel;
import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannelRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Function;
import java.util.stream.Collectors;
import javax.transaction.Transactional;

import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toMap;
import static no.nav.data.catalog.backend.app.common.utils.StreamUtils.nullToEmptyList;

@Slf4j
@Service
public class DatasetService extends RequestValidator<DatasetRequest> {

    private final DatasetRelationRepository datasetRelationRepository;
    private final DatasetRepository datasetRepository;
    private final DistributionChannelRepository distributionChannelRepository;

    public DatasetService(DatasetRelationRepository datasetRelationRepository, DatasetRepository datasetRepository,
            DistributionChannelRepository distributionChannelRepository) {
        this.datasetRelationRepository = datasetRelationRepository;
        this.datasetRepository = datasetRepository;
        this.distributionChannelRepository = distributionChannelRepository;
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

    @Transactional
    public Dataset save(DatasetRequest request, DatasetMaster master) {
        return datasetRepository.save(convertNew(request, master));
    }

    @Transactional
    public List<Dataset> saveAll(List<DatasetRequest> requests, DatasetMaster master) {
        List<Dataset> datasets = requests.stream().map(request -> convertNew(request, master)).collect(toList());
        return datasetRepository.saveAll(datasets);
    }

    @Transactional
    public Dataset update(DatasetRequest request) {
        return updateAll(Collections.singletonList(request)).get(0);
    }

    @Transactional
    public List<Dataset> updateAll(List<DatasetRequest> requests) {
        List<Dataset> datasets = datasetRepository.findAllByTitle(requests.stream()
                .map(DatasetRequest::getTitle)
                .collect(Collectors.toList()));

        datasets.forEach(
                ds -> {
                    Optional<DatasetRequest> request = requests.stream()
                            .filter(r -> r.getTitle().equals(ds.getDatasetData().getTitle()))
                            .findFirst();
                    request.ifPresent(datasetRequest -> convertUpdate(datasetRequest, ds));
                });

        return datasetRepository.saveAll(datasets);
    }

    private Dataset convertNew(DatasetRequest request, DatasetMaster master) {
        Dataset dataset = new Dataset().convertNewFromRequest(request, master);
        attachDependencies(dataset, request);
        return dataset;
    }

    private Dataset convertUpdate(DatasetRequest request, Dataset dataset) {
        if (request.getMaster() != dataset.getDatasetData().getMaster()) {
            throw new ValidationException(
                    String.format("Master mismatch for update, dataset is mastered by=%s request came from %s", dataset.getDatasetData().getMaster(), request.getMaster()));
        }
        dataset.convertUpdateFromRequest(request);
        attachDependencies(dataset, request);
        return dataset;
    }

    private void attachDependencies(Dataset dataset, DatasetRequest request) {
        var childTitles = nullToEmptyList(request.getHaspart());
        var distChannelNames = nullToEmptyList(request.getDistributionChannels());

        List<Dataset> children = childTitles.isEmpty() ? Collections.emptyList() : datasetRepository.findAllByTitle(childTitles);
        if (childTitles.size() != children.size()) {
            throw new DataCatalogBackendNotFoundException(String.format("Could not find all hasparts %s, found %s", childTitles, Dataset.titles(children)));
        }

        List<DistributionChannel> distChannels = distChannelNames.isEmpty() ? Collections.emptyList() : distributionChannelRepository.findAllByName(distChannelNames);
        if (distChannelNames.size() != distChannels.size()) {
            throw new DataCatalogBackendNotFoundException(
                    String.format("Could not find all DistributionChannels %s, found %s", distChannelNames, DistributionChannel.names(distChannels)));
        }

        dataset.replaceChildren(children);
        dataset.replaceDistributionChannels(distChannels);
    }

    public void validateRequest(List<DatasetRequest> requests, boolean isUpdate, DatasetMaster master) {
        List<ValidationError> validationErrors = validateRequestsAndReturnErrors(requests, isUpdate, master);

        if (!validationErrors.isEmpty()) {
            log.error("The request was not accepted. The following errors occurred during validation: {}", validationErrors);
            throw new ValidationException(validationErrors, "The request was not accepted. The following errors occurred during validation: ");
        }
    }

    public List<ValidationError> validateRequestsAndReturnErrors(List<DatasetRequest> requests, boolean isUpdate, DatasetMaster master) {
        requests = nullToEmptyList(requests);
        if (requests.isEmpty()) {
            return Collections.emptyList();
        }

        List<ValidationError> validationErrors = new ArrayList<>(validateListOfRequests(requests));
        prepareDatasetRequestForValidation(requests, isUpdate, master);
        validationErrors.addAll(validateDatasetRequest(requests));
        return validationErrors;
    }

    public List<ValidationError> validateNoDuplicates(List<DatasetRequest> requests) {
        requests = nullToEmptyList(requests);
        if (requests.isEmpty()) {
            return Collections.emptyList();
        }
        return validateListOfRequests(requests);
    }

    private void prepareDatasetRequestForValidation(List<DatasetRequest> requests, boolean isUpdate, DatasetMaster master) {
        AtomicInteger requestIndex = new AtomicInteger();

        requests.forEach(request -> {
            request.setUpdate(isUpdate);
            request.setRequestIndex(requestIndex.incrementAndGet());
            request.setMaster(master);
        });
    }

    private List<ValidationError> validateDatasetRequest(List<DatasetRequest> requests) {
        List<ValidationError> validationErrors = new ArrayList<>();

        requests.forEach(request -> {
            List<ValidationError> errorsInCurrentRequest = validateThatNoFieldsAreNullOrEmpty(request);
//                request.toUpperCaseAndTrim();
            errorsInCurrentRequest.addAll(validateRepositoryValues(request));

            if (!errorsInCurrentRequest.isEmpty()) {
                validationErrors.addAll(errorsInCurrentRequest);
            }
        });
        return validationErrors;
    }

    private List<ValidationError> validateThatNoFieldsAreNullOrEmpty(DatasetRequest request) {
        ValidateFieldsInRequestNotNullOrEmpty nullOrEmpty = new ValidateFieldsInRequestNotNullOrEmpty(request.getReference());

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

    private List<ValidationError> validateRepositoryValues(DatasetRequest request) {
        List<ValidationError> validationErrors = new ArrayList<>();
        Optional<Dataset> existingDataset = datasetRepository.findByTitle(request.getTitle());

        if (creatingExistingElement(request.isUpdate(), existingDataset.isPresent())) {
            validationErrors.add(new ValidationError(request.getReference(), "creatingExistingDataset",
                    String.format("The dataset %s already exists and therefore cannot be created", request.getTitle())));
        }

        if (updatingNonExistingElement(request.isUpdate(), existingDataset.isPresent())) {
            validationErrors.add(new ValidationError(request.getReference(), "updatingNonExistingDataset",
                    String.format("The dataset %s does not exist and therefore cannot be updated", request.getTitle())));
        }

        if (updatingExistingElement(request.isUpdate(), existingDataset.isPresent())) {
            DatasetData existingDatasetData = existingDataset.get().getDatasetData();

            if (!existingDatasetData.hasMaster()) {
                validationErrors.add(new ValidationError(request.getReference(), "missingMasterInExistingDataset"
                        , String.format("The dataset %s has not defined where it is mastered", existingDatasetData.getTitle())));
            } else if (!correlatingMaster(existingDatasetData.getMaster(), request.getMaster())) {
                validationErrors.add(new ValidationError(request.getReference(), "nonCorrelatingMaster",
                        String.format("The dataset %s is mastered in %s and therefore cannot be updated from %s",
                                request.getTitle(), existingDatasetData.getMaster(), request.getMaster())));
            }
        }
        return validationErrors;
    }

    private boolean correlatingMaster(DatasetMaster existingMaster, DatasetMaster requestMaster) {
        return existingMaster.equals(requestMaster);
    }
}
