package no.nav.polly.elasticsearch.domain;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.polly.codelist.CodeResponse;
import no.nav.polly.codelist.CodelistService;
import no.nav.polly.codelist.ListName;
import no.nav.polly.common.utils.DateUtil;
import no.nav.polly.dataset.ContentType;
import no.nav.polly.dataset.Dataset;
import no.nav.polly.dataset.DatasetData;
import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import javax.validation.constraints.NotNull;

import static no.nav.polly.common.utils.StreamUtils.copyOf;
import static no.nav.polly.common.utils.StreamUtils.nullToEmptyList;
import static no.nav.polly.common.utils.StreamUtils.safeStream;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonPropertyOrder({"id", "title"})
public class DatasetElasticsearch {

    private String id;
    private ContentType type;
    private ContentType format;
    private String title;
    private String description;
    private List<String> category;
    private List<String> provenance;
    private Integer pi;
    private List<String> keywords;
    private List<String> theme;
    private String accessRights;
    private String spatial;
    private List<String> haspart;
    private List<DistributionElasticsearch> distribution;

    private String publisher;
    private LocalDateTime issued;
    private List<PolicyElasticsearch> policy;

    private String modified;
    @JsonProperty("modified_by")
    private String modifiedBy;
    private String created;
    @JsonProperty("created_by")
    private String createdBy;

    // Mapped
    private String suggest;

    // Mapped from policies
    private List<String> purpose = new ArrayList<>();
    private List<String> legalbasis = new ArrayList<>();

    public DatasetElasticsearch(Dataset dataset, List<PolicyElasticsearch> policies) {
        id = dataset.getId().toString();

        setCreated(DateUtil.formatDate(dataset.getCreatedDate()));
        setCreatedBy(dataset.getCreatedBy());
        setModified(DateUtil.formatDate(dataset.getLastModifiedDate()));
        setModifiedBy(dataset.getLastModifiedBy());

        setPolicy(policies);
        policies.forEach(policy -> {
            purpose.add(policy.getPurpose());
            legalbasis.add(policy.getLegalBasis());
        });

        mapJsonFields(dataset.getDatasetData());
    }

    private void mapJsonFields(@NotNull DatasetData datasetData) {
        setType(datasetData.getContentType());
        setFormat(datasetData.getContentType());
        setTitle(datasetData.getTitle());
        setDescription(datasetData.getDescription());
        setCategory(getCodelistDescription(ListName.CATEGORY, datasetData.getCategories()));
        setProvenance(getCodelistDescription(ListName.PROVENANCE, datasetData.getProvenances()));
        setPi(datasetData.getPi() == null ? null : BooleanUtils.toInteger(datasetData.getPi()));
        setKeywords(copyOf(datasetData.getKeywords()));
        setTheme(copyOf(datasetData.getThemes()));
        setAccessRights(datasetData.getAccessRights());
        setSpatial(datasetData.getSpatial());
        setHaspart(copyOf(datasetData.getHaspart()));
        setDistribution(safeStream(datasetData.getDistributionChannels()).map(dc -> new DistributionElasticsearch(dc.getType(), dc.getName())).collect(Collectors.toList()));

        setPublisher(datasetData.getPublisher());
        setIssued(datasetData.getIssued());

        setSuggest(String.format("%s %s %s", title, StringUtils.trimToEmpty(description), String.join(" ", nullToEmptyList(keywords))));
    }

    private List<String> getCodelistDescription(ListName listName, List<String> values) {
        return CodelistService.getCodeResponseForCodelistItems(listName, values).stream().filter(Objects::nonNull).map(CodeResponse::getDescription).collect(Collectors.toList());
    }

}
