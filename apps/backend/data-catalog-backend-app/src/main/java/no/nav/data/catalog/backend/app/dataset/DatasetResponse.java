package no.nav.data.catalog.backend.app.dataset;


import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import no.nav.data.catalog.backend.app.common.utils.JsonUtils;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class DatasetResponse extends DatasetData {

    private UUID id;
    private Set<String> distributions; // TODO change with actual
    private Set<DatasetResponse> children;

    public DatasetResponse(Dataset dataset) {
        this(dataset, Collections.emptyMap(), Collections.emptySet());
    }

    public DatasetResponse(Dataset dataset, Map<UUID, Dataset> allDatasets, Set<DatasetRelation> relations) {
        id = dataset.getId();
        mapJsonFields(dataset.getDatasetData());

        children = relations.stream()
                .filter(rel -> rel.getId().equals(id))
                .map(rel -> new DatasetResponse(allDatasets.get(rel.getParentOfId()), allDatasets, relations))
                .collect(Collectors.toSet());
    }

    private void mapJsonFields(@NotNull DatasetData datasetData) {
        setDescription(datasetData.getDescription());
        setTitle(datasetData.getTitle());
        setCategory(copyOf(datasetData.getCategory()));
        setProvenance(copyOf(datasetData.getProvenance()));
        setPi(datasetData.getPi());
        setIssued(datasetData.getIssued());
        setPolicy(copyOf(datasetData.getPolicy()));
        setKeywords(copyOf(datasetData.getKeywords()));
        setTheme(datasetData.getTheme());
        setAccessRights(datasetData.getAccessRights());
        setPublisher(datasetData.getPublisher());
        setSpatial(datasetData.getSpatial());
        setHaspart(datasetData.getHaspart());
    }

    private <T> List<T> copyOf(List<T> list) {
        return list == null ? Collections.emptyList() : List.copyOf(list);
    }

    public Map toMap() {
        return JsonUtils.toMap(this);
    }

}
