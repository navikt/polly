package no.nav.data.polly.common.security;

import com.microsoft.aad.adal4j.AuthenticationResult;
import org.junit.jupiter.api.Test;

import java.time.Duration;

import static org.assertj.core.api.Assertions.assertThat;

class AuthResultExpiryTest {

    private AuthResultExpiry expiry = new AuthResultExpiry();

    @Test
    void expireAfterNoExpire() {
        long l = expiry.expireAfterCreate("", createAuth(0), 0);
        assertThat(l).isEqualTo(Duration.ofMinutes(1).toNanos());
    }

    @Test
    void expireAfterCreateShort() {
        long l = expiry.expireAfterCreate("", createAuth(60L), 0);
        assertThat(l).isBetween(Duration.ofSeconds(29).toNanos(), Duration.ofSeconds(31).toNanos());
    }

    @Test
    void expireAfterCreateLong() {
        long l = expiry.expireAfterCreate("", createAuth(Duration.ofMinutes(30).toSeconds()), 0);
        assertThat(l).isBetween(Duration.ofMinutes(20).minusSeconds(1).toNanos(), Duration.ofMinutes(20).plusSeconds(1).toNanos());
    }

    @Test
    void expireAfterUpdate() {
        assertThat(expiry.expireAfterUpdate("", null, 0, 100)).isEqualTo(100);
    }

    @Test
    void expireAfterRead() {
        assertThat(expiry.expireAfterRead("", null, 0, 100)).isEqualTo(100);
    }

    private AuthenticationResult createAuth(long expiresInSeconds) {
        return new AuthenticationResult("", "", "", expiresInSeconds, "", null, false);
    }
}