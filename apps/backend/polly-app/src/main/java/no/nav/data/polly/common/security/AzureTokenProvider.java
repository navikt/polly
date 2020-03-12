package no.nav.data.polly.common.security;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.LoadingCache;
import com.microsoft.aad.adal4j.AuthenticationContext;
import com.microsoft.aad.adal4j.AuthenticationResult;
import com.microsoft.aad.adal4j.ClientCredential;
import com.microsoft.aad.adal4j.UserAssertion;
import com.microsoft.azure.spring.autoconfigure.aad.AADAuthenticationProperties;
import com.microsoft.azure.spring.autoconfigure.aad.AzureADGraphClient;
import com.microsoft.azure.spring.autoconfigure.aad.ServiceEndpoints;
import com.microsoft.azure.spring.autoconfigure.aad.ServiceEndpointsProperties;
import com.microsoft.azure.spring.autoconfigure.aad.UserGroup;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.common.exceptions.PollyTechnicalException;
import no.nav.data.polly.common.security.domain.Auth;
import no.nav.data.polly.common.security.dto.Credential;
import no.nav.data.polly.common.security.dto.PollyRole;
import no.nav.data.polly.common.utils.MetricUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.net.URI;
import java.time.Duration;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import static java.util.Objects.requireNonNull;
import static no.nav.data.polly.common.security.SecurityConstants.SESS_ID_LEN;
import static no.nav.data.polly.common.security.SecurityConstants.TOKEN_TYPE;
import static no.nav.data.polly.common.security.dto.PollyRole.ROLE_PREFIX;
import static no.nav.data.polly.common.utils.StreamUtils.convert;

@Slf4j
@Service
public class AzureTokenProvider {

    private final Cache<String, AuthenticationResult> accessTokenCache;
    private final LoadingCache<String, Set<GrantedAuthority>> grantedAuthorityCache;

    private final AuthenticationContext authenticationContext;
    private final AzureADGraphClient graphClient;
    private final AuthService authService;

    private final ServiceEndpoints serviceEndpoints;
    private final AADAuthenticationProperties aadAuthProps;
    private final ClientCredential azureCredential;
    private final SecurityProperties securityProperties;

    public AzureTokenProvider(AADAuthenticationProperties aadAuthProps, AuthenticationContext authenticationContext, AuthService authService,
            ServiceEndpointsProperties serviceEndpointsProperties,
            SecurityProperties securityProperties) {
        this.azureCredential = new ClientCredential(aadAuthProps.getClientId(), aadAuthProps.getClientSecret());
        this.aadAuthProps = aadAuthProps;
        this.authService = authService;
        this.securityProperties = securityProperties;
        this.serviceEndpoints = serviceEndpointsProperties.getServiceEndpoints(aadAuthProps.getEnvironment());

        this.authenticationContext = authenticationContext;
        this.graphClient = new AzureADGraphClient(azureCredential, aadAuthProps, serviceEndpointsProperties);

        this.accessTokenCache = Caffeine.newBuilder().recordStats()
                .expireAfter(new AuthResultExpiry())
                .maximumSize(1000).build();
        this.grantedAuthorityCache = Caffeine.newBuilder().recordStats()
                .expireAfterAccess(Duration.ofMinutes(10))
                .maximumSize(1000).build(this::lookupGrantedAuthorities);
        MetricUtils.register("accessTokenCache", accessTokenCache);
        MetricUtils.register("grantedAuthorityCache", grantedAuthorityCache);
    }

    public String getIdentClaimName() {
        return securityProperties.getIdentClaim();
    }

    public String getConsumerToken(String resource, String appIdUri) {
        if (!securityProperties.isClientEnabled()) {
            return StringUtils.EMPTY;
        }
        return Credential.getCredential()
                .filter(Credential::hasAuth)
                .map(cred -> TOKEN_TYPE + getAccessTokenForResource(cred.getAuth().decryptRefreshToken(), resource))
                .orElseGet(() -> TOKEN_TYPE + getApplicationTokenForResource(appIdUri));
    }

    public Auth getAuth(String session) {
        Assert.isTrue(session.length() > SESS_ID_LEN, "invalid session");
        var sessionId = session.substring(0, SESS_ID_LEN);
        var sessionKey = session.substring(SESS_ID_LEN);
        var auth = authService.getAuth(sessionId, sessionKey);
        String accessToken = getAccessTokenForResource(auth.decryptRefreshToken(), aadAuthProps.getClientId());
        auth.addAccessToken(accessToken);
        return auth;
    }

    public void destorySession() {
        Credential.getCredential().map(Credential::getAuth).ifPresent(auth -> authService.endSession(auth.getId()));
    }

    public Set<GrantedAuthority> getGrantedAuthorities(String accessToken) {
        return grantedAuthorityCache.get(accessToken);
    }

    public String createSession(String code, String redirectUri) {
        try {
            log.debug("Looking up token for auth code");
            var authResult = authenticationContext.acquireTokenByAuthorizationCode(code, new URI(redirectUri), azureCredential, aadAuthProps.getClientId(), null).get();
            return authService.createAuth(authResult.getUserInfo().getUniqueId(), authResult.getRefreshToken());
        } catch (Exception e) {
            throw new PollyTechnicalException("Failed to get token for auth code", e);
        }
    }

    private Set<GrantedAuthority> lookupGrantedAuthorities(String token) {
        try {
            String graphToken = acquireGraphToken(token).getAccessToken();
            List<UserGroup> groups = graphClient.getGroups(graphToken);
            log.debug("groups {}", convert(groups, UserGroup::getDisplayName));
            Set<GrantedAuthority> roles = groups.stream()
                    .map(this::roleFor)
                    .filter(Objects::nonNull)
                    .map(this::convertAuthority)
                    .collect(Collectors.toSet());
            roles.add(convertAuthority(PollyRole.POLLY_READ.name()));
            log.debug("roles {}", convert(roles, GrantedAuthority::getAuthority));
            return roles;
        } catch (Exception e) {
            log.error("Failed to get groups for token", e);
            throw new PollyTechnicalException("Failed to get groups for token", e);
        }
    }

    private String roleFor(UserGroup group) {
        var groupName = group.getDisplayName();
        if (securityProperties.getWriteGroups().contains(groupName)) {
            return PollyRole.POLLY_WRITE.name();
        }
        if (securityProperties.getAdminGroups().contains(groupName)) {
            return PollyRole.POLLY_ADMIN.name();
        }
        // for future - add team -> system roles here
        return null;
    }

    private SimpleGrantedAuthority convertAuthority(String role) {
        return new SimpleGrantedAuthority(ROLE_PREFIX + role);
    }

    private String getApplicationTokenForResource(String resource) {
        log.trace("Getting application token for resource {}", resource);
        return requireNonNull(accessTokenCache.get("credential" + resource, cacheKey -> acquireTokenByCredential(resource))).getAccessToken();
    }

    private String getAccessTokenForResource(String refreshToken, String resource) {
        log.trace("Getting access token for resource {}", resource);
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
