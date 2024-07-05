package no.nav.data.polly.process.dpprocess.domain.sub;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.process.dpprocess.dto.sub.DpRetentionRequest;
import no.nav.data.polly.process.dpprocess.dto.sub.DpRetentionResponse;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DpRetention {

    private Integer retentionMonths;
    private String retentionStart;

    // TODO: Snu avhengigheten innover
    public DpRetentionResponse convertToResponse() {
        return DpRetentionResponse.builder()
                .retentionMonths(getRetentionMonths())
                .retentionStart(getRetentionStart())
                .build();
    }

    // TODO: Snu avhengigheten innover
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
