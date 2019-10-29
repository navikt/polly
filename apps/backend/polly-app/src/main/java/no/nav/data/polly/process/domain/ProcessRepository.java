package no.nav.data.polly.process.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProcessRepository extends JpaRepository<Process, UUID> {

    Optional<Process> findByName(String name);

    List<Process> findByPurposeCode(String purpose);
}
