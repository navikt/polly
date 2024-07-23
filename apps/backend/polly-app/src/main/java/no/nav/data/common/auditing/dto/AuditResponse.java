package no.nav.data.common.auditing.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.common.auditing.domain.Action;
import no.nav.data.common.auditing.domain.AuditVersion;
import no.nav.data.common.utils.JsonUtils;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"id", "action", "table", "tableId", "time", "user", "data"})
public class AuditResponse {

    private String id;
    private Action action;
    private String table;
    private String tableId;
    private LocalDateTime time;
    private String user;
    private JsonNode data;

    public static AuditResponse buildFrom(AuditVersion av) {
        return AuditResponse.builder()
                .id(av.getId().toString())
                .action(av.getAction())
                .table(av.getTable())
                .tableId(av.getTableId())
                .time(av.getTime())
                .user(av.getUser())
                .data(JsonUtils.toJsonNode(av.getData()))
                .build();
    }

}
