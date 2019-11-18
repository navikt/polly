package no.nav.data.polly.codelist.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.codelist.domain.ListName;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonPropertyOrder({"list", "code", "shortName", "description"})
public class CodelistResponse {

    private ListName list;
    private String code;
    private String shortName;
    private String description;

    @Override
    public String toString() {
        return code + " - " + shortName + " - " + description;
    }

    @JsonInclude(Include.NON_NULL)
    public Boolean isInvalidCode() {
        return description == null ? Boolean.TRUE : null;
    }
}
