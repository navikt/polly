package no.nav.data.integration.etterlevelse.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = "data")
@JsonPropertyOrder({"list", "code", "shortName", "description", "data"})
public class EtterlevelseCodeListResponse {
    private EtterlevelseListName list;
    private String code;
    private String shortName;
    private String description;
    private JsonNode data;

    @Override
    public String toString() {
        return code + " - " + shortName + " - " + description;
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public Boolean isInvalidCode() {
        return description == null ? Boolean.TRUE : null;
    }
}
