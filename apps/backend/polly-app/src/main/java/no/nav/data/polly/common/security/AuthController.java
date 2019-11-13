package no.nav.data.polly.common.security;


import com.microsoft.aad.adal4j.AuthenticationResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.common.exceptions.PollyTechnicalException;
import no.nav.data.polly.common.security.dto.OAuthState;
import no.nav.data.polly.common.security.dto.UserInfo;
import no.nav.data.polly.common.security.dto.UserInfoResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.security.web.util.UrlUtils;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.time.Duration;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import static org.apache.commons.lang3.StringUtils.substringBefore;
import static org.springframework.security.oauth2.core.endpoint.OAuth2ParameterNames.CODE;
import static org.springframework.security.oauth2.core.endpoint.OAuth2ParameterNames.ERROR;
import static org.springframework.security.oauth2.core.endpoint.OAuth2ParameterNames.ERROR_DESCRIPTION;
import static org.springframework.security.oauth2.core.endpoint.OAuth2ParameterNames.ERROR_URI;
import static org.springframework.security.oauth2.core.endpoint.OAuth2ParameterNames.REDIRECT_URI;
import static org.springframework.security.oauth2.core.endpoint.OAuth2ParameterNames.STATE;

@Slf4j
@RestController
@CrossOrigin
@RequestMapping
@Api(tags = {"auth"})
public class AuthController {

    static final String POLLY_TOKEN_COOKIE_NAME = "polly-token";
    private static final String REGISTRATION_ID = "azure";

    private final AzureTokenProvider azureTokenProvider;
    private final Encryptor encryptor;
    private final OAuth2AuthorizationRequestResolver resolver;
    private final RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();

    public AuthController(AzureTokenProvider azureTokenProvider, Encryptor refreshTokenEncryptor, OAuth2AuthorizationRequestResolver resolver) {
        this.azureTokenProvider = azureTokenProvider;
        this.encryptor = refreshTokenEncryptor;
        this.resolver = resolver;
    }

    @ApiOperation(value = "Login using azure sso")
    @ApiResponses(value = {
            @ApiResponse(code = 302, message = "Redirect to azure")
    })
    @GetMapping("/login")
    public void login(HttpServletRequest request, HttpServletResponse response,
            @RequestParam(value = REDIRECT_URI, required = false) String redirectUri,
            @RequestParam(value = ERROR_URI, required = false) String errorUri
    ) throws IOException {
        log.debug("Request to login");
        var usedRedirect = redirectUri != null ? redirectUri : substringBefore(fullRequestUrlWithoutQuery(request), "/login");
        String redirectUrl = createAuthRequestRedirectUrl(request, usedRedirect, errorUri);
        redirectStrategy.sendRedirect(request, response, redirectUrl);
    }

    @ApiOperation(value = "oidc callback")
    @ApiResponses(value = {
            @ApiResponse(code = 302, message = "token accepted"),
            @ApiResponse(code = 500, message = "internal error")
    })
    @GetMapping("/login/oauth2/code/{registrationId}")
    public void oidc(HttpServletRequest request, HttpServletResponse response,
            @PathVariable String registrationId,
            @RequestParam(value = CODE, required = false) String code,
            @RequestParam(value = ERROR, required = false) String error,
            @RequestParam(value = ERROR_DESCRIPTION, required = false) String errorDesc,
            @RequestParam(STATE) String stateJson
    ) throws IOException {
        log.debug("Request to auth");
        Assert.isTrue(REGISTRATION_ID.equals(registrationId), "Invaid registrationId");
        OAuthState state;
        try {
            state = OAuthState.fromJson(stateJson, encryptor);
        } catch (Exception e) {
            throw new PollyTechnicalException("invalid state", e);
        }
        if (StringUtils.hasText(code)) {
            var refreshToken = azureTokenProvider.acquireTokenForAuthCode(code, fullRequestUrlWithoutQuery(request));
            log.debug("Refreshtoken fetched for {}", refreshToken.getUserInfo().getUniqueId());
            response.addCookie(createTokenCookie(refreshToken, request));
            redirectStrategy.sendRedirect(request, response, state.getRedirectUri());
        } else {
            String errorRedirect = state.errorRedirect(error, errorDesc);
            redirectStrategy.sendRedirect(request, response, errorRedirect);
        }
    }

    @ApiOperation(value = "Logout")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Logged out"),
            @ApiResponse(code = 302, message = "Logged out")
    })
    @GetMapping("/logout")
    public void logout(HttpServletRequest request, HttpServletResponse response,
            @RequestParam(value = REDIRECT_URI, required = false) String redirectUri
    ) throws IOException {
        log.debug("Request to logout");
        response.addCookie(createCookie(null, 0, request));
        if (redirectUri != null) {
            redirectStrategy.sendRedirect(request, response, new OAuthState(redirectUri).getRedirectUri());
        }
    }

    @ApiOperation(value = "User info")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "userinfo returned", response = UserInfoResponse.class),
            @ApiResponse(code = 500, message = "internal error")
    })
    @GetMapping("/userinfo")
    public ResponseEntity<UserInfoResponse> userinfo() {
        log.debug("Request to userinfo");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(((UserInfo) authentication.getDetails()).convertToResponse());
    }

    private String createAuthRequestRedirectUrl(HttpServletRequest request, String redirectUri, String errorUri) {
        return OAuth2AuthorizationRequest.from(resolver.resolve(request, REGISTRATION_ID))
                .state(new OAuthState(redirectUri, errorUri).toJson(encryptor))
                .build().getAuthorizationRequestUri();
    }

    private Cookie createTokenCookie(AuthenticationResult refreshToken, HttpServletRequest request) {
        String encryptedToken = encryptor.encrypt(refreshToken.getRefreshToken());
        return createCookie(encryptedToken, (int) Duration.ofDays(14).toSeconds(), request);
    }

    private Cookie createCookie(String value, int maxAge, HttpServletRequest request) {
        Cookie cookie = new Cookie(POLLY_TOKEN_COOKIE_NAME, value);
        cookie.setMaxAge(maxAge);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setSecure(!"localhost".equals(request.getServerName()));
        return cookie;
    }

    private String fullRequestUrlWithoutQuery(HttpServletRequest request) {
        return UriComponentsBuilder.fromHttpUrl(UrlUtils.buildFullRequestUrl(request))
                .replaceQuery(null)
                .build()
                .toUriString();
    }

}
