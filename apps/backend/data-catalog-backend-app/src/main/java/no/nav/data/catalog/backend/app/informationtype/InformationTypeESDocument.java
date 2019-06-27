package no.nav.data.catalog.backend.app.informationtype;

import lombok.Data;
import no.nav.data.catalog.backend.app.policy.PolicyResponse;

import java.util.List;
import java.util.Map;

@Data
public class InformationTypeESDocument {
    private InformationTypeResponse informationTypeResponse;
    private List<PolicyResponse> policies;

    Map<String, Object> convertToMap() {
        return this.convertToResponse().convertToMap(this.informationTypeResponse.convertToMap());
    }

    public InformationTypeESDocumentResponse convertToResponse() {
        return new InformationTypeESDocumentResponse(this);
    }
}
