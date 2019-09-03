package no.nav.data.catalog.backend.app.elasticsearch;

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
    private String token;
    private String pathPrefix;
}
