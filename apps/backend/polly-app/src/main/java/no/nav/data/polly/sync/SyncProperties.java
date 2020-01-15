package no.nav.data.polly.sync;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "polly.sync")
public class SyncProperties {

    private int intervalSeconds;

    public boolean indexingDisabled() {
        return intervalSeconds <= 0;
    }
}
