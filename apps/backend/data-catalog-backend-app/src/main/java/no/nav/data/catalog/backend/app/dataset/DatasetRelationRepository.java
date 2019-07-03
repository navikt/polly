package no.nav.data.catalog.backend.app.dataset;

import java.util.Set;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 * findAllChildren and findAllParentsOf are circular safe
 */
public interface DatasetRelationRepository extends JpaRepository<DatasetRelation, UUID> {

    @Query(value = "with recursive children as ( "
            + "    select dataset_id, parent_of_dataset_id "
            + "    from backend_schema.dataset__parent_of_dataset "
            + "    where dataset_id = ?1 "
            + "    union "
            + "    select d.dataset_id, d.parent_of_dataset_id "
            + "    from backend_schema.dataset__parent_of_dataset d "
            + "             inner join children on children.parent_of_dataset_id = d.dataset_id "
            + ") "
            + "select * from children", nativeQuery = true)
    public Set<DatasetRelation> findAllChildrenOf(UUID uuid);

    /**
     * Does not include siblings of parents
     */
    @Query(value = "with recursive parents as ( "
            + "    select dataset_id, parent_of_dataset_id "
            + "    from backend_schema.dataset__parent_of_dataset "
            + "    where parent_of_dataset_id = ?1 "
            + "    union "
            + "    select d.dataset_id, d.parent_of_dataset_id "
            + "    from backend_schema.dataset__parent_of_dataset d "
            + "             inner join parents on parents.dataset_id = d.parent_of_dataset_id "
            + ") "
            + "select * from parents", nativeQuery = true)
    public Set<DatasetRelation> findAllParentsOf(UUID uuid);
}
