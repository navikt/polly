package no.nav.data.polly.dataset.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Set;
import java.util.UUID;

/**
 * findAllDescendantsOf and findAllAncestorsOf are circular safe
 */
public interface DatasetRelationRepository extends JpaRepository<DatasetRelation, UUID> {

    @Query(value = "with recursive descendants as ( "
            + "    select dataset_id, parent_of_dataset_id "
            + "    from dataset__parent_of_dataset "
            + "    where dataset_id = ?1 "
            + "    union "
            + "    select d.dataset_id, d.parent_of_dataset_id "
            + "    from dataset__parent_of_dataset d "
            + "             inner join descendants on descendants.parent_of_dataset_id = d.dataset_id "
            + ") "
            + "select * from descendants", nativeQuery = true)
    Set<DatasetRelation> findAllDescendantsOf(UUID uuid);

    /**
     * Does not include siblings of ancestors
     */
    @Query(value = "with recursive ancestors as ( "
            + "    select dataset_id, parent_of_dataset_id "
            + "    from dataset__parent_of_dataset "
            + "    where parent_of_dataset_id = ?1 "
            + "    union "
            + "    select d.dataset_id, d.parent_of_dataset_id "
            + "    from dataset__parent_of_dataset d "
            + "             inner join ancestors on ancestors.dataset_id = d.parent_of_dataset_id "
            + ") "
            + "select * from ancestors", nativeQuery = true)
    Set<DatasetRelation> findAllAncestorsOf(UUID uuid);
}
