package no.nav.data.polly.process.dto.sub;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;
import no.nav.data.common.validator.FieldValidator;
import no.nav.data.common.validator.Validated;

import java.util.regex.Pattern;

import static org.apache.commons.lang3.StringUtils.trimToNull;
import static org.apache.commons.lang3.StringUtils.upperCase;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldNameConstants
public class DpiaRequest implements Validated {

    public static final Pattern NAV_IDENT_PATTERN = Pattern.compile("[A-Z][0-9]{6}");

    private Boolean needForDpia;
    private String refToDpia;
    private String grounds;
    private boolean processImplemented;
    private String riskOwner;
    private String riskOwnerFunction;

    @Override
    public void format() {
        setGrounds(trimToNull(getGrounds()));
        setRefToDpia(trimToNull(getRefToDpia()));
        setRiskOwner(upperCase(trimToNull(getRiskOwner())));
        setRiskOwnerFunction(trimToNull(getRiskOwnerFunction()));
    }

    @Override
    public void validate(FieldValidator validator) {
        validator.checkPattern(Fields.riskOwner, riskOwner, NAV_IDENT_PATTERN);
    }
}
