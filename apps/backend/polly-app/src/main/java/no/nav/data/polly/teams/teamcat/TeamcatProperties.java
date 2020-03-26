package no.nav.data.polly.teams.teamcat;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "polly.client.resource-teamcat")
public class TeamcatProperties {

    private String url;
    private String getUrl;
    private String searchUrl;

}
