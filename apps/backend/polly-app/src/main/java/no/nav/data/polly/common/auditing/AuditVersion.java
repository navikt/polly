package no.nav.data.polly.common.auditing;

import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.common.auditing.dto.AuditResponse;
import org.hibernate.annotations.Type;

import java.time.LocalDateTime;
import java.util.UUID;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.Table;

@Data
@NoArgsConstructor
@Entity
@Table(name = "AUDIT_VERSION")
public class AuditVersion {

    @Id
    @Type(type = "pg-uuid")
    @Column(name = "AUDIT_ID")
    private UUID id = UUID.randomUUID();

    @Enumerated(EnumType.STRING)
    @Column(name = "ACTION", nullable = false, updatable = false)
    private Action action;

    @Column(name = "TABLE_NAME", nullable = false, updatable = false)
    private String table;

    @Column(name = "TABLE_ID", nullable = false, updatable = false)
    private String tableId;

    @Column(name = "TIME", nullable = false, updatable = false)
    private LocalDateTime time = LocalDateTime.now();

    @Type(type = "jsonb")
    @Column(name = "DATA", nullable = false, updatable = false)
    private String data;

    public AuditVersion(Action action, String table, String tableId, String data) {
        this.action = action;
        this.table = table;
        this.tableId = tableId;
        this.data = data;
    }

    public AuditResponse convertToResponse() {
        return AuditResponse.builder()
                .id(id.toString())
                .action(action)
                .table(table)
                .tableId(tableId)
                .time(time)
                .data(data)
                .build();
    }
}
