package no.nav.data.polly.term.dto;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;
import no.nav.data.polly.common.validator.FieldValidator;
import no.nav.data.polly.common.validator.RequestElement;


@Data
@Builder
@FieldNameConstants
@NoArgsConstructor
@AllArgsConstructor
public class TermRequest implements RequestElement {

    private String name;
    private String description;
    private JsonNode data;

    private int requestIndex;
    private boolean update;

    @Override
    public String getIdentifyingFields() {
        return name;
    }

    @Override
    public void validate(FieldValidator validator) {
        validator.checkBlank(Fields.name, name);
        validator.checkBlank(Fields.description, description);
    }
}
