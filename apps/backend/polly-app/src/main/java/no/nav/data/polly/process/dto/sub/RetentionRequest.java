package no.nav.data.polly.process.dto.sub;

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
public class RetentionRequest implements Validated {

    private Boolean retentionPlan;
    private Integer retentionMonths;
    private String retentionStart;
    private String retentionDescription;

    @Override
    public void format() {
        setRetentionStart(trimToNull(getRetentionStart()));
        setRetentionDescription(trimToNull(getRetentionDescription()));
    }

    @Override
    public void validate(FieldValidator validator) {

    }
}
