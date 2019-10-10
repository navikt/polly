package no.nav.data.catalog.backend.app.common;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties("nav")
public class NavProperties {

    private String proxyHost;
    private Integer proxyPort;

}
