package no.nav.data.polly.term.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.databind.JsonNode;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import static no.nav.data.polly.common.swagger.SwaggerConfig.JSON;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"id", "name", "description", "data"})
public class TermResponse {

    private String id;
    private String name;
    private String description;
    @ApiModelProperty(dataType = JSON, value = "json", example = "{\"field\": \"value\"}")
    private JsonNode data;
}
