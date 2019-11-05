package no.nav.data.polly.process.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProcessRepository extends JpaRepository<Process, UUID> {

    Optional<Process> findByNameAndPurposeCode(String name, String purposeCode);

    List<Process> findByName(String name);

    List<Process> findByPurposeCode(String purpose);

    @Query(value = "select p.purposeCode as purposeCode, count(p) as count from Process p group by p.purposeCode")
    List<PurposeCount> countByPurposeCode();
}
