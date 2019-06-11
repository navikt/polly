package no.nav.data.catalog.backend.app.informationtype;

import static no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus.SYNCED;

import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface InformationTypeRepository extends JpaRepository<InformationType, Long> {
	ElasticsearchStatus syncedStatus = SYNCED;

	List<InformationType> findAllByOrderByIdAsc(Pageable pageable);

	Optional<List<InformationType>> findByElasticsearchStatus(@Param("status") ElasticsearchStatus status);
	Optional<InformationType> findByName(@Param("name") String name);

	@Query("UPDATE InformationType SET elasticsearchStatus = :status WHERE status = SYNCED")
	int updateStatusAllRows(@Param("status") ElasticsearchStatus status);
}
