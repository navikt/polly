package no.nav.data.catalog.backend.app.common.security;

import com.github.benmanes.caffeine.cache.Expiry;
import com.microsoft.aad.adal4j.AuthenticationResult;

import java.time.Duration;
import java.time.Instant;

import static no.nav.vault.jdbc.hikaricp.VaultUtil.suggestedRefreshInterval;

public class AuthResultExpiry implements Expiry<String, AuthenticationResult> {

    @Override
    public long expireAfterCreate(String key, AuthenticationResult value, long currentTime) {
        if (value.getExpiresOnDate() == null) {
            return Duration.ofMinutes(5).toNanos();
        }
        Instant expiryInstant = value.getExpiresOnDate().toInstant();
        return suggestedRefreshInterval(Duration.between(Instant.now(), expiryInstant).toMillis()) * 1000;
    }

    @Override
    public long expireAfterUpdate(String key, AuthenticationResult value, long currentTime, long currentDuration) {
        return currentDuration;
    }

    @Override
    public long expireAfterRead(String key, AuthenticationResult value, long currentTime, long currentDuration) {
        return currentDuration;
    }
}
