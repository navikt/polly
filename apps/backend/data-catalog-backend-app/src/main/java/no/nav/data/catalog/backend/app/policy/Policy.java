package no.nav.data.catalog.backend.app.policy;

import lombok.Builder;
import lombok.NoArgsConstructor;

import java.util.Map;

@Builder
public class Policy {
    private Long policyId;
    private String legalBasisDescription;
    private Map<String, String> purpose;

    public Policy convertFromResponse(PolicyResponse response) {
        this.policyId = response.getPolicyId();
        this.purpose = response.getPurpose();
        this.legalBasisDescription = response.getLegalBasisDescription();
        return this;
    }
}
