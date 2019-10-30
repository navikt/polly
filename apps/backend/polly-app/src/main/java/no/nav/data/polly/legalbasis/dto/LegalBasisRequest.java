package no.nav.data.polly.legalbasis.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.common.utils.DateUtil;
import no.nav.data.polly.legalbasis.domain.LegalBasis;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LegalBasisRequest {

    private String gdpr;
    private String nationalLaw;
    private String description;
    private String start;
    private String end;

    public LegalBasis convertToLegalBasis() {
        return LegalBasis.builder()
                .gdpr(gdpr)
                .nationalLaw(nationalLaw)
                .description(description)
                .start(DateUtil.parseStart(start))
                .end(DateUtil.parseEnd(end))
                .build();
    }
}
