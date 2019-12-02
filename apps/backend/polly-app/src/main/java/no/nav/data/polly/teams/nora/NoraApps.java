package no.nav.data.polly.teams.nora;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NoraApps {

    private List<NoraApp> apps;
    private String message;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class NoraApp {

        private String app;
        private String cluster;
        private String team;
        private String zone;
    }
}
