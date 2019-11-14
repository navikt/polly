package no.nav.data.polly.term.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.databind.JsonNode;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

import static no.nav.data.polly.common.swagger.SwaggerConfig.JSON;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"id", "name", "description", "data"})
public class TermResponse {

    private UUID id;
    private String name;
    private String description;
    @JsonInclude(Include.NON_NULL)
    @ApiModelProperty(dataType = JSON, value = "json", example = "{\"field\": \"value\"}")
    private JsonNode data;
}
