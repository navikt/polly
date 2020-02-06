package no.nav.data.polly.common.auditing.event;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.common.auditing.domain.Action;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"id", "name", "action", "table", "tableId", "time"})
public class EventResponse {

    private String id;
    private String name;
    private Action action;
    private String table;
    private String tableId;
    private LocalDateTime time;

}
