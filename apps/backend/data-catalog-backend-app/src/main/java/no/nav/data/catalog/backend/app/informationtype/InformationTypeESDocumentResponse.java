package no.nav.data.catalog.backend.app.informationtype;

import no.nav.data.catalog.backend.app.policy.PolicyResponse;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class InformationTypeESDocumentResponse {
    private List<PolicyResponse> policies;

    InformationTypeESDocumentResponse(InformationTypeESDocument informationTypeESDocument) {
        this.policies = informationTypeESDocument.getPolicies();
    }

    Map<String, Object> convertToMap( Map<String, Object> jsonMapFromInformationTypeResponse) {
        List<Map> policyMaps = new ArrayList<>();
        if (policies != null) {
            for (PolicyResponse policy : policies) {
                Map<String, Object> policyMap = policy.convertToMap();
                policyMaps.add(policyMap);
            }
            jsonMapFromInformationTypeResponse.put("policies", policyMaps);
        }
        return jsonMapFromInformationTypeResponse;
    }
}
