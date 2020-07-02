package no.nav.data.common.auditing.domain;

import org.springframework.data.domain.Example;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

import static org.springframework.data.domain.ExampleMatcher.matching;

@Repository
public interface AuditVersionRepository extends JpaRepository<AuditVersion, UUID> {

    List<AuditVersion> findByTableIdOrderByTimeDesc(String tableId);

    static Example<AuditVersion> exampleFrom(AuditVersion example) {
        return Example.of(example, matching().withIgnorePaths("id", "time"));
    }
}
