package no.nav.data.polly.settings.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;
import no.nav.data.common.storage.domain.ChangeStamp;
import no.nav.data.common.storage.domain.GenericStorageData;
import no.nav.data.common.validator.FieldValidator;
import no.nav.data.common.validator.Validated;

@FieldNameConstants
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Settings implements GenericStorageData, Validated {

    private String defaultProcessDocument;
    private String frontpageMessage;
    private ChangeStamp changeStamp;

    @Override
    public void validate(FieldValidator validator) {
        validator.checkUUID(Fields.defaultProcessDocument, defaultProcessDocument);
    }
}
