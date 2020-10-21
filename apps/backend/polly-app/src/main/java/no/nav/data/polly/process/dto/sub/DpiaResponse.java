package no.nav.data.polly.process.dto.sub;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.process.domain.sub.NoDpiaReason;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"needForDpia", "refToDpia", "grounds", "noDpiaReason", "processImplemented", "riskOwner", "riskOwnerFunction"})
public class DpiaResponse {

    private Boolean needForDpia;
    private String refToDpia;
    private String grounds;
    private NoDpiaReason noDpiaReason;
    private boolean processImplemented;
    private String riskOwner;
    private String riskOwnerFunction;
}
