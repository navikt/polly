package no.nav.data.polly.process.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.process.domain.ProcessAuditField;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"field", "fieldDisplayName", "from", "to", "totalProcesses", "changedCount"})
public class ProcessFieldChangeSummaryResponse {

    private ProcessAuditField field;
    private String fieldDisplayName;
    private LocalDate from;
    private LocalDate to;
    private long totalProcesses;
    private long changedCount;
}
