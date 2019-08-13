package no.nav.data.catalog.backend.app.dataset;

import no.nav.data.catalog.backend.app.dataset.repo.DatasetRelation;
import no.nav.data.catalog.backend.app.dataset.repo.DatasetRelationRepository;
import no.nav.data.catalog.backend.app.dataset.repo.DatasetRepository;
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

    public Optional<DatasetResponse> findDatasetWithAllDescendants(UUID uuid) {
        Optional<Dataset> datasetOptional = datasetRepository.findById(uuid);
        if (datasetOptional.isEmpty()) {
            return Optional.empty();
        }
        Set<DatasetRelation> relations = datasetRelationRepository.findAllDescendantsOf(uuid);
        Dataset dataset = datasetOptional.get();
        if (relations.isEmpty()) {
            return Optional.of(dataset.convertToResponse());
        }

        Set<UUID> allIds = relations.stream()
                .map(DatasetRelation::getParentOfId)
                .collect(Collectors.toSet());
        Map<UUID, Dataset> allDatasets = datasetRepository.findAllById(allIds).stream()
                .collect(toMap(Dataset::getId, Function.identity()));

        DatasetResponse datasetResponse = new DatasetResponse(dataset, allDatasets, relations);
        return Optional.of(datasetResponse);
    }

    public List<DatasetResponse> findAllRootDatasets(boolean includeDescendants) {
        List<Dataset> datasets = datasetRepository.findAllRootDatasets();
        if (includeDescendants) {
            return datasets.stream()
                    .map(Dataset::getId)
                    .map(this::findDatasetWithAllDescendants)
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .collect(Collectors.toList());
        }
        return datasets.stream().map(Dataset::convertToResponse).collect(Collectors.toList());
    }

    // TODO
    public Map<String, Map<String, String>> validateRequestsAndReturnErrors(List<DatasetRequest> shared, boolean b) {
        return new HashMap<>();
    }

    // TODO
    public List<Dataset> returnUpdatedDatasetsIfAllArePresent(List<DatasetRequest> requests) {
        return datasetRepository.findAllByTitle(requests.stream().map(DatasetRequest::getTitle).collect(Collectors.toList()))
                .stream()
                .peek(ds -> {
                    DatasetRequest req = requests.stream().filter(r -> r.getTitle().equals(ds.getDatasetData().getTitle())).findFirst().orElse(null);
                    ds.convertFromRequest(req, true);
                })
                .collect(Collectors.toList());
    }
}
