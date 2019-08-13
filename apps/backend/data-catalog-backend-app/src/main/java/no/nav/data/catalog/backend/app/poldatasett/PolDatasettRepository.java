package no.nav.data.catalog.backend.app.poldatasett;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PolDatasettRepository extends JpaRepository<PolDatasett, Long> {

    Optional<PolDatasett> findFirstByOrderByIdDesc();
}
