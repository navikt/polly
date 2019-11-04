package no.nav.data.polly.term.dto;

import com.fasterxml.jackson.databind.JsonNode;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;
import no.nav.data.polly.common.validator.FieldValidator;
import no.nav.data.polly.common.validator.RequestElement;

import static no.nav.data.polly.common.swagger.SwaggerConfig.JSON;


@Data
@Builder
@FieldNameConstants
@NoArgsConstructor
@AllArgsConstructor
public class TermRequest implements RequestElement {

    private String name;
    private String description;
    @ApiModelProperty(dataType = JSON, value = "json", example = "{\"field\": \"value\"}")
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
