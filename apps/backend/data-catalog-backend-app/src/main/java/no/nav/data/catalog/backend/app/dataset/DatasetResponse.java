package no.nav.data.catalog.backend.app.dataset;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.catalog.backend.app.codelist.CodeResponse;
import no.nav.data.catalog.backend.app.codelist.CodelistService;
import no.nav.data.catalog.backend.app.codelist.ListName;
import no.nav.data.catalog.backend.app.common.utils.JsonUtils;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonPropertyOrder({"id", "title"})
public class DatasetResponse {

    private UUID id;
    private String title;
    private String description;
    private List<CodeResponse> categories;
    private List<String> provenances;
    private Boolean pi;
    private LocalDateTime issued;
    private List<String> keywords;
    private String theme;
    private String accessRights;
    private String publisher;
    private String spatial;
    private String haspart;

    private DatasetMaster master;
    private Set<DatasetResponse> children;

    DatasetResponse(Dataset dataset) {
        this(dataset, Collections.emptyMap(), Collections.emptySet());
    }

    DatasetResponse(Dataset dataset, Map<UUID, Dataset> allDatasets, Set<DatasetRelation> relations) {
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
        setCategories(CodelistService.getCodeInfoForCodelistItems(ListName.CATEGORY, datasetData.getCategories()));
        setProvenances(copyOf(datasetData.getProvenances()));
        setPi(datasetData.getPi());
        setIssued(datasetData.getIssued());
        setKeywords(copyOf(datasetData.getKeywords()));
        setTheme(datasetData.getTheme());
        setAccessRights(datasetData.getAccessRights());
        setPublisher(datasetData.getPublisher());
        setSpatial(datasetData.getSpatial());
        setHaspart(datasetData.getHaspart());
        setMaster(datasetData.getMaster());
    }

    private <T> List<T> copyOf(List<T> list) {
        return list == null ? Collections.emptyList() : List.copyOf(list);
    }

    public Map toMap() {
        return JsonUtils.toMap(this);
    }

}
