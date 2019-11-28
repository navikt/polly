package no.nav.data.polly.elasticsearch;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "elasticsearch")
public class ElasticsearchProperties {

    private String host;
    private int port;
    private String schema;
    private String index;
    private String user;
    private String password;
    private int indexingIntervalSeconds;
    private boolean deleteOnly;

    public boolean indexingDisabled() {
        return indexingIntervalSeconds <= 0;
    }
}
