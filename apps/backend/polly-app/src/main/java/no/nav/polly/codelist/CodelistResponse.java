package no.nav.polly.codelist;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonPropertyOrder({"list", "code", "normalizedCode", "description"})
public class CodelistResponse {

    private ListName list;
    private String code;
    private String normalizedCode;
    private String description;
}
