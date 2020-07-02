package no.nav.data.common.security.azure;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties("azure.activedirectory")
@Data
@Slf4j
public class AADAuthenticationProperties {

    private String tenantId;
    private String clientId;
    private String clientSecret;
    private String appIdUri;

    private String aadSigninUri;
    private String aadKeyDiscoveryUri;

}
