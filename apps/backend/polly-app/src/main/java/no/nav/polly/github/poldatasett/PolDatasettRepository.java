package no.nav.polly.github.poldatasett;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PolDatasettRepository extends JpaRepository<PolDatasett, Long> {

    Optional<PolDatasett> findFirstByOrderByIdDesc();
}
