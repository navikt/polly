package no.nav.data.polly.common.security;

import com.microsoft.azure.spring.autoconfigure.aad.AADAppRoleStatelessAuthenticationFilter;
import com.microsoft.azure.spring.autoconfigure.aad.UserPrincipal;
import com.microsoft.azure.spring.autoconfigure.aad.UserPrincipalManager;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.proc.BadJOSEException;
import com.nimbusds.jwt.proc.BadJWTException;
import io.prometheus.client.Counter;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.common.security.dto.Credential;
import no.nav.data.polly.common.security.dto.UserInfo;
import no.nav.data.polly.common.utils.MetricUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;

import java.io.IOException;
import java.text.ParseException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import static org.springframework.util.StringUtils.hasText;

/**
 * Based on {@link com.microsoft.azure.spring.autoconfigure.aad.AADAppRoleStatelessAuthenticationFilter}. Extends class to prevent additional filter to be created
 */
@Slf4j
public class AADStatelessAuthenticationFilter extends AADAppRoleStatelessAuthenticationFilter {

    private static final String POLLY_TOKEN_COOKIE_NAME = "polly-token";
    private static final String TOKEN_TYPE = "Bearer ";

    private final Encryptor refreshTokenEncryptor;
    private final UserPrincipalManager principalManager;
    private final AzureTokenProvider azureTokenProvider;
    private final List<String> allowedAppIds;
    private final Counter counter;

    public AADStatelessAuthenticationFilter(Encryptor refreshTokenEncryptor, UserPrincipalManager userPrincipalManager,
            AzureTokenProvider azureTokenProvider, AppIdMapping appIdMapping) {
        super(null);
        this.refreshTokenEncryptor = refreshTokenEncryptor;
        this.principalManager = userPrincipalManager;
        this.azureTokenProvider = azureTokenProvider;
        this.allowedAppIds = List.copyOf(appIdMapping.getIds());
        counter = initCounter();
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        boolean cleanupRequired = false;

        if (StringUtils.startsWith(request.getServletPath(), "/login")) {
            counter.labels("login").inc();
        } else {
            cleanupRequired = authenticate(request, response);
        }

        try {
            filterChain.doFilter(request, response);
        } finally {
            if (cleanupRequired) {
                SecurityContextHolder.clearContext();
            }
        }
    }

    private boolean authenticate(HttpServletRequest request, HttpServletResponse response) throws ServletException {
        Credential credential = getCredential(request, response);
        if (credential != null) {
            try {
                var principal = buildUserPrincipal(credential.getAccessToken());
                var grantedAuthorities = azureTokenProvider.getGrantedAuthorities(credential.getAccessToken());
                var authentication = new PreAuthenticatedAuthenticationToken(principal, credential, grantedAuthorities);
                authentication.setDetails(new UserInfo(principal, grantedAuthorities));
                authentication.setAuthenticated(true);
                log.trace("Request token verification success for subject {} with roles {}.", principal.getSubject(), grantedAuthorities);
                SecurityContextHolder.getContext().setAuthentication(authentication);
                return true;
            } catch (BadJWTException ex) {
                String errorMessage = "Invalid JWT. Either expired or not yet valid. " + ex.getMessage();
                log.warn(errorMessage);
                throw new ServletException(errorMessage, ex);
            } catch (ParseException | BadJOSEException | JOSEException ex) {
                log.error("Failed to initialize UserPrincipal.", ex);
                throw new ServletException(ex);
            }
        } else {
            if (!StringUtils.startsWith(request.getServletPath(), "/internal")) {
                counter.labels("no_auth").inc();
            }
        }
        return false;
    }

    private Credential getCredential(HttpServletRequest request, HttpServletResponse response) {
        if (request.getCookies() != null) {
            Optional<Cookie> cookie = Stream.of(request.getCookies())
                    .filter(c -> c.getName().equals(POLLY_TOKEN_COOKIE_NAME))
                    .findFirst();
            if (cookie.isPresent()) {
                try {
                    String token = refreshTokenEncryptor.decrypt(cookie.get().getValue());
                    String accessToken = azureTokenProvider.getAccessToken(token);
                    counter.labels("refresh_cookie").inc();
                    return new Credential(accessToken, token);
                } catch (Exception e) {
                    log.warn("Invalid auth cookie", e);
                    response.addCookie(createCookie(null, 0, request));
                    return null;
                }
            }
        }
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (hasText(authHeader) && authHeader.startsWith(TOKEN_TYPE)) {
            String authHeader1 = request.getHeader(HttpHeaders.AUTHORIZATION);
            String token = authHeader1.replace(TOKEN_TYPE, "");
            counter.labels("direct_token").inc();
            return new Credential(token, null);
        }
        return null;
    }

    private UserPrincipal buildUserPrincipal(String token) throws ParseException, JOSEException, BadJOSEException {
        var principal = principalManager.buildUserPrincipal(token);
        validate(principal);
        return principal;
    }

    private void validate(UserPrincipal principal) throws BadJWTException {
        String appidClaim = (String) principal.getClaim(UserInfo.APPID_CLAIM);
        if (appidClaim == null || !allowedAppIds.contains(appidClaim)) {
            throw new BadJWTException("Invalid token appid. Provided value " + appidClaim + " does not match allowed appid");
        }
    }

    static Cookie createCookie(String value, int maxAge, HttpServletRequest request) {
        Cookie cookie = new Cookie(POLLY_TOKEN_COOKIE_NAME, value);
        cookie.setMaxAge(maxAge);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setSecure(!"localhost".equals(request.getServerName()));
        return cookie;
    }

    private static Counter initCounter() {
        return MetricUtils.counter()
                .labels("no_auth").labels("refresh_cookie").labels("direct_token").labels("login")
                .name("polly_adal_auth_counter")
                .help("Counter for authentication events")
                .labelNames("action")
                .register();
    }

}
