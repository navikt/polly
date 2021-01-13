package no.nav.data.polly.process.dpprocess.dto.sub;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.common.validator.FieldValidator;
import no.nav.data.common.validator.Validated;

import static org.apache.commons.lang3.StringUtils.trimToNull;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DpRetentionRequest implements Validated {

    private Integer retentionMonths;
    private String retentionStart;

    @Override
    public void format() {
        setRetentionStart(trimToNull(getRetentionStart()));
    }

    @Override
    public void validate(FieldValidator validator) {

    }
}
