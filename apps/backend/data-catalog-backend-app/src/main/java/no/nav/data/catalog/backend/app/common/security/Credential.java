package no.nav.data.catalog.backend.app.common.security;

import lombok.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

@Value
public class Credential {

    private String accessToken;
    private String refreshToken;

    public boolean hasRefreshToken() {
        return refreshToken != null;
    }

    public static Optional<Credential> getCredential() {
        return Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .filter(Authentication::isAuthenticated)
                .map(authentication -> authentication.getCredentials() instanceof Credential ? (Credential) authentication.getCredentials() : null);
    }
}
