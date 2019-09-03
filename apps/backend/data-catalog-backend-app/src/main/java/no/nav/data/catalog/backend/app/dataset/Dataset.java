package no.nav.data.catalog.backend.app.dataset;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import no.nav.data.catalog.backend.app.common.auditing.Auditable;
import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus;
import org.hibernate.annotations.Type;

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

import static no.nav.data.catalog.backend.app.common.utils.StreamUtils.copyOf;
import static org.elasticsearch.common.UUIDs.base64UUID;

@Data
@EqualsAndHashCode(exclude = {"children", "parents"}, callSuper = false)
@ToString(exclude = {"children", "parents"})
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "DATASET")
public class Dataset extends Auditable<String> {

    @Id
    @Column(name = "DATASET_ID")
    @Type(type = "pg-uuid")
    private UUID id;

    @NotNull
    @Column(name = "ELASTICSEARCH_ID", nullable = false)
    private String elasticsearchId;

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

    public String getTitle() {
        return datasetData.getTitle();
    }

    public DatasetResponse convertToResponse() {
        return new DatasetResponse(this);
    }

    Dataset convertNewFromRequest(DatasetRequest request, DatasetMaster master) {
        id = UUID.randomUUID();
        elasticsearchId = base64UUID();
        elasticsearchStatus = ElasticsearchStatus.TO_BE_CREATED;
        datasetData = new DatasetData(master);
        convertFromRequest(request);
        return this;
    }

    Dataset convertUpdateFromRequest(DatasetRequest request) {
        elasticsearchStatus = ElasticsearchStatus.TO_BE_UPDATED;
        convertFromRequest(request);
        return this;
    }

    private void convertFromRequest(DatasetRequest request) {
        datasetData.setTitle(request.getTitle());
        datasetData.setDescription(request.getDescription());
        datasetData.setCategories(copyOf(request.getCategories()));
        datasetData.setProvenances(copyOf(request.getProvenances()));
        datasetData.setPi(request.getPi());
        datasetData.setIssued(request.getIssued());
        datasetData.setKeywords(copyOf(request.getKeywords()));
        datasetData.setTheme(request.getTheme());
        datasetData.setAccessRights(request.getAccessRights());
        datasetData.setPublisher(request.getPublisher());
        datasetData.setSpatial(request.getSpatial());
    }

    void replaceChildren(List<Dataset> children) {
        var titles = titles(children);
        getChildren().stream().filter(child -> !titles.contains(child.getTitle())).forEach(this::removeChild);
        children.forEach(this::addChild);
        updateHasparts();
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

    private void updateHasparts() {
        datasetData.setHaspart(titles(children));
    }

    public static List<String> titles(Collection<Dataset> datasets) {
        return datasets.stream().map(Dataset::getTitle).collect(Collectors.toList());
    }

    public static class DatasetBuilder {

        public DatasetBuilder generateElasticsearchId() {
            this.elasticsearchId = base64UUID();
            return this;
        }
    }
}
