package no.nav.data.polly.process.dto.sub;


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

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldNameConstants
public class DataProcessingRequest implements Validated {

    private Boolean dataProcessor;
    @Singular
    private List<String> processors;

    @Override
    public void format() {
        setProcessors(formatList(getProcessors()));
        if (Boolean.FALSE.equals(getDataProcessor())) {
            setProcessors(List.of());
        }
    }

    @Override
    public void validate(FieldValidator validator) {
        processors.forEach(processor -> validator.checkUUID(Fields.processors, processor));
    }
}
