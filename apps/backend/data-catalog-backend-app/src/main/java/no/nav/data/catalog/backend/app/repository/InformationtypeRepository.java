package no.nav.data.catalog.backend.app.repository;

import no.nav.data.catalog.backend.app.model.Informationtype;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InformationtypeRepository extends JpaRepository<Informationtype, Long> {
	public List<Informationtype> findAllByOrderByInformationtypeIdAsc();
}
