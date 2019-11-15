package no.nav.data.polly.common.security;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Data
@Configuration
@ConfigurationProperties(prefix = "polly.security")
public class SecurityProperties {

    private boolean enabled = true;
    private boolean clientEnabled = true;
    private String allowedAppIdMappings = "";
    private String encKey = "";
    private List<String> writeGroups;
    private List<String> adminGroups;

}
