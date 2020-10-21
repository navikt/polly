package no.nav.data.polly.process.domain.sub;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.process.dto.sub.DpiaRequest;
import no.nav.data.polly.process.dto.sub.DpiaResponse;

/**
 * Data protection impact assessment - PVK
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Dpia {

    private Boolean needForDpia;
    private String refToDpia;
    private String grounds;
    private NoDpiaReason noDpiaReason;
    private boolean processImplemented;
    private String riskOwner;
    private String riskOwnerFunction;

    public DpiaResponse convertToResponse() {
        return DpiaResponse.builder()
                .needForDpia(getNeedForDpia())
                .refToDpia(getRefToDpia())
                .grounds(getGrounds())
                .noDpiaReason(getNoDpiaReason())
                .processImplemented(isProcessImplemented())
                .riskOwner(getRiskOwner())
                .riskOwnerFunction(getRiskOwnerFunction())
                .build();
    }

    public static Dpia convertDpia(DpiaRequest dpia) {
        if (dpia == null) {
            return new Dpia();
        }
        return Dpia.builder()
                .needForDpia(dpia.getNeedForDpia())
                .refToDpia(dpia.getRefToDpia())
                .grounds(dpia.getGrounds())
                .noDpiaReason(dpia.getNoDpiaReason())
                .processImplemented(dpia.isProcessImplemented())
                .riskOwner(dpia.getRiskOwner())
                .riskOwnerFunction(dpia.getRiskOwnerFunction())
                .build();
    }
}
