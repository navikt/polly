package no.nav.data.polly.settings.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;
import no.nav.data.polly.common.validator.FieldValidator;
import no.nav.data.polly.common.validator.Validated;

@FieldNameConstants
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Settings implements Validated {

    private String defaultProcessDocument;

    @Override
    public void validate(FieldValidator validator) {
        validator.checkUUID(Fields.defaultProcessDocument, defaultProcessDocument);
    }
}
