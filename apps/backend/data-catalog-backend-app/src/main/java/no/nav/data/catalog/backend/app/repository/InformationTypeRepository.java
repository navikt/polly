package no.nav.data.catalog.backend.app.repository;

import no.nav.data.catalog.backend.app.model.InformationType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InformationTypeRepository extends JpaRepository<InformationType, Long> {
	List<InformationType> findAllByOrderByInformationTypeIdAsc();
}
