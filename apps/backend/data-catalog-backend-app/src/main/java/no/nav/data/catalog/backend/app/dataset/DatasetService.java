package no.nav.data.catalog.backend.app.dataset;

import no.nav.data.catalog.backend.app.dataset.repo.DatasetRelation;
import no.nav.data.catalog.backend.app.dataset.repo.DatasetRelationRepository;
import no.nav.data.catalog.backend.app.dataset.repo.DatasetRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toMap;

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

    public Page<DatasetResponse> findAllRootDatasets(boolean includeDescendants, PageRequest pageable) {
        Page<Dataset> datasets = datasetRepository.findAllRootDatasets(pageable);
        if (includeDescendants) {
            return datasets
                    .map(Dataset::getId)
                    .map(this::findDatasetWithAllDescendants);
        }
        return datasets.map(Dataset::convertToResponse);
    }

    // TODO
    public Map<String, Map<String, String>> validateRequestsAndReturnErrors(List<DatasetRequest> requests, boolean update) {
        validateRequests(requests, update);
        return new HashMap<>();
    }

    // TODO validate
    public void validateRequests(List<DatasetRequest> requests, boolean update) {

    }

    // TODO validate
    public List<Dataset> returnUpdatedDatasetsIfAllArePresent(List<DatasetRequest> requests) {
        List<Dataset> datasets = datasetRepository.findAllByTitle(requests.stream().map(DatasetRequest::getTitle).collect(Collectors.toList()));
        datasets.forEach(ds -> requests.stream().filter(r -> r.getTitle().equals(ds.getDatasetData().getTitle())).findFirst().ifPresent(ds::convertUpdateFromRequest));
        return datasets;
    }
}
