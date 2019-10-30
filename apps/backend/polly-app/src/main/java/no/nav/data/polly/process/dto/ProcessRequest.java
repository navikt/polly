package no.nav.data.polly.process.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.common.validator.FieldValidator;
import no.nav.data.polly.common.validator.RequestElement;
import no.nav.data.polly.process.domain.Process;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldNameConstants
@JsonPropertyOrder({"id,", "name", "purposeCode"})
public class ProcessRequest implements RequestElement {

    private String id;
    private String name;
    private String purposeCode;

    private boolean update;
    private int requestIndex;

    @Override
    public String getIdentifyingFields() {
        return name;
    }

    @Override
    public void validate(FieldValidator validator) {
        validator.checkBlank(Fields.name, name);
        validator.checkCodelist(Fields.purposeCode, purposeCode, ListName.PURPOSE);
    }

    public Process convertToProcess() {
        return Process.builder()
                .generateId()
                .name(name)
                .purposeCode(purposeCode)
                .build();
    }
}
