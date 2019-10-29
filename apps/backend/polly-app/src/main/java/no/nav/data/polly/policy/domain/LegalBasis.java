package no.nav.data.polly.policy.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.elasticsearch.dto.LegalBasisElasticSearch;
import no.nav.data.polly.policy.dto.LegalBasisResponse;

import java.io.Serializable;
import javax.validation.constraints.NotNull;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LegalBasis implements Serializable {

    @NotNull
    private String gdpr;
    private String nationalLaw;
    @NotNull
    private String description;

    public LegalBasisResponse convertToResponse() {
        return new LegalBasisResponse(gdpr, nationalLaw, description);
    }

    public LegalBasisElasticSearch convertToElasticsearch() {
        return LegalBasisElasticSearch.builder()
                .gdpr(gdpr)
                .nationalLaw(nationalLaw)
                .description(description)
                .build();
    }
}
