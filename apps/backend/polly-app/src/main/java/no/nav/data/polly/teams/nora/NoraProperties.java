package no.nav.data.polly.teams.nora;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "polly.client.nora")
public class NoraProperties {

    private String url;
    private String teamsUrl;
    private String teamUrl;

}
