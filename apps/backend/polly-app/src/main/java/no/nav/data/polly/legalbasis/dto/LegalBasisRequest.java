package no.nav.data.polly.legalbasis.dto;

import io.swagger.annotations.ApiModelProperty;
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

import static no.nav.data.polly.common.swagger.SwaggerConfig.LOCAL_DATE;
import static no.nav.data.polly.common.utils.DateUtil.DEFAULT_END;
import static no.nav.data.polly.common.utils.DateUtil.DEFAULT_START;
import static no.nav.data.polly.common.utils.StringUtils.toUpperCaseAndTrim;

@Data
@Builder
@FieldNameConstants
@NoArgsConstructor
@AllArgsConstructor
public class LegalBasisRequest implements Validated {

    @ApiModelProperty(value = "Codelist GDPR")
    private String gdpr;
    @ApiModelProperty(value = "Codelist NATIONAL_LAW")
    private String nationalLaw;
    private String description;
    @ApiModelProperty(dataType = LOCAL_DATE, example = DEFAULT_START)
    private String start;
    @ApiModelProperty(dataType = LOCAL_DATE, example = DEFAULT_END)
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

    @Override
    public void format() {
        setGdpr(toUpperCaseAndTrim(getGdpr()));
        setNationalLaw(toUpperCaseAndTrim(getNationalLaw()));
    }

    @Override
    public void validate(FieldValidator validator) {
        validator.checkRequiredCodelist(Fields.gdpr, gdpr, ListName.GDPR_ARTICLE);
        validator.checkCodelist(Fields.nationalLaw, nationalLaw, ListName.NATIONAL_LAW);
        validator.checkDate(Fields.start, start);
        validator.checkDate(Fields.end, end);
    }
}
