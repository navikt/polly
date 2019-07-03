package no.nav.data.catalog.backend.app.dataset;

import static java.util.stream.Collectors.toMap;

import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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

    public Optional<DatasetResponse> findDatasetWithChildren(UUID uuid) {
        Set<DatasetRelation> relations = datasetRelationRepository.findAllChildrenOf(uuid);
        if (relations.isEmpty()) {
            return Optional.empty();
        }

        Set<UUID> allIds = relations.stream()
                .flatMap(rel -> Stream.of(rel.getId(), rel.getParentOfId()))
                .collect(Collectors.toSet());
        Map<UUID, Dataset> allDatasets = datasetRepository.findAllById(allIds)
                .stream().collect(toMap(Dataset::getId, Function.identity()));

        DatasetResponse datasetResponse = new DatasetResponse(allDatasets.get(uuid), allDatasets, relations);
        return Optional.of(datasetResponse);
    }
}
