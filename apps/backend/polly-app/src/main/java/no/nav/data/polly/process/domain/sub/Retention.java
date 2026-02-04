package no.nav.data.polly.process.domain.sub;

import java.io.Serial;
import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.process.dto.sub.RetentionRequest;
import no.nav.data.polly.process.dto.sub.RetentionResponse;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Retention implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private Boolean retentionPlan;
    private Integer retentionMonths;
    private String retentionStart;
    private String retentionDescription;

    // TODO: Snu avhengigheten innover
    public RetentionResponse convertToResponse() {
        return RetentionResponse.builder()
                .retentionPlan(getRetentionPlan())
                .retentionMonths(getRetentionMonths())
                .retentionStart(getRetentionStart())
                .retentionDescription(getRetentionDescription())
                .build();
    }

    // TODO: Snu avhengigheten innover
    public static Retention convertRetention(RetentionRequest retention) {
        if (retention == null) {
            return new Retention();
        }
        return Retention.builder()
                .retentionPlan(retention.getRetentionPlan())
                .retentionMonths(retention.getRetentionMonths())
                .retentionStart(retention.getRetentionStart())
                .retentionDescription(retention.getRetentionDescription())
                .build();
    }
}
