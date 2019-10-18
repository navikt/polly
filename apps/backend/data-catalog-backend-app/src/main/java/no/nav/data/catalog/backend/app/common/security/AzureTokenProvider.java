package no.nav.data.catalog.backend.app.common.security;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.microsoft.aad.adal4j.AuthenticationContext;
import com.microsoft.aad.adal4j.AuthenticationResult;
import com.microsoft.aad.adal4j.ClientCredential;
import com.microsoft.azure.spring.autoconfigure.aad.AADAuthenticationProperties;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.catalog.backend.app.common.exceptions.DataCatalogBackendTechnicalException;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import static java.util.Objects.requireNonNull;

@Slf4j
@Service
public class AzureTokenProvider {

    private static final String TOKEN_TYPE = "Bearer ";

    private final Cache<String, AuthenticationResult> accessTokenCache;
    private final AADAuthenticationProperties aadAuthProps;
    private final AuthenticationContext authenticationContext;
    private final ClientCredential credential;
    private final boolean enableClientAuth;

    public AzureTokenProvider(AADAuthenticationProperties aadAuthProps, AuthenticationContext authenticationContext,
            @Value("${security.client.enabled:true}") boolean enableClientAuth) {
        this.aadAuthProps = aadAuthProps;
        this.authenticationContext = authenticationContext;
        this.enableClientAuth = enableClientAuth;
        this.credential = new ClientCredential(aadAuthProps.getClientId(), aadAuthProps.getClientSecret());
        this.accessTokenCache = Caffeine.newBuilder()
                .expireAfter(new AuthResultExpiry())
                .maximumSize(1000).build();
    }

    public String getConsumerToken(String resource, String appIdUri) {
        if (!enableClientAuth) {
            return StringUtils.EMPTY;
        }
        return Credential.getCredential()
                .filter(Credential::hasRefreshToken)
                .map(cred -> TOKEN_TYPE + getAccessTokenForResource(cred.getRefreshToken(), resource))
                .orElseGet(() -> TOKEN_TYPE + getApplicationTokenForResource(appIdUri));
    }

    public String getAccessToken(String refreshToken) {
        return getAccessTokenForResource(refreshToken, aadAuthProps.getClientId());
    }

    private String getApplicationTokenForResource(String resource) {
        log.debug("Getting application token for resource {}", resource);
        return requireNonNull(accessTokenCache.get("credential" + resource, cacheKey -> acquireTokenByCredential(resource))).getAccessToken();
    }

    private String getAccessTokenForResource(String refreshToken, String resource) {
        log.debug("Getting access token for resource {}", resource);
        return requireNonNull(accessTokenCache.get("refresh" + refreshToken + resource, cacheKey -> acquireTokenByRefreshToken(refreshToken, resource))).getAccessToken();
    }

    private AuthenticationResult acquireTokenByRefreshToken(String refreshToken, String resource) {
        try {
            log.debug("Looking up access token for resource {}", resource);
            return authenticationContext.acquireTokenByRefreshToken(refreshToken, credential, resource, null).get();
        } catch (Exception e) {
            throw new DataCatalogBackendTechnicalException("Failed to get access token for refreshToken", e);
        }
    }

    private AuthenticationResult acquireTokenByCredential(String resource) {
        try {
            log.debug("Looking up application token for resource {}", resource);
            return authenticationContext.acquireToken(resource, credential, null).get();
        } catch (Exception e) {
            throw new DataCatalogBackendTechnicalException("Failed to get access token for credential", e);
        }
    }

}
