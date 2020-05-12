package no.nav.data.polly.common.security;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSObject;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.jwk.source.RemoteJWKSet;
import com.nimbusds.jose.proc.BadJOSEException;
import com.nimbusds.jose.proc.JWSKeySelector;
import com.nimbusds.jose.proc.JWSVerificationKeySelector;
import com.nimbusds.jose.proc.SecurityContext;
import com.nimbusds.jose.util.ResourceRetriever;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.proc.BadJWTException;
import com.nimbusds.jwt.proc.ConfigurableJWTProcessor;
import com.nimbusds.jwt.proc.DefaultJWTClaimsVerifier;
import com.nimbusds.jwt.proc.DefaultJWTProcessor;
import com.nimbusds.jwt.proc.JWTClaimsSetVerifier;
import io.prometheus.client.Counter;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.common.security.domain.Auth;
import no.nav.data.polly.common.security.dto.AADAuthenticationProperties;
import no.nav.data.polly.common.security.dto.Credential;
import no.nav.data.polly.common.security.dto.UserInfo;
import no.nav.data.polly.common.utils.MetricUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.text.ParseException;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Stream;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import static no.nav.data.polly.common.security.SecurityConstants.POLLY_COOKIE_NAME;
import static no.nav.data.polly.common.security.SecurityConstants.TOKEN_TYPE;
import static org.springframework.util.StringUtils.hasText;

@Slf4j
public class AADStatelessAuthenticationFilter extends OncePerRequestFilter {

    private static final Counter counter = initCounter();

    private final AzureTokenProvider azureTokenProvider;
    private final List<String> allowedAppIds;
    private final JWKSource<SecurityContext> keySource;

    public AADStatelessAuthenticationFilter(AzureTokenProvider azureTokenProvider, AppIdMapping appIdMapping,
            AADAuthenticationProperties aadAuthProps, ResourceRetriever resourceRetriever) {
        this.azureTokenProvider = azureTokenProvider;
        this.allowedAppIds = List.copyOf(appIdMapping.getIds());

        // azure spring
        this.validAudiences.add(aadAuthProps.getClientId());
        this.validAudiences.add(aadAuthProps.getAppIdUri());
        try {
            keySource = new RemoteJWKSet<>(new URL(aadAuthProps.getAadKeyDiscoveryUri()), resourceRetriever);
        } catch (MalformedURLException e) {
            log.error("Failed to parse active directory key discovery uri.", e);
            throw new IllegalStateException("Failed to parse active directory key discovery uri.", e);
        }
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
                var graphData = azureTokenProvider.getGraphData(credential.getAccessToken());
                var authentication = new PreAuthenticatedAuthenticationToken(principal, credential, graphData.getGrantedAuthorities());
                authentication.setDetails(new UserInfo(principal, graphData.getGrantedAuthorities(), graphData.getNavIdent()));
                authentication.setAuthenticated(true);
                log.trace("Request token verification success for subject {} with roles {}.", UserInfo.getUserId(principal), graphData.getGrantedAuthorities());
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
                    .filter(c -> c.getName().equals(POLLY_COOKIE_NAME))
                    .findFirst();
            if (cookie.isPresent()) {
                try {
                    String session = cookie.get().getValue();
                    Auth auth = azureTokenProvider.getAuth(session);
                    counter.labels("cookie").inc();
                    return new Credential(auth);
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
            return new Credential(token);
        }
        return null;
    }

    private JWTClaimsSet buildUserPrincipal(String token) throws ParseException, JOSEException, BadJOSEException {
        var principal = buildAndValidateClaims(token);
        String appIdClaim = UserInfo.getAppId(principal);
        if (appIdClaim == null || !allowedAppIds.contains(appIdClaim)) {
            throw new BadJWTException("Invalid token appId. Provided value " + appIdClaim + " does not match allowed appId");
        }
        return principal;
    }

    static Cookie createCookie(String value, int maxAge, HttpServletRequest request) {
        Cookie cookie = new Cookie(POLLY_COOKIE_NAME, value);
        cookie.setMaxAge(maxAge);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setSecure(!"localhost".equals(request.getServerName()));
        return cookie;
    }

    private static Counter initCounter() {
        return MetricUtils.counter()
                .labels("no_auth").labels("cookie").labels("direct_token").labels("login")
                .name("polly_adal_auth_counter")
                .help("Counter for authentication events")
                .labelNames("action")
                .register();
    }

    // From spring azure start

    private static final String LOGIN_MICROSOFT_ONLINE_ISSUER = "https://login.microsoftonline.com/";
    private static final String STS_WINDOWS_ISSUER = "https://sts.windows.net/";
    private final Set<String> validAudiences = new HashSet<>();

    public JWTClaimsSet buildAndValidateClaims(String idToken) throws ParseException, BadJOSEException, JOSEException {
        final JWSObject jwsObject = JWSObject.parse(idToken);
        final ConfigurableJWTProcessor<SecurityContext> validator =
                getAadJwtTokenValidator(jwsObject.getHeader().getAlgorithm());
        final JWTClaimsSet jwtClaimsSet = validator.process(idToken, null);
        final JWTClaimsSetVerifier<SecurityContext> verifier = validator.getJWTClaimsSetVerifier();
        verifier.verify(jwtClaimsSet, null);

        return jwtClaimsSet;
    }

    private ConfigurableJWTProcessor<SecurityContext> getAadJwtTokenValidator(JWSAlgorithm jwsAlgorithm) {
        final ConfigurableJWTProcessor<SecurityContext> jwtProcessor = new DefaultJWTProcessor<>();

        final JWSKeySelector<SecurityContext> keySelector =
                new JWSVerificationKeySelector<>(jwsAlgorithm, keySource);
        jwtProcessor.setJWSKeySelector(keySelector);

        jwtProcessor.setJWTClaimsSetVerifier(new DefaultJWTClaimsVerifier<>() {
            @Override
            public void verify(JWTClaimsSet claimsSet, SecurityContext ctx) throws BadJWTException {
                super.verify(claimsSet, ctx);
                final String issuer = claimsSet.getIssuer();
                if (issuer == null || !(issuer.startsWith(LOGIN_MICROSOFT_ONLINE_ISSUER) || issuer.startsWith(STS_WINDOWS_ISSUER))) {
                    throw new BadJWTException("Invalid token issuer");
                }
                final Optional<String> matchedAudience = claimsSet.getAudience().stream().filter(validAudiences::contains).findFirst();
                if (matchedAudience.isPresent()) {
                    log.trace("Matched audience [{}]", matchedAudience.get());
                } else {
                    throw new BadJWTException("Invalid token audience. Provided value " + claimsSet.getAudience() + "does not match neither client-id nor AppIdUri.");
                }
            }
        });
        return jwtProcessor;
    }

}
