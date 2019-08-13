package no.nav.data.catalog.backend.app.dataset.repo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

import java.io.Serializable;
import java.util.UUID;
import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Data
@NoArgsConstructor
@Table(name = "dataset__parent_of_dataset")
public class DatasetRelation {

    public DatasetRelation(UUID id, UUID parentOfId) {
        this.relation = new Relation(id, parentOfId);
    }

    @EmbeddedId
    private Relation relation;

    public UUID getId() {
        return relation.id;
    }

    public UUID getParentOfId() {
        return relation.parentOfId;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Embeddable
    public static class Relation implements Serializable {

        @Column(name = "DATASET_ID")
        @Type(type = "pg-uuid")
        private UUID id;

        @Column(name = "PARENT_OF_DATASET_ID")
        @Type(type = "pg-uuid")
        private UUID parentOfId;

    }

}
