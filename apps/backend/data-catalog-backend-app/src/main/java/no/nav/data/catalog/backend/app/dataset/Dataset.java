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

import java.util.Set;
import java.util.UUID;
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
    private Set<Dataset> children;

    @ManyToMany(mappedBy = "children")
    private Set<Dataset> parents;

    public DatasetResponse convertToResponse() {
        return new DatasetResponse(this);
    }

    public Dataset convertNewFromRequest(DatasetRequest request, DatasetMaster master) {
        id = UUID.randomUUID();
        elasticsearchId = base64UUID();
        elasticsearchStatus = ElasticsearchStatus.TO_BE_CREATED;
        datasetData = new DatasetData(master);
        convertFromRequest(request);
        return this;
    }

    public Dataset convertUpdateFromRequest(DatasetRequest request) {
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
        datasetData.setHaspart(request.getHaspart());
    }

    public static class DatasetBuilder {

        public DatasetBuilder generateElasticsearchId() {
            this.elasticsearchId = base64UUID();
            return this;
        }
    }

}
