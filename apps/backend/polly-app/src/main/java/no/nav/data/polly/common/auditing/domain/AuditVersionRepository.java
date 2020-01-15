package no.nav.data.polly.common.auditing.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AuditVersionRepository extends JpaRepository<AuditVersion, UUID> {

    List<AuditVersion> findByTableIdOrderByTimeDesc(String tableId);
}
