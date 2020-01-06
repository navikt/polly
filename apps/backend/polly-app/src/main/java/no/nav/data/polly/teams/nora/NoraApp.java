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
public class NoraApp {

    @JsonProperty("_id")
    private String id;
    private String name;
    private String team;
    private String cluster;
    private String zone;
    private String kilde;
    @JsonProperty("created_at")
    private String createdAt;
    @JsonProperty("updated_at")
    private String updatedAt;
}
