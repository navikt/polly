package no.nav.data.catalog.backend.app.policy;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import no.nav.data.catalog.backend.app.informationtype.InformationType;

import java.util.Map;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class PolicyResponse {
    private Long policyId;
    private InformationType informationType;
    private String legalBasisDescription;
    private Map<String, String> purpose;
}
