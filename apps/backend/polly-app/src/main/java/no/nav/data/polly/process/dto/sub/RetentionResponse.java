package no.nav.data.polly.process.dto.sub;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"retentionPlan", "retentionMonths", "retentionStart", "retentionDescription"})
public class RetentionResponse {

    private Boolean retentionPlan;
    private Integer retentionMonths;
    private String retentionStart;
    private String retentionDescription;
}
