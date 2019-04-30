package no.nav.data.catalog.backend.app.informationtype;

import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface InformationTypeRepository extends JpaRepository<InformationType, Long> {
	List<InformationType> findAllByOrderByIdAsc();

	Optional<List<InformationType>> findByElasticsearchStatus(@Param("status") ElasticsearchStatus status);
	Optional<InformationType> findByName(@Param("name") String name);

}
