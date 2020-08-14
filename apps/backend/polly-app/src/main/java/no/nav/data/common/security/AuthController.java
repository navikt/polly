package no.nav.data.common.security;


import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
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
import org.springframework.security.web.util.UrlUtils;
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
import static org.apache.commons.lang3.StringUtils.substringBefore;
import static org.springframework.security.oauth2.core.endpoint.OAuth2ParameterNames.CODE;
import static org.springframework.security.oauth2.core.endpoint.OAuth2ParameterNames.ERROR;
import static org.springframework.security.oauth2.core.endpoint.OAuth2ParameterNames.ERROR_DESCRIPTION;
import static org.springframework.security.oauth2.core.endpoint.OAuth2ParameterNames.ERROR_URI;
import static org.springframework.security.oauth2.core.endpoint.OAuth2ParameterNames.REDIRECT_URI;
import static org.springframework.security.oauth2.core.endpoint.OAuth2ParameterNames.STATE;

@Slf4j
@RestController
@RequestMapping
@Api(tags = {"auth"})
public class AuthController {

    public static final String OAUTH_2_CALLBACK_URL = "/oauth2/callback";

    private final SecurityProperties securityProperties;
    private final TokenProvider tokenProvider;
    private final Encryptor encryptor;
    private final RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();

    public AuthController(SecurityProperties securityProperties,
            TokenProvider tokenProvider, Encryptor refreshTokenEncryptor) {
        this.securityProperties = securityProperties;
        this.tokenProvider = tokenProvider;
        this.encryptor = refreshTokenEncryptor;
    }

    @ApiOperation(value = "Login using sso")
    @ApiResponses(value = {
            @ApiResponse(code = 302, message = "Redirect to sso"),
            @ApiResponse(code = 400, message = "Invalid request")
    })
    @GetMapping("/login")
    public void login(HttpServletRequest request, HttpServletResponse response,
            @RequestParam(value = REDIRECT_URI, required = false) String redirectUri,
            @RequestParam(value = ERROR_URI, required = false) String errorUri
    ) throws IOException {
        log.debug("Request to login");
        Assert.isTrue(securityProperties.isValidRedirectUri(redirectUri), "Illegal redirect_uri " + redirectUri);
        Assert.isTrue(securityProperties.isValidRedirectUri(errorUri), "Illegal error_uri " + errorUri);
        var usedRedirect = redirectUri != null ? redirectUri : substringBefore(fullRequestUrlWithoutQuery(request), "/login");
        String redirectUrl = tokenProvider.createAuthRequestRedirectUrl(usedRedirect, errorUri, request);
        redirectStrategy.sendRedirect(request, response, redirectUrl);
    }

    @ApiOperation(value = "oidc callback")
    @ApiResponses(value = {
            @ApiResponse(code = 302, message = "token accepted"),
            @ApiResponse(code = 500, message = "internal error")
    })
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
            var session = tokenProvider.createSession(code, fullRequestUrlWithoutQuery(request));
            response.addCookie(createCookie(session, (int) SESSION_LENGTH.toSeconds(), request));
            redirectStrategy.sendRedirect(request, response, state.getRedirectUri());
        } else {
            String errorRedirect = state.errorRedirect(error, errorDesc);
            log.warn("error logging in {}", errorRedirect);
            redirectStrategy.sendRedirect(request, response, errorRedirect);
        }
    }

    @ApiOperation(value = "Logout")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Logged out"),
            @ApiResponse(code = 302, message = "Logged out"),
            @ApiResponse(code = 400, message = "Invalid request")
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

    @ApiOperation(value = "User info")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "userinfo returned", response = UserInfoResponse.class),
            @ApiResponse(code = 500, message = "internal error")
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

    private String fullRequestUrlWithoutQuery(HttpServletRequest request) {
        return UriComponentsBuilder.fromHttpUrl(UrlUtils.buildFullRequestUrl(request))
                .replaceQuery(null)
                .build()
                .toUriString();
    }

}
