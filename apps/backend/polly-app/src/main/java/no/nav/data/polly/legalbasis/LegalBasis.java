package no.nav.data.polly.legalbasis;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.elasticsearch.domain.LegalBasisElasticSearch;

import javax.validation.constraints.NotNull;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LegalBasis {

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
