package no.nav.polly.common.security;

import com.microsoft.azure.spring.autoconfigure.aad.AADAppRoleStatelessAuthenticationFilter;
import com.microsoft.azure.spring.autoconfigure.aad.UserPrincipal;
import com.microsoft.azure.spring.autoconfigure.aad.UserPrincipalManager;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.proc.BadJOSEException;
import com.nimbusds.jwt.proc.BadJWTException;
import io.prometheus.client.Counter;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import no.nav.polly.common.utils.MetricUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;

import java.io.IOException;
import java.text.ParseException;
import java.util.Collections;
import java.util.List;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import static org.springframework.util.StringUtils.hasText;

/**
 * Based on {@link com.microsoft.azure.spring.autoconfigure.aad.AADAppRoleStatelessAuthenticationFilter}. Extends class to prevent additional filter to be created
 */
@Slf4j
public class AADStatelessAuthenticationFilter extends AADAppRoleStatelessAuthenticationFilter {

    private static final String TOKEN_TYPE = "Bearer ";

    public static final String APPID_CLAIM = "appid";
    public static final String NAV_IDENT_CLAIM = "NAVident";

    private final UserPrincipalManager principalManager;
    private final AzureTokenProvider azureTokenProvider;
    private final List<String> allowedAppIds;
    private final Counter counter;

    public AADStatelessAuthenticationFilter(UserPrincipalManager userPrincipalManager, AzureTokenProvider azureTokenProvider, AppIdMapping appIdMapping) {
        super(null);
        this.principalManager = userPrincipalManager;
        this.azureTokenProvider = azureTokenProvider;
        this.allowedAppIds = List.copyOf(appIdMapping.getIds());
        counter = initCounter();
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        boolean cleanupRequired = false;

        if (hasText(authHeader) && authHeader.startsWith(TOKEN_TYPE)) {
            try {
                Credential credential = getCredential(authHeader);
                UserPrincipal principal = buildUserPrincipal(credential.getAccessToken());
                var authentication = new PreAuthenticatedAuthenticationToken(principal, credential, Collections.emptyList());
                authentication.setAuthenticated(true);
                log.info("Request token verification success for subject {}.", principal.getSubject());
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
        } else {
            if (!StringUtils.startsWith(request.getServletPath(), "/internal")) {
                counter.labels("no_auth").inc();
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
    private Credential getCredential(String authHeader) {
        String token = authHeader.replace(TOKEN_TYPE, "");
        if (StringUtils.countMatches(token, '.') == 2) {
            counter.labels("direct_token").inc();
            return new Credential(token, null);
        } else {
            counter.labels("refresh_token").inc();
            // Assuming refresh token, token was not valid access token
            String accessToken = azureTokenProvider.getAccessToken(token);
            return new Credential(accessToken, token);
        }
    }

    private static Counter initCounter() {
        return MetricUtils.counter()
                .labels("no_auth").labels("refresh_token").labels("refresh_token_lookup").labels("direct_token")
                .name("adal_auth_counter")
                .help("Counter for authentication events")
                .labelNames("action")
                .register();
    }

}
