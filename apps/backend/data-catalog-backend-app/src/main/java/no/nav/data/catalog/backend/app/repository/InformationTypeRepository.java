package no.nav.data.catalog.backend.app.repository;

import no.nav.data.catalog.backend.app.model.InformationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface InformationTypeRepository extends JpaRepository<InformationType, Long> {
	List<InformationType> findAllByOrderByInformationTypeIdAsc();

	Optional<List<InformationType>> findByElasticsearchStatus(@Param("status") String status);

}
