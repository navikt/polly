package no.nav.data.catalog.backend.app.common.security;

import com.microsoft.aad.adal4j.AuthenticationResult;
import org.junit.jupiter.api.Test;

import java.time.Duration;

import static org.assertj.core.api.Assertions.assertThat;

class AuthResultExpiryTest {

    private AuthResultExpiry expiry = new AuthResultExpiry();

    @Test
    void expireAfterCreate() {
        long l = expiry.expireAfterCreate("", createAuth(), 0);
        assertThat(l).isBetween(Duration.ofSeconds(30).minusSeconds(1).toNanos(), Duration.ofSeconds(30).plusSeconds(1).toNanos());
    }

    @Test
    void expireAfterUpdate() {
        assertThat(expiry.expireAfterUpdate("", null, 0, 100)).isEqualTo(100);
    }

    @Test
    void expireAfterRead() {
        assertThat(expiry.expireAfterRead("", null, 0, 100)).isEqualTo(100);
    }

    private AuthenticationResult createAuth() {
        return new AuthenticationResult("", "", "", 60, "", null, false);
    }
}