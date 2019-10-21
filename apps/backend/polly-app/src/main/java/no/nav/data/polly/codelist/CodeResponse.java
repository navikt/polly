package no.nav.data.polly.codelist;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Shorter class to be used in other objects when not interacting with codelist directly
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonPropertyOrder({"code", "description"})
public class CodeResponse {

    private String code;
    private String description;
}
