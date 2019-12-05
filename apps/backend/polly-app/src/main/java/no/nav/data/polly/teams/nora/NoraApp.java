package no.nav.data.polly.teams.nora;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NoraApp {

    private String name;
    private String team;
    private String cluster;
    private String zone;
    private String kilde;
}
