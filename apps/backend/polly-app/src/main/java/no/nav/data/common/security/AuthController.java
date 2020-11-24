package no.nav.data.common.security;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.exceptions.TechnicalException;
import no.nav.data.common.security.dto.OAuthState;
import no.nav.data.common.security.dto.UserInfo;
import no.nav.data.common.security.dto.UserInfoResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import static no.nav.data.common.security.SecurityConstants.COOKIE_NAME;
import static no.nav.data.common.utils.Constants.SESSION_LENGTH;
import static org.springframework.security.oauth2.core.endpoint.OAuth2ParameterNames.CODE;
import static org.springframework.security.oauth2.core.endpoint.OAuth2ParameterNames.ERROR;
import static org.springframework.security.oauth2.core.endpoint.OAuth2ParameterNames.ERROR_DESCRIPTION;
import static org.springframework.security.oauth2.core.endpoint.OAuth2ParameterNames.ERROR_URI;
import static org.springframework.security.oauth2.core.endpoint.OAuth2ParameterNames.REDIRECT_URI;
import static org.springframework.security.oauth2.core.endpoint.OAuth2ParameterNames.STATE;
import static org.springframework.security.web.util.UrlUtils.buildFullRequestUrl;

@Slf4j
@RestController
@RequestMapping
@Tag(name = "Auth")
public class AuthController {

    public static final String OAUTH_2_CALLBACK_URL = "/oauth2/callback";

    private final SecurityProperties securityProperties;
    private final TokenProvider tokenProvider;
    private final Encryptor encryptor;
    private final RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();
    private final String baseUrl;

    public AuthController(SecurityProperties securityProperties,
            TokenProvider tokenProvider, Encryptor refreshTokenEncryptor) {
        this.securityProperties = securityProperties;
        this.tokenProvider = tokenProvider;
        this.encryptor = refreshTokenEncryptor;
        baseUrl = securityProperties.findBaseUrl();
    }

    @Operation(summary = "Login using sso")
    @ApiResponse(description = "Redirect to sso")
    @GetMapping("/login")
    public void login(HttpServletRequest request, HttpServletResponse response,
            @RequestParam(value = REDIRECT_URI, required = false) String redirectUri,
            @RequestParam(value = ERROR_URI, required = false) String errorUri
    ) throws IOException {
        log.debug("Request to login");
        Assert.isTrue(securityProperties.isValidRedirectUri(redirectUri), "Illegal redirect_uri " + redirectUri);
        Assert.isTrue(securityProperties.isValidRedirectUri(errorUri), "Illegal error_uri " + errorUri);
        var usedRedirect = redirectUri != null ? redirectUri : baseUrl;
        String redirectUrl = tokenProvider.createAuthRequestRedirectUrl(usedRedirect, errorUri, callbackRedirectUri(request));
        redirectStrategy.sendRedirect(request, response, redirectUrl);
    }

    @Operation(summary = "oidc callback")
    @ApiResponse(responseCode = "302", description = "token accepted")
    @CrossOrigin
    @PostMapping(OAUTH_2_CALLBACK_URL)
    public void oidc(HttpServletRequest request, HttpServletResponse response,
            @RequestParam(value = CODE, required = false) String code,
            @RequestParam(value = ERROR, required = false) String error,
            @RequestParam(value = ERROR_DESCRIPTION, required = false) String errorDesc,
            @RequestParam(STATE) String stateJson
    ) throws IOException {
        log.debug("Request to auth");
        OAuthState state;
        try {
            state = OAuthState.fromJson(stateJson, encryptor);
        } catch (Exception e) {
            throw new TechnicalException("invalid state", e);
        }
        if (StringUtils.hasText(code)) {
            var session = tokenProvider.createSession(code, callbackRedirectUri(request));
            response.addCookie(createCookie(session, (int) SESSION_LENGTH.toSeconds(), request));
            redirectStrategy.sendRedirect(request, response, state.getRedirectUri());
        } else {
            String errorRedirect = state.errorRedirect(error, errorDesc);
            log.warn("error logging in {}", errorRedirect);
            redirectStrategy.sendRedirect(request, response, errorRedirect);
        }
    }

    @Operation(summary = "Logout")
    @ApiResponses(value = {
            @ApiResponse(description = "Logged out"),
            @ApiResponse(responseCode = "302", description = "Logged out")
    })
    @GetMapping("/logout")
    public void logout(HttpServletRequest request, HttpServletResponse response,
            @RequestParam(value = REDIRECT_URI, required = false) String redirectUri
    ) throws IOException {
        log.debug("Request to logout");
        Assert.isTrue(securityProperties.isValidRedirectUri(redirectUri), "Illegal redirect_uri " + redirectUri);
        tokenProvider.destroySession();
        response.addCookie(createCookie(null, 0, request));
        if (redirectUri != null) {
            redirectStrategy.sendRedirect(request, response, new OAuthState(redirectUri).getRedirectUri());
        }
    }

    @Operation(summary = "User info")
    @ApiResponses(value = {
            @ApiResponse(description = "userinfo returned")

    })
    @GetMapping("/userinfo")
    public ResponseEntity<UserInfoResponse> userinfo() {
        log.debug("Request to userinfo");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.ok(UserInfoResponse.noUser(securityProperties.isEnabled()));
        }
        return ResponseEntity.ok(((UserInfo) authentication.getDetails()).convertToResponse());
    }

    public static Cookie createCookie(String value, int maxAge, HttpServletRequest request) {
        Cookie cookie = new Cookie(COOKIE_NAME, value);
        cookie.setMaxAge(maxAge);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setSecure(!"localhost".equals(request.getServerName()));
        return cookie;
    }

    private String callbackRedirectUri(HttpServletRequest request) {
        String redirectUri = UriComponentsBuilder.fromHttpUrl(buildFullRequestUrl(request))
                .replacePath(OAUTH_2_CALLBACK_URL)
                .replaceQuery(null).build().toUriString();
        Assert.isTrue(securityProperties.isValidRedirectUri(redirectUri), "Invalid redirect uri " + redirectUri);
        return redirectUri;
    }

}
