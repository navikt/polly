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
    private boolean processImplemented;
    private String riskOwner;
    private String riskOwnerFunction;

    public DpiaResponse convertToResponse() {
        return DpiaResponse.builder()
                .needForDpia(getNeedForDpia())
                .refToDpia(getRefToDpia())
                .grounds(getGrounds())
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
                .processImplemented(dpia.isProcessImplemented())
                .riskOwner(dpia.getRiskOwner())
                .riskOwnerFunction(dpia.getRiskOwnerFunction())
                .build();
    }
}
