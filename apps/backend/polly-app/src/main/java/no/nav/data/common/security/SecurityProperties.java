package no.nav.data.common.security;

import lombok.Data;
import no.nav.data.Constants;
import org.apache.commons.lang3.StringUtils;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;

import static no.nav.data.common.utils.StreamUtils.safeStream;
import static no.nav.data.common.utils.StreamUtils.tryFind;

@Data
@Configuration
@ConfigurationProperties(prefix = "polly.security")
public class SecurityProperties {

    private boolean enabled = true;
    private String encKey = "";
    private List<String> writeGroups;
    private List<String> superGroups;
    private List<String> adminGroups;
    private List<String> redirectUris;
    private String env;

    public boolean isValidRedirectUri(String uri) {
        return uri == null || safeStream(redirectUris).anyMatch(origin -> StringUtils.startsWithIgnoreCase(uri, origin));
    }

    public String findBaseUrl() {
        return tryFind(getRedirectUris(), uri -> uri.contains(Constants.PREF_DOMAIN)).orElse(getRedirectUris().get(0));
    }

    public boolean isDev() {
        return env.equals(Constants.DEV_ENV);
    }

    public boolean isProd() {
        return env.equals(Constants.PROD_ENV);
    }

}
