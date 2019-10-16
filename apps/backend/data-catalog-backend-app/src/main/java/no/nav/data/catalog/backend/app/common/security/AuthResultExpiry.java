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
        Instant tokenExpiryInstant = value.getExpiresOnDate().toInstant();
        long expireMillis = suggestedRefreshInterval(Duration.between(Instant.now(), tokenExpiryInstant).toMillis());
        return Duration.ofMillis(expireMillis).toNanos();
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
