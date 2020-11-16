package no.nav.data.polly.disclosure.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import lombok.experimental.FieldNameConstants;
import no.nav.data.common.validator.FieldValidator;
import no.nav.data.common.validator.Validated;

import java.util.List;

import static no.nav.data.common.utils.StringUtils.formatList;
import static org.apache.commons.lang3.StringUtils.trimToNull;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldNameConstants
public class DisclosureAbroadRequest implements Validated {

    private Boolean abroad;
    @Singular
    private List<String> countries;
    private String refToAgreement;
    private String businessArea;

    @Override
    public void format() {
        if (Boolean.TRUE.equals(abroad)) {
            setCountries(formatList(getCountries()));
            setRefToAgreement(trimToNull(getRefToAgreement()));
            setBusinessArea(trimToNull(getBusinessArea()));
        } else {
            setCountries(null);
            setRefToAgreement(null);
            setBusinessArea(null);
        }
    }

    @Override
    public void validate(FieldValidator validator) {
    }
}
