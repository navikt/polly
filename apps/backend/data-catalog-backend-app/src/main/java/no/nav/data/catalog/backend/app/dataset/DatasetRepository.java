package no.nav.data.catalog.backend.app.dataset;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DatasetRepository extends JpaRepository<Dataset, UUID> {

    @Query("select d from Dataset d where not exists(select dr from DatasetRelation dr where dr.relation.parentOfId = d.id)")
    public List<Dataset> findAllRootDatasets();

}
