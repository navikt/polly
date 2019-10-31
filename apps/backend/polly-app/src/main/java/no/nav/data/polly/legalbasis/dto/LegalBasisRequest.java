package no.nav.data.polly.legalbasis.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.common.utils.DateUtil;
import no.nav.data.polly.common.validator.FieldValidator;
import no.nav.data.polly.common.validator.Validated;
import no.nav.data.polly.legalbasis.domain.LegalBasis;

@Data
@Builder
@FieldNameConstants
@NoArgsConstructor
@AllArgsConstructor
public class LegalBasisRequest implements Validated {

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
        validator.checkBlank(Fields.gdpr, gdpr);
        validator.checkCodelist(Fields.nationalLaw, nationalLaw, ListName.NATIONAL_LAW);
        validator.checkBlank(Fields.description, description);
        validator.checkDate(Fields.start, start);
        validator.checkDate(Fields.end, end);
    }
}
