package no.nav.data.polly.legalbasis.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.common.utils.DateUtil;
import no.nav.data.polly.common.validator.FieldValidator;
import no.nav.data.polly.legalbasis.domain.LegalBasis;

@Data
@Builder
@FieldNameConstants
@NoArgsConstructor
@AllArgsConstructor
public class LegalBasisRequest {

    private static final String LEGAL_BASIS_FIELD_PREFIX = "LegalBasis.";
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

    public void validate(FieldValidator validator) {
        validator.checkBlank(LEGAL_BASIS_FIELD_PREFIX + Fields.gdpr, gdpr);
        validator.checkCodelist(LEGAL_BASIS_FIELD_PREFIX + Fields.nationalLaw, nationalLaw, ListName.NATIONAL_LAW);
        validator.checkBlank(LEGAL_BASIS_FIELD_PREFIX + Fields.description, description);
        validator.checkDate(LEGAL_BASIS_FIELD_PREFIX + Fields.start, start);
        validator.checkDate(LEGAL_BASIS_FIELD_PREFIX + Fields.end, end);
    }
}
