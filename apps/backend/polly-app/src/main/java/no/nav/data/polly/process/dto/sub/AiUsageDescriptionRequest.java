package no.nav.data.polly.process.dto.sub;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;
import no.nav.data.common.utils.DateUtil;
import no.nav.data.common.validator.FieldValidator;
import no.nav.data.common.validator.Validated;
import no.nav.data.polly.process.domain.sub.AiUsageDescription;

import static org.apache.commons.lang3.StringUtils.trimToNull;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldNameConstants
public class AiUsageDescriptionRequest implements Validated {
    private Boolean aiUsage;
    private String description;
    private Boolean reusingPersonalInformation;
    private String startDate;
    private String endDate;
    private String registryNumber;

    @Override
    public void format() {
        setDescription(trimToNull(description));
        setRegistryNumber(trimToNull(registryNumber));
    }

    @Override
    public void validate(FieldValidator validator) {
        validator.checkDate(Fields.startDate, startDate);
        validator.checkDate(Fields.endDate, endDate);
    }

    public AiUsageDescription convertToAiUsageDescription() {
        return AiUsageDescription.builder()
                .aiUsage(aiUsage)
                .description(description)
                .reusingPersonalInformation(reusingPersonalInformation)
                .startDate(DateUtil.parse(startDate))
                .endDate(DateUtil.parse(endDate))
                .registryNumber(registryNumber)
                .build();
    }
}
