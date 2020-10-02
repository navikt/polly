package no.nav.data.polly.process.dpprocess.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.process.dpprocess.dto.DpRetentionRequest;
import no.nav.data.polly.process.dpprocess.dto.DpRetentionResponse;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DpRetention {

    private Integer retentionMonths;
    private String retentionStart;

    public DpRetentionResponse convertToResponse() {
        return DpRetentionResponse.builder()
                .retentionMonths(getRetentionMonths())
                .retentionStart(getRetentionStart())
                .build();
    }

    public static DpRetention convertRetention(DpRetentionRequest retention) {
        if (retention == null) {
            return new DpRetention();
        }
        return DpRetention.builder()
                .retentionMonths(retention.getRetentionMonths())
                .retentionStart(retention.getRetentionStart())
                .build();
    }
}
