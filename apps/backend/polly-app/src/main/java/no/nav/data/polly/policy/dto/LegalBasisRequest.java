package no.nav.data.polly.policy.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.policy.domain.LegalBasis;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class LegalBasisRequest {

    private String gdpr;
    private String nationalLaw;
    private String description;

    public LegalBasis convertToLegalBasis() {
        return LegalBasis.builder()
                .gdpr(gdpr)
                .nationalLaw(nationalLaw)
                .description(description)
                .build();
    }
}
