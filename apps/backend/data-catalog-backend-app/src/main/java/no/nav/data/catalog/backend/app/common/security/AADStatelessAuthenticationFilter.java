package no.nav.data.catalog.backend.app.common.security;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.microsoft.aad.adal4j.AuthenticationContext;
import com.microsoft.aad.adal4j.AuthenticationResult;
import com.microsoft.aad.adal4j.ClientCredential;
import com.microsoft.azure.spring.autoconfigure.aad.AADAuthenticationProperties;
import com.microsoft.azure.spring.autoconfigure.aad.UserPrincipal;
import com.microsoft.azure.spring.autoconfigure.aad.UserPrincipalManager;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.proc.BadJOSEException;
import com.nimbusds.jwt.proc.BadJWTException;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.text.ParseException;
import java.util.Collections;
import java.util.List;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import static java.util.Objects.requireNonNull;
import static org.springframework.util.StringUtils.hasText;

/**
 * Based on {@link com.microsoft.azure.spring.autoconfigure.aad.AADAppRoleStatelessAuthenticationFilter}
 */
@Slf4j
public class AADStatelessAuthenticationFilter extends OncePerRequestFilter {

    private static final String TOKEN_TYPE = "Bearer ";

    public static final String APPID_CLAIM = "appid";
    public static final String NAV_IDENT_CLAIM = "NAVident";

    private final UserPrincipalManager principalManager;
    private final AuthenticationContext authenticationContext;
    private final AADAuthenticationProperties aadAuthProps;
    private final List<String> allowedAppIds;
    private final Cache<String, AuthenticationResult> accessTokenCache;

    public AADStatelessAuthenticationFilter(UserPrincipalManager userPrincipalManager, AuthenticationContext authenticationContext,
            AADAuthenticationProperties aadAuthProps, AppIdMapping appIdMapping) {
        this.principalManager = userPrincipalManager;
        this.authenticationContext = authenticationContext;
        this.aadAuthProps = aadAuthProps;
        this.allowedAppIds = List.copyOf(appIdMapping.getIds());
        this.accessTokenCache = Caffeine.newBuilder()
                .expireAfter(new AuthResultExpiry())
                .maximumSize(1000).build();
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        boolean cleanupRequired = false;

        if (hasText(authHeader) && authHeader.startsWith(TOKEN_TYPE)) {
            try {
                String token = getAccessToken(authHeader);
                UserPrincipal principal = buildUserPrincipal(token);
                var authentication = new PreAuthenticatedAuthenticationToken(principal, null, Collections.emptyList());
                authentication.setAuthenticated(true);
                log.info("Request token verification success. {}", authentication);
                SecurityContextHolder.getContext().setAuthentication(authentication);
                cleanupRequired = true;
            } catch (BadJWTException ex) {
                String errorMessage = "Invalid JWT. Either expired or not yet valid. " + ex.getMessage();
                log.warn(errorMessage);
                throw new ServletException(errorMessage, ex);
            } catch (ParseException | BadJOSEException | JOSEException ex) {
                log.error("Failed to initialize UserPrincipal.", ex);
                throw new ServletException(ex);
            }
        }

        try {
            filterChain.doFilter(request, response);
        } finally {
            if (cleanupRequired) {
                SecurityContextHolder.clearContext();
            }
        }
    }

    private UserPrincipal buildUserPrincipal(String token) throws ParseException, JOSEException, BadJOSEException {
        var principal = principalManager.buildUserPrincipal(token);
        validate(principal);
        return principal;
    }

    private void validate(UserPrincipal principal) throws BadJWTException {
        String appidClaim = (String) principal.getClaim(APPID_CLAIM);
        if (appidClaim == null || !allowedAppIds.contains(appidClaim)) {
            throw new BadJWTException("Invalid token appid. Provided value " + appidClaim + " does not match allowed appid");
        }
    }

    @SneakyThrows
    private String getAccessToken(String authHeader) {
        String token = authHeader.replace(TOKEN_TYPE, "");
        if (StringUtils.countMatches(token, '.') == 2) {
            return token;
        } else {
            log.debug("Assuming refresh token, token was not valid access token");
            return requireNonNull(accessTokenCache.get(token, this::getAccessTokenForRefreshToken)).getAccessToken();
        }
    }

    @SneakyThrows
    private AuthenticationResult getAccessTokenForRefreshToken(String refreshToken) {
        log.debug("Looking up access token");
        var credential = new ClientCredential(aadAuthProps.getClientId(), aadAuthProps.getClientSecret());
        return authenticationContext.acquireTokenByRefreshToken(refreshToken, credential, aadAuthProps.getClientId(), null).get();
    }
}
