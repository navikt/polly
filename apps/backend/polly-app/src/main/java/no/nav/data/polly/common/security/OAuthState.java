package no.nav.data.polly.common.security;

import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.common.utils.JsonUtils;
import org.springframework.util.Assert;
import org.springframework.web.util.UriComponentsBuilder;

import static org.springframework.security.oauth2.core.endpoint.OAuth2ParameterNames.ERROR;
import static org.springframework.security.oauth2.core.endpoint.OAuth2ParameterNames.ERROR_DESCRIPTION;
import static org.springframework.security.web.util.UrlUtils.isValidRedirectUrl;

/**
 * Encrypted json to ensure origin of state and code
 */
@Data
@NoArgsConstructor(access = AccessLevel.PRIVATE)
class OAuthState {

    private String redirectUri;
    private String errorUri;

    OAuthState(String redirectUri) {
        this(redirectUri, null);
    }

    OAuthState(String redirectUri, String errorUri) {
        this.redirectUri = redirectUri;
        this.errorUri = errorUri != null ? errorUri : redirectUri;
        validate();
    }

    String errorRedirect(String error, String errorDesc) {
        return UriComponentsBuilder.fromUriString(getErrorUri())
                .queryParam(ERROR, error)
                .queryParam(ERROR_DESCRIPTION, errorDesc)
                .build().toUriString();
    }

    static OAuthState fromJson(String encryptedJson, Encryptor encryptor) {
        var json = encryptor.decrypt(encryptedJson);
        OAuthState state = JsonUtils.toObject(json, OAuthState.class);
        state.validate();
        return state;
    }

    String toJson(Encryptor encryptor) {
        String json = JsonUtils.toJson(this);
        return encryptor.encrypt(json);
    }

    private void validate() {
        Assert.isTrue(isValidRedirectUrl(redirectUri), "Invalid redirectUri");
        Assert.isTrue(isValidRedirectUrl(errorUri), "Invalid errorUri");
    }
}
