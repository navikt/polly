package no.nav.data.common.auditing.domain;

import no.nav.data.common.auditing.dto.AuditMetadata;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
            select * from audit_version av
            where table_name = ?1 and action = ?2
                and (?2 = 'DELETE' or not exists (select 1 from audit_version av2 where av2.table_id = av.table_id and av2.action = 'DELETE'))
           """,
           countQuery = """
            select count(1) from audit_version av
            where table_name = ?1 and action = ?2
                and (?2 = 'DELETE' or not exists (select 1 from audit_version av2 where av2.table_id = av.table_id and av2.action = 'DELETE'))
           """, 
           nativeQuery = true)
    Page<AuditVersion> findForTableAndAction(String table, String action, Pageable page);

    @Query(value = """
            select cast(audit_id as text) as id, time, action, table_name as tableName, table_id as tableId
            from audit_version where audit_id in (
                select distinct on (table_id) audit_id
                from audit_version
                where table_name = 'PROCESS' 
                    and user_id = ?1
                    and exists (select 1 from process where process_id = cast(table_id as uuid))
                order by table_id, time desc
            )
            order by time desc
            limit ?2
           """, nativeQuery = true)
    List<AuditMetadata> getLastChangedProcessesByUser(String userId, int limit);

}
