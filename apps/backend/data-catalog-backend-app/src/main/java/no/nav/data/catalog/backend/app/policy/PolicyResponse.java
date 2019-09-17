package no.nav.data.catalog.backend.app.policy;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import no.nav.data.catalog.backend.app.codelist.CodeResponse;
import no.nav.data.catalog.backend.app.elasticsearch.domain.PolicyElasticsearch;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class PolicyResponse {

    private Long policyId;
    private String legalBasisDescription;
    private CodeResponse purpose;

    public PolicyElasticsearch convertToElasticsearch() {
        return PolicyElasticsearch.builder()
                .purpose(getPurpose().getCode())
                .description(getPurpose().getDescription())
                .legalBasis(getLegalBasisDescription())
                .build();
    }
}
