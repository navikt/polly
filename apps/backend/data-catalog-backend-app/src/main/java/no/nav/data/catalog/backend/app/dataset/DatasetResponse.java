package no.nav.data.catalog.backend.app.dataset;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.catalog.backend.app.codelist.CodeResponse;
import no.nav.data.catalog.backend.app.codelist.CodelistService;
import no.nav.data.catalog.backend.app.codelist.ListName;
import no.nav.data.catalog.backend.app.dataset.repo.DatasetRelation;
import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannelShort;
import no.nav.data.catalog.backend.app.policy.PolicyResponse;
import org.apache.commons.lang3.StringUtils;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.validation.constraints.NotNull;

import static no.nav.data.catalog.backend.app.common.utils.StreamUtils.copyOf;
import static no.nav.data.catalog.backend.app.common.utils.StreamUtils.nullToEmptyList;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonPropertyOrder({"id", "title"})
public class DatasetResponse {

    private UUID id;
    private String elasticsearchId;
    private ContentType contentType;
    private String title;
    private String description;
    private String suggest;
    private List<CodeResponse> categories;
    private List<String> provenances;
    private Boolean pi;
    private List<String> keywords;
    private List<String> themes;
    private String accessRights;
    private String spatial;
    private List<String> haspart;
    private List<DistributionChannelShort> distributionChannels;
    private List<PolicyResponse> policies;

    private String publisher;
    private LocalDateTime issued;

    // Intended for rest response only
    private DatacatalogMaster datacatalogMaster;
    @ApiModelProperty(hidden = true)
    private List<DatasetResponse> children;

    DatasetResponse(Dataset dataset) {
        this(dataset, Collections.emptyMap(), Collections.emptySet());
    }

    DatasetResponse(Dataset dataset, Map<UUID, Dataset> allDatasets, Set<DatasetRelation> relations) {
        id = dataset.getId();
        elasticsearchId = dataset.getElasticsearchId();
        mapJsonFields(dataset.getDatasetData());

        children = relations.stream()
                .filter(rel -> rel.getId().equals(dataset.getId()))
                .map(rel -> new DatasetResponse(allDatasets.get(rel.getParentOfId()), allDatasets, relations))
                .collect(Collectors.toList());
    }

    private void mapJsonFields(@NotNull DatasetData datasetData) {
        setContentType(datasetData.getContentType());
        setTitle(datasetData.getTitle());
        setDescription(datasetData.getDescription());
        setCategories(CodelistService.getCodeInfoForCodelistItems(ListName.CATEGORY, datasetData.getCategories()));
        setProvenances(copyOf(datasetData.getProvenances()));
        setPi(datasetData.getPi());
        setKeywords(copyOf(datasetData.getKeywords()));
        setThemes(copyOf(datasetData.getThemes()));
        setAccessRights(datasetData.getAccessRights());
        setSpatial(datasetData.getSpatial());
        setHaspart(copyOf(datasetData.getHaspart()));
        setDistributionChannels(copyOf(datasetData.getDistributionChannels()));

        setPublisher(datasetData.getPublisher());
        setIssued(datasetData.getIssued());

        setDatacatalogMaster(datasetData.getDatacatalogMaster());

        setSuggest(String.format("%s %s %s", title, StringUtils.trimToEmpty(description), String.join(" ", nullToEmptyList(keywords))));
    }

}
