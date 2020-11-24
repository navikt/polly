package no.nav.data.common.auditing.domain;

import no.nav.data.common.auditing.dto.AuditMetadata;
import org.springframework.data.domain.Example;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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

    @Query(value = """
            select distinct on (table_id)
             cast(audit_id as text) as id, time, action, table_name as tableName, table_id as tableId
             from audit_version
             where table_name = ?1 
             and user_id = ?2
             and exists (select 1 from process where process_id = cast(table_id as uuid))
             order by table_id, time desc
             limit ?3
            """, nativeQuery = true)
    List<AuditMetadata> getLastChangesByUser(String table, String userId, int limit);

}
