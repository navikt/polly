package no.nav.data.polly.common.security;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.LoadingCache;
import com.microsoft.aad.msal4j.AuthorizationCodeParameters;
import com.microsoft.aad.msal4j.ClientCredentialParameters;
import com.microsoft.aad.msal4j.IAuthenticationResult;
import com.microsoft.aad.msal4j.IConfidentialClientApplication;
import com.microsoft.aad.msal4j.OnBehalfOfParameters;
import com.microsoft.aad.msal4j.RefreshTokenParameters;
import com.microsoft.aad.msal4j.UserAssertion;
import com.microsoft.graph.concurrency.DefaultExecutors;
import com.microsoft.graph.logger.DefaultLogger;
import com.microsoft.graph.models.extensions.DirectoryObject;
import com.microsoft.graph.models.extensions.IGraphServiceClient;
import com.microsoft.graph.models.extensions.User;
import com.microsoft.graph.options.QueryOption;
import com.microsoft.graph.requests.extensions.GraphServiceClient;
import com.microsoft.graph.requests.extensions.IDirectoryObjectCollectionWithReferencesRequestBuilder;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.common.exceptions.PollyTechnicalException;
import no.nav.data.polly.common.security.domain.Auth;
import no.nav.data.polly.common.security.dto.AADAuthenticationProperties;
import no.nav.data.polly.common.security.dto.Credential;
import no.nav.data.polly.common.security.dto.GraphData;
import no.nav.data.polly.common.security.dto.PollyRole;
import no.nav.data.polly.common.utils.MdcExecutor;
import no.nav.data.polly.common.utils.MetricUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.util.ReflectionUtils;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.URI;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.stream.Collectors;

import static java.util.Objects.requireNonNull;
import static no.nav.data.polly.common.security.SecurityConstants.MICROSOFT_GRAPH_SCOPES;
import static no.nav.data.polly.common.security.SecurityConstants.SESS_ID_LEN;
import static no.nav.data.polly.common.security.SecurityConstants.TOKEN_TYPE;
import static no.nav.data.polly.common.security.dto.PollyRole.ROLE_PREFIX;
import static no.nav.data.polly.common.utils.StreamUtils.convert;

@Slf4j
@Service
public class AzureTokenProvider {

    private final Cache<String, IAuthenticationResult> accessTokenCache;
    private final LoadingCache<String, GraphData> graphDataCache;

    private final IConfidentialClientApplication msalClient;
    private final AuthService authService;
    private final MdcMsalExecutor msalExecutor;

    private final AADAuthenticationProperties aadAuthProps;
    private final SecurityProperties securityProperties;

    public AzureTokenProvider(AADAuthenticationProperties aadAuthProps,
            IConfidentialClientApplication msalClient, AuthService authService,
            SecurityProperties securityProperties, MdcExecutor msalExecutor
    ) {
        this.aadAuthProps = aadAuthProps;
        this.msalClient = msalClient;
        this.authService = authService;
        this.securityProperties = securityProperties;
        this.msalExecutor = new MdcMsalExecutor(msalExecutor);

        this.accessTokenCache = Caffeine.newBuilder().recordStats()
                .expireAfter(new AuthResultExpiry())
                .maximumSize(1000).build();
        this.graphDataCache = Caffeine.newBuilder().recordStats()
                .expireAfterAccess(Duration.ofHours(1))
                .maximumSize(1000).build(this::lookupGraphData);
        MetricUtils.register("accessTokenCache", accessTokenCache);
        MetricUtils.register("graphDataCache", graphDataCache);
    }

    private IGraphServiceClient getGraphClient(String accessToken) {
        return GraphServiceClient.builder()
                .authenticationProvider(request -> request.addHeader(HttpHeaders.AUTHORIZATION, TOKEN_TYPE + accessToken))
                .executors(msalExecutor)
                .logger(new GraphLogger())
                .buildClient();
    }

    public String getConsumerToken(String resource, String appIdUri) {
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
        String accessToken = getAccessTokenForResource(auth.decryptRefreshToken(), resourceForAppId());
        auth.addAccessToken(accessToken);
        return auth;
    }

    public void destroySession() {
        Credential.getCredential().map(Credential::getAuth).ifPresent(auth -> authService.endSession(auth.getId()));
    }

    public GraphData getGraphData(String accessToken) {
        return graphDataCache.get(accessToken);
    }

    private GraphData lookupGraphData(String accessToken) {
        var graphAccessToken = acquireGraphTokenForAccessToken(accessToken).accessToken();
        var grantedAuthorities = lookupGrantedAuthorities(graphAccessToken);
        var navIdent = lookupNavIdent(graphAccessToken);
        return new GraphData(navIdent, grantedAuthorities);
    }

    @SneakyThrows
    public String createSession(String code, String redirectUri) {
        try {
            log.debug("Looking up token for auth code");
            var authResult = msalClient.acquireToken(AuthorizationCodeParameters
                    .builder(code, new URI(redirectUri))
                    .scopes(MICROSOFT_GRAPH_SCOPES)
                    .build()).get();
            String userId = StringUtils.substringBefore(authResult.account().homeAccountId(), ".");
            String refreshToken = getRefreshTokenFromAuthResult(authResult);
            return authService.createAuth(userId, refreshToken);
        } catch (Exception e) {
            log.error("Failed to get token for auth code", e);
            throw new PollyTechnicalException("Failed to get token for auth code", e);
        }
    }

    private String getRefreshTokenFromAuthResult(IAuthenticationResult authResult) throws ClassNotFoundException, IllegalAccessException, InvocationTargetException {
        // interface is missing refreshToken...
        Method refreshTokenMethod = ReflectionUtils.findMethod(Class.forName("com.microsoft.aad.msal4j.AuthenticationResult"), "refreshToken");
        Assert.notNull(refreshTokenMethod, "couldn't find refreshToken method");
        refreshTokenMethod.setAccessible(true);
        return (String) refreshTokenMethod.invoke(authResult);
    }

    private String resourceForAppId() {
        return aadAuthProps.getClientId() + "/.default";
    }

    private String lookupNavIdent(String graphAccessToken) {
        User user = getGraphClient(graphAccessToken)
                .me().buildRequest(List.of(new QueryOption("$select", "onPremisesSamAccountName"))).get();
        return user.onPremisesSamAccountName;
    }

    private Set<GrantedAuthority> lookupGrantedAuthorities(String graphAccessToken) {
        try {
            var groups = getGraphClient(graphAccessToken)
                    .me().memberOf().buildRequest().get();

            List<DirectoryObject> page = new ArrayList<>(groups.getCurrentPage());
            IDirectoryObjectCollectionWithReferencesRequestBuilder nextPage;
            while ((nextPage = groups.getNextPage()) != null) {
                page.addAll(nextPage.buildRequest().get().getCurrentPage());
            }
            log.debug("groups {}", convert(page, g -> g.id));

            Set<GrantedAuthority> roles = page.stream()
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

    /**
     * token v2 does not allow us to fetch group details, so we have to map by id instead
     */
    private String roleFor(DirectoryObject groupO) {
        var group = groupO.id;
        if (securityProperties.getWriteGroups().contains(group)) {
            return PollyRole.POLLY_WRITE.name();
        }
        if (securityProperties.getAdminGroups().contains(group)) {
            return PollyRole.POLLY_ADMIN.name();
        }
        // for future - add team -> system roles here
        return null;
    }

    private GrantedAuthority convertAuthority(String role) {
        return new SimpleGrantedAuthority(ROLE_PREFIX + role);
    }

    private String getApplicationTokenForResource(String resource) {
        log.trace("Getting application token for resource {}", resource);
        return requireNonNull(accessTokenCache.get("credential" + resource, cacheKey -> acquireTokenByCredential(resource))).accessToken();
    }

    private String getAccessTokenForResource(String refreshToken, String resource) {
        log.trace("Getting access token for resource {}", resource);
        return requireNonNull(accessTokenCache.get("refresh" + refreshToken + resource, cacheKey -> acquireTokenByRefreshToken(refreshToken, resource))).accessToken();
    }

    private IAuthenticationResult acquireTokenByRefreshToken(String refreshToken, String resource) {
        try {
            log.debug("Looking up access token for resource {}", resource);
            return msalClient.acquireToken(RefreshTokenParameters.builder(Set.of(resource), refreshToken).build()).get();
        } catch (Exception e) {
            throw new PollyTechnicalException("Failed to get access token for refreshToken", e);
        }
    }

    private IAuthenticationResult acquireTokenByCredential(String resource) {
        try {
            log.debug("Looking up application token for resource {}", resource);
            return msalClient.acquireToken(ClientCredentialParameters.builder(Set.of(resource)).build()).get();
        } catch (Exception e) {
            throw new PollyTechnicalException("Failed to get access token for credential", e);
        }
    }

    private IAuthenticationResult acquireGraphTokenForAccessToken(String accessToken) {
        try {
            log.debug("Looking up graph token");
            return msalClient.acquireToken(OnBehalfOfParameters
                    .builder(MICROSOFT_GRAPH_SCOPES, new UserAssertion(accessToken))
                    .build()).get();
        } catch (Exception e) {
            throw new PollyTechnicalException("Failed to get graph token", e);
        }
    }

    private static class MdcMsalExecutor extends DefaultExecutors {

        static Field backgroundExecutor;

        static {
            backgroundExecutor = ReflectionUtils.findField(DefaultExecutors.class, "backgroundExecutor", ThreadPoolExecutor.class);
            Assert.notNull(backgroundExecutor, "couldn't find executor field");
            backgroundExecutor.setAccessible(true);
        }

        @SneakyThrows
        public MdcMsalExecutor(MdcExecutor msalExecutor) {
            super(new DefaultLogger());
            backgroundExecutor.set(this, msalExecutor);
        }
    }

}
