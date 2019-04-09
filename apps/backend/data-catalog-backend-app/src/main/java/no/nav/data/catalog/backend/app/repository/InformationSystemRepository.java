package no.nav.data.catalog.backend.app.repository;

import no.nav.data.catalog.backend.app.model.InformationSystem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InformationSystemRepository extends JpaRepository<InformationSystem, Long> {
}
