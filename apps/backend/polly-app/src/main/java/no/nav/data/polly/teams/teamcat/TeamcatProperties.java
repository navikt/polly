package no.nav.data.polly.teams.teamcat;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "polly.client.teamcat")
public class TeamcatProperties {

    private String url;
    private String teamsUrl;
    private String productAreasUrl;
    private String resourceUrl;
    private String resourceSearchUrl;

}
