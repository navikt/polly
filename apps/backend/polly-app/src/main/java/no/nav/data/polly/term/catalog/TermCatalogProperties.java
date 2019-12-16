package no.nav.data.polly.term.catalog;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "polly.client.term-catalog")
public class TermCatalogProperties {

    private String url;
    private String getUrl;
    private String searchUrl;

}
