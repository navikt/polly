package no.nav.data.polly.common.security;

import com.microsoft.aad.msal4j.IAuthenticationResult;
import org.junit.jupiter.api.Test;

import java.time.Duration;
import java.time.ZonedDateTime;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AuthResultExpiryTest {

    private final AuthResultExpiry expiry = new AuthResultExpiry();

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

    private IAuthenticationResult createAuth(long expiresInSeconds) {
        var ar = mock(IAuthenticationResult.class);
        when(ar.expiresOnDate()).thenReturn(new Date(ZonedDateTime.now().plusSeconds(expiresInSeconds).toEpochSecond() * 1000));
        return ar;
    }

}