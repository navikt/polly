package no.nav.data.polly.codelist.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"id", "name", "processId", "purposes"})
public class UsedInInstancePurpose {

    private String id;
    private String name;
    private String processId;
    private List<String> purposes;

    @JsonIgnore
    public UUID getIdAsUUID() {
        return UUID.fromString(id);
    }
}
