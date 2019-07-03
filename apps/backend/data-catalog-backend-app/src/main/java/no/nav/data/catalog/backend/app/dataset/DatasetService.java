package no.nav.data.catalog.backend.app.dataset;

import static java.util.stream.Collectors.toMap;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

@Service
public class DatasetService {

    private final DatasetRelationRepository datasetRelationRepository;
    private final DatasetRepository datasetRepository;

    public DatasetService(DatasetRelationRepository datasetRelationRepository, DatasetRepository datasetRepository) {
        this.datasetRelationRepository = datasetRelationRepository;
        this.datasetRepository = datasetRepository;
    }

    public Optional<DatasetResponse> findDataset(UUID uuid) {
        return datasetRepository.findById(uuid).map(DatasetResponse::new);
    }

    public Optional<DatasetResponse> findDatasetWithAllDescendants(UUID uuid) {
        Optional<Dataset> datasetOptional = datasetRepository.findById(uuid);
        if (datasetOptional.isEmpty()) {
            return Optional.empty();
        }
        Set<DatasetRelation> relations = datasetRelationRepository.findAllDescendantsOf(uuid);
        Dataset dataset = datasetOptional.get();
        if (relations.isEmpty()) {
            return Optional.of(new DatasetResponse(dataset));
        }

        Set<UUID> allIds = relations.stream()
                .map(DatasetRelation::getParentOfId)
                .collect(Collectors.toSet());
        Map<UUID, Dataset> allDatasets = datasetRepository.findAllById(allIds)
                .stream().collect(toMap(Dataset::getId, Function.identity()));

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
        return datasets.stream().map(DatasetResponse::new).collect(Collectors.toList());
    }
}
