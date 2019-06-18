package no.nav.data.catalog.backend.app.informationtype;

import lombok.Data;
import no.nav.data.catalog.backend.app.policy.Policy;

import java.util.List;
import java.util.Map;

@Data
public class InformationTypeESDocument {
    private InformationType informationType;
    private List<Policy> policies;

    Map<String, Object> convertToMap() {
        return this.convertToResponse().convertToMap();
    }

    public InformationTypeESDocumentResponse convertToResponse() {
        return new InformationTypeESDocumentResponse(this);
    }
}
