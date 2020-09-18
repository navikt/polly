package no.nav.data.polly.codelist.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.codehaus.jackson.annotate.JsonPropertyOrder;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"id", "name"})
public class UsedInInstancePurpose {

    private String id;
    private String processId;
    private String purposeCode;
    private String name;

    @JsonIgnore
    public UUID getIdAsUUID() {
        return UUID.fromString(id);
    }
}
