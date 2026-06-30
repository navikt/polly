package no.nav.data.integration.etterlevelse;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "client.etterlevelse")
public class EtterlevelseClientProperties {
    private String url;
}
