package no.nav.polly.github;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "github")
public class GithubProperties {

    private String host;
    private Integer port;
    private String scheme;
    private String webhooksSecret;
    private String keyPath;
    private String appId;
}
