package no.nav.polly.dataset;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.polly.codelist.CodeResponse;
import no.nav.polly.codelist.CodelistService;
import no.nav.polly.codelist.ListName;
import no.nav.polly.dataset.repo.DatasetRelation;
import no.nav.polly.distributionchannel.DistributionChannelShort;
import org.apache.commons.lang3.StringUtils;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.validation.constraints.NotNull;

import static no.nav.polly.common.utils.StreamUtils.copyOf;
import static no.nav.polly.common.utils.StreamUtils.nullToEmptyList;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonPropertyOrder({"id", "title"})
public class DatasetResponse {

    private UUID id;
    private ContentType contentType;
    private String title;
    private String description;
    private String suggest;
    private List<CodeResponse> categories;
    private List<CodeResponse> provenances;
    private Boolean pi;
    private List<String> keywords;
    private List<String> themes;
    private String accessRights;
    private String spatial;
    private List<String> haspart;
    private List<DistributionChannelShort> distributionChannels;

    private String publisher;
    private LocalDateTime issued;

    // Intended for rest response only
    private DatacatalogMaster datacatalogMaster;

    @JsonInclude(Include.NON_NULL)
    @ApiModelProperty(hidden = true)
    private List<DatasetResponse> children;

    DatasetResponse(Dataset dataset) {
        this(dataset, Collections.emptyMap(), Collections.emptySet(), false);
    }

    DatasetResponse(Dataset dataset, Map<UUID, Dataset> allDatasets, Set<DatasetRelation> relations, boolean includeChildren) {
        id = dataset.getId();
        mapJsonFields(dataset.getDatasetData());

        children = relations.stream()
                .filter(rel -> rel.getId().equals(dataset.getId()))
                .map(rel -> new DatasetResponse(allDatasets.get(rel.getParentOfId()), allDatasets, relations, includeChildren))
                .collect(Collectors.toList());
        children = includeChildren ? children : null;
    }

    private void mapJsonFields(@NotNull DatasetData datasetData) {
        setContentType(datasetData.getContentType());
        setTitle(datasetData.getTitle());
        setDescription(datasetData.getDescription());
        setCategories(CodelistService.getCodeResponseForCodelistItems(ListName.CATEGORY, datasetData.getCategories()));
        setProvenances(CodelistService.getCodeResponseForCodelistItems(ListName.PROVENANCE, datasetData.getProvenances()));
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
