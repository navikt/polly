package no.nav.data.catalog.backend.app.dataset;

import java.util.List;
import java.util.UUID;

import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DatasetRepository extends JpaRepository<Dataset, UUID> {

    List<Dataset> findByElasticsearchStatus(ElasticsearchStatus status);

    @Query("select d from Dataset d where not exists(select dr from DatasetRelation dr where dr.relation.parentOfId = d.id)")
    List<Dataset> findAllRootDatasets();

}
