package no.nav.data.polly.teams.nora;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NoraMember {

    @JsonProperty("_id")
    private String id;
    private String azureId;
    private String name;
    private boolean isManager;
    private String email;

}
