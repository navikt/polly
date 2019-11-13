package no.nav.data.polly.common.security;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.microsoft.aad.adal4j.AuthenticationContext;
import com.microsoft.aad.adal4j.AuthenticationResult;
import com.microsoft.aad.adal4j.ClientCredential;
import com.microsoft.aad.adal4j.UserAssertion;
import com.microsoft.azure.spring.autoconfigure.aad.AADAuthenticationProperties;
import com.microsoft.azure.spring.autoconfigure.aad.AzureADGraphClient;
import com.microsoft.azure.spring.autoconfigure.aad.ServiceEndpoints;
import com.microsoft.azure.spring.autoconfigure.aad.ServiceEndpointsProperties;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.common.exceptions.PollyTechnicalException;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.time.Duration;
import java.util.Set;

import static java.util.Objects.requireNonNull;

@Slf4j
@Service
public class AzureTokenProvider {

    private static final String TOKEN_TYPE = "Bearer ";

    private final Cache<String, AuthenticationResult> accessTokenCache;
    private final Cache<String, Set<GrantedAuthority>> grantedAuthorityCache;

    private final AuthenticationContext authenticationContext;
    private final AzureADGraphClient graphClient;

    private final ServiceEndpoints serviceEndpoints;
    private final AADAuthenticationProperties aadAuthProps;
    private final ClientCredential azureCredential;
    private final boolean enableClientAuth;

    public AzureTokenProvider(AADAuthenticationProperties aadAuthProps, AuthenticationContext authenticationContext, ServiceEndpointsProperties serviceEndpointsProperties,
            @Value("${security.client.enabled:true}") boolean enableClientAuth) {
        this.azureCredential = new ClientCredential(aadAuthProps.getClientId(), aadAuthProps.getClientSecret());
        this.aadAuthProps = aadAuthProps;
        this.enableClientAuth = enableClientAuth;
        this.serviceEndpoints = serviceEndpointsProperties.getServiceEndpoints(aadAuthProps.getEnvironment());

        this.authenticationContext = authenticationContext;
        this.graphClient = new AzureADGraphClient(azureCredential, aadAuthProps, serviceEndpointsProperties);

        this.accessTokenCache = Caffeine.newBuilder()
                .expireAfter(new AuthResultExpiry())
                .maximumSize(1000).build();
        this.grantedAuthorityCache = Caffeine.newBuilder()
                .expireAfterAccess(Duration.ofMinutes(10))
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

    public Set<GrantedAuthority> getGrantedAuthorities(String token) {
        return grantedAuthorityCache.get(token, this::lookupGrantedAuthorities);
    }

    public AuthenticationResult acquireTokenForAuthCode(String code, String redirectUri) {
        try {
            log.debug("Looking up token for auth code");
            return authenticationContext.acquireTokenByAuthorizationCode(code, new URI(redirectUri), azureCredential, aadAuthProps.getClientId(), null).get();
        } catch (Exception e) {
            throw new PollyTechnicalException("Failed to get token for auth code", e);
        }
    }

    private Set<GrantedAuthority> lookupGrantedAuthorities(String token) {
        try {
            String graphToken = acquireGraphToken(token).getAccessToken();
            return graphClient.convertGroupsToGrantedAuthorities(graphClient.getGroups(graphToken));
        } catch (Exception e) {
            log.error("Failed to get groups for token", e);
            throw new PollyTechnicalException("Failed to get groups for token", e);
        }
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
            return authenticationContext.acquireTokenByRefreshToken(refreshToken, azureCredential, resource, null).get();
        } catch (Exception e) {
            throw new PollyTechnicalException("Failed to get access token for refreshToken", e);
        }
    }

    private AuthenticationResult acquireTokenByCredential(String resource) {
        try {
            log.debug("Looking up application token for resource {}", resource);
            return authenticationContext.acquireToken(resource, azureCredential, null).get();
        } catch (Exception e) {
            throw new PollyTechnicalException("Failed to get access token for credential", e);
        }
    }

    private AuthenticationResult acquireGraphToken(String token) {
        try {
            log.debug("Looking up graph token");
            return authenticationContext.acquireToken(serviceEndpoints.getAadGraphApiUri(), new UserAssertion(token), azureCredential, null).get();
        } catch (Exception e) {
            throw new PollyTechnicalException("Failed to get graph token", e);
        }
    }
}
