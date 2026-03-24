package no.nav.data.common.auditing;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import no.nav.data.common.auditing.domain.AuditVersionRepository;
import no.nav.data.common.auditing.dto.AuditMetadata;
import no.nav.data.polly.process.domain.ProcessAuditField;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditVersionRepository auditVersionRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public List<AuditMetadata> lastEditedProcessesByUser(String user) {
        return auditVersionRepository.getLastChangedProcessesByUser(user, 20);
    }

    public long countProcessesWithFieldChanges(ProcessAuditField field, LocalDate from, LocalDate to) {
        // field.jsonKey comes from a validated enum, not user input - safe to embed in SQL
        String sql = """
                WITH ranked AS (
                    SELECT
                        table_id,
                        time,
                        DATA #> '{data,%s}' AS field_value,
                        LAG(DATA #> '{data,%s}') OVER (PARTITION BY table_id ORDER BY time) AS prev_field_value
                    FROM audit_version
                    WHERE table_name = 'PROCESS' AND action != 'DELETE'
                )
                SELECT COUNT(DISTINCT table_id)
                FROM ranked
                WHERE time >= :from AND time < :to
                  AND prev_field_value IS NOT NULL
                  AND field_value::text IS DISTINCT FROM prev_field_value::text
                """.formatted(field.jsonKey, field.jsonKey);

        LocalDateTime fromDt = from.atStartOfDay();
        LocalDateTime toDt = to.plusDays(1).atStartOfDay();

        return ((Number) entityManager.createNativeQuery(sql)
                .setParameter("from", fromDt)
                .setParameter("to", toDt)
                .getSingleResult()).longValue();
    }

    public long countProcessesAtEndOfPeriod(LocalDate to) {
        String sql = """
                SELECT COUNT(DISTINCT table_id)
                FROM audit_version
                WHERE table_name = 'PROCESS'
                  AND time < :to
                  AND table_id NOT IN (
                      SELECT table_id FROM audit_version
                      WHERE table_name = 'PROCESS' AND action = 'DELETE' AND time < :to
                  )
                """;
        LocalDateTime toDt = to.plusDays(1).atStartOfDay();
        return ((Number) entityManager.createNativeQuery(sql)
                .setParameter("to", toDt)
                .getSingleResult()).longValue();
    }
}
