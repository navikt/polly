package no.nav.data.polly.process.domain.sub;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.process.dto.sub.DpiaRequest;
import no.nav.data.polly.process.dto.sub.DpiaResponse;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

import static no.nav.data.common.utils.StreamUtils.copyOf;

/**
 * Data protection impact assessment - PVK
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Dpia implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private Boolean needForDpia;
    private String refToDpia;
    private String grounds;
    private List<NoDpiaReason> noDpiaReasons;
    private boolean processImplemented;
    private String riskOwner;
    private String riskOwnerFunction;

    // TODO: Snu avhengigheten innover
    public DpiaResponse convertToResponse() {
        return DpiaResponse.builder()
                .needForDpia(getNeedForDpia())
                .refToDpia(getRefToDpia())
                .grounds(getGrounds())
                .noDpiaReasons(copyOf(getNoDpiaReasons()))
                .processImplemented(isProcessImplemented())
                .riskOwner(getRiskOwner())
                .riskOwnerFunction(getRiskOwnerFunction())
                .build();
    }

    // TODO: Snu avhengigheten innover
    public static Dpia convertDpia(DpiaRequest dpia) {
        if (dpia == null) {
            return new Dpia();
        }
        return Dpia.builder()
                .needForDpia(dpia.getNeedForDpia())
                .refToDpia(dpia.getRefToDpia())
                .grounds(dpia.getGrounds())
                .noDpiaReasons(copyOf(dpia.getNoDpiaReasons()))
                .processImplemented(dpia.isProcessImplemented())
                .riskOwner(dpia.getRiskOwner())
                .riskOwnerFunction(dpia.getRiskOwnerFunction())
                .build();
    }
}
