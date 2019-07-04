package no.nav.data.catalog.backend.app.dataset;

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
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import no.nav.data.catalog.backend.app.common.auditing.Auditable;
import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus;
import org.hibernate.annotations.Type;

@Data
@EqualsAndHashCode(exclude = {"children", "parents"}, callSuper = false)
@ToString(exclude = {"children", "parents"})
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "DATASET", schema = "BACKEND_SCHEMA")
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
    private Set<Dataset> children;

    @ManyToMany(mappedBy = "children")
    private Set<Dataset> parents;

}
