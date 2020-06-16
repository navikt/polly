package no.nav.data.polly.process.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.common.validator.FieldValidator;
import no.nav.data.polly.common.validator.Validated;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldNameConstants
public class ProcessStateRequest implements Validated {

    public enum ProcessState {
        YES, NO, UNKNOWN
    }

    public enum ProcessField {
        DPIA, PROFILING, AUTOMATION, RETENTION, ALL_INFO_TYPES(false), MISSING_LEGBAS(false), MISSING_ART6(false), MISSING_ART9(false);

        public final boolean canBeUnknown;

        ProcessField() {
            canBeUnknown = true;
        }

        ProcessField(boolean canBeUnknown) {
            this.canBeUnknown = canBeUnknown;
        }
    }

    private ProcessField processField;
    private ProcessState processState;
    private String department;

    @Override
    public void validate(FieldValidator validator) {
        validator.checkRequiredEnum(Fields.processField, processField);
        validator.checkRequiredEnum(Fields.processState, processState);
        validator.checkCodelist(Fields.department, department, ListName.DEPARTMENT);
        if (processState == ProcessState.UNKNOWN && processField != null && !processField.canBeUnknown) {
            validator.addError(Fields.processState, processState.name(), "INVALID_STATE_FOR_FIELD", " is invalid for %s".formatted(processField));
        }
    }

}
