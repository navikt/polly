package no.nav.data.polly.dataset;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.common.auditing.Auditable;
import no.nav.data.polly.common.utils.StreamUtils;
import no.nav.data.polly.elasticsearch.ElasticsearchStatus;
import org.apache.commons.lang3.BooleanUtils;
import org.hibernate.annotations.Type;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import static no.nav.data.polly.common.utils.StreamUtils.copyOf;
import static no.nav.data.polly.elasticsearch.ElasticsearchStatus.SYNCED;
import static no.nav.data.polly.elasticsearch.ElasticsearchStatus.TO_BE_CREATED;
import static no.nav.data.polly.elasticsearch.ElasticsearchStatus.TO_BE_UPDATED;

@Slf4j
@Data
@EqualsAndHashCode(exclude = {"children", "parents"}, callSuper = false)
@ToString(exclude = {"children", "parents"})
@Builder
@AllArgsConstructor
@Entity
@Table(name = "DATASET")
public class Dataset extends Auditable<String> {

    @Id
    @Column(name = "DATASET_ID")
    @Type(type = "pg-uuid")
    private UUID id;

    @NotNull
    @Column(name = "ELASTICSEARCH_STATUS", nullable = false)
    @Enumerated(EnumType.STRING)
    private ElasticsearchStatus elasticsearchStatus;

    @NotNull
    @Column(name = "JSON_PROPERTY", columnDefinition = "jsonb", nullable = false)
    @Type(type = "jsonb")
    private DatasetData datasetData;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "DATASET__PARENT_OF_DATASET",
            joinColumns = @JoinColumn(name = "DATASET_ID"),
            inverseJoinColumns = @JoinColumn(name = "PARENT_OF_DATASET_ID")
    )
    private Set<Dataset> children = new HashSet<>();

    @ManyToMany(mappedBy = "children")
    private Set<Dataset> parents = new HashSet<>();

    public Dataset() {
        datasetData = new DatasetData();
    }

    public String getTitle() {
        return datasetData.getTitle();
    }

    public DatasetResponse convertToResponse() {
        return new DatasetResponse(this);
    }

    public Dataset convertNewFromRequest(DatasetRequest request, DatacatalogMaster master) {
        id = UUID.randomUUID();
        elasticsearchStatus = TO_BE_CREATED;
        datasetData = new DatasetData(master);
        convertFromRequest(request);
        return this;
    }

    Dataset convertUpdateFromRequest(DatasetRequest request) {
        elasticsearchStatus = elasticsearchStatus == SYNCED ? TO_BE_UPDATED : elasticsearchStatus;
        convertFromRequest(request);
        return this;
    }

    private void convertFromRequest(DatasetRequest request) {
        datasetData.setContentType(request.getContentType() != null ? ContentType.valueOf(request.getContentType()) : null);
        datasetData.setTitle(request.getTitle());
        datasetData.setDescription(request.getDescription());
        datasetData.setCategories(copyOf(request.getCategories()));
        datasetData.setProvenances(copyOf(request.getProvenances()));
        datasetData.setPi(request.getPi() == null ? null : BooleanUtils.toBoolean(request.getPi()) || request.getPi().trim().equals("1"));
        datasetData.setIssued(request.getIssued() == null ? null : LocalDateTime.parse(request.getIssued()));
        datasetData.setKeywords(copyOf(request.getKeywords()));
        datasetData.setThemes(copyOf(request.getThemes()));
        datasetData.setAccessRights(request.getAccessRights());
        datasetData.setPublisher(request.getPublisher());
        datasetData.setSpatial(request.getSpatial());
    }

    void replaceChildren(List<Dataset> children) {
        var before = titles(this.children);
        getChildren().forEach(this::removeChild);
        children.forEach(this::addChild);
        updateJsonHaspartsAndDistributionChannels();
        var after = titles(this.children);
        if (!before.equals(after)) {
            log.info("Dataset {} changed Children {}", getTitle(), StreamUtils.difference(before, after).changeString());
        }
    }

    private void addChild(Dataset child) {
        if (child != null) {
            children.add(child);
            child.getParents().add(this);
        }
    }

    private void removeChild(Dataset child) {
        getChildren().remove(child);
        child.getParents().remove(this);
    }

    private void updateJsonHaspartsAndDistributionChannels() {
        datasetData.setHaspart(titles(children));
    }

    public static List<String> titles(Collection<Dataset> datasets) {
        return datasets.stream().map(Dataset::getTitle).collect(Collectors.toList());
    }

    public static class DatasetBuilder {

        private Set<Dataset> children = new HashSet<>();
        private Set<Dataset> parents = new HashSet<>();

    }
}
