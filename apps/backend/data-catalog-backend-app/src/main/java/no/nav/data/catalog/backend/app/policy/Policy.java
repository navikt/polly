package no.nav.data.catalog.backend.app.policy;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.Map;

@Builder
@NoArgsConstructor
@Getter
@AllArgsConstructor
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

    public Map<String, Object> convertToMap() {
        Map<String, Object> jsonMap = new HashMap<>();
        jsonMap.put("policyId", policyId);
        jsonMap.put("legalBasisDescription", legalBasisDescription);
        jsonMap.put("purpose", purpose);
        return jsonMap;
    }
}
