package no.nav.data.polly.process.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;
import no.nav.data.common.validator.FieldValidator;
import no.nav.data.common.validator.Validated;
import no.nav.data.polly.alert.domain.AlertEventType;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.process.domain.ProcessStatus;

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
        DPIA, PROFILING, AUTOMATION, RETENTION, RETENTION_DATA,
        DATA_PROCESSOR, DATA_PROCESSOR_OUTSIDE_EU,

        // Not a real true/false/null field, see repository
        DATA_PROCESSOR_AGREEMENT_EMPTY,

        // Alert events
        EXCESS_INFO(true),
        USES_ALL_INFO_TYPE(true),
        MISSING_LEGAL_BASIS(true),
        MISSING_ARTICLE_6(true),
        MISSING_ARTICLE_9(true);

        public final boolean alertEvent;

        ProcessField() {
            this(false);
        }

        ProcessField(boolean alertEvent) {
            this.alertEvent = alertEvent;
            if (alertEvent) {
                AlertEventType.valueOf(name());
            }
        }
    }

    public enum ProcessStatusFilter {
        COMPLETED(ProcessStatus.COMPLETED),
        IN_PROGRESS(ProcessStatus.IN_PROGRESS),
        ALL;

        public final ProcessStatus processStatus;

        ProcessStatusFilter(ProcessStatus processStatus) {
            this.processStatus = processStatus;
        }

        ProcessStatusFilter() {
            processStatus = null;
        }
    }

    private ProcessField processField;
    private ProcessState processState;
    private ProcessStatusFilter processStatus;
    private String department;

    @Override
    public void validate(FieldValidator validator) {
        validator.checkRequiredEnum(Fields.processField, processField);
        validator.checkRequiredEnum(Fields.processState, processState);
        validator.checkCodelist(Fields.department, department, ListName.DEPARTMENT);
    }

    @Override
    public void format() {
        processStatus = processStatus != null ? processStatus : ProcessStatusFilter.ALL;
    }

}
