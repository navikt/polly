package no.nav.data.polly.process.dto.sub;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import no.nav.data.polly.process.domain.sub.NoDpiaReason;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"needForDpia", "refToDpia", "grounds", "noDpiaReasons", "processImplemented", "riskOwner", "riskOwnerFunction"})
public class DpiaResponse {

    private Boolean needForDpia;
    private String refToDpia;
    private String grounds;
    @Singular
    private List<NoDpiaReason> noDpiaReasons;
    private boolean processImplemented;
    private String riskOwner;
    private String riskOwnerFunction;
}
