package no.nav.data.catalog.backend.app.common.security;

import com.github.benmanes.caffeine.cache.Expiry;
import com.microsoft.aad.adal4j.AuthenticationResult;
import lombok.extern.slf4j.Slf4j;

import java.time.Duration;
import java.time.Instant;

@Slf4j
public class AuthResultExpiry implements Expiry<String, AuthenticationResult> {

    private static final Duration DEFAULT_EXPIRE = Duration.ofMinutes(1);
    private static final Duration MIN_REFRESH_MARGIN = Duration.ofMinutes(10);
    private static final Duration DOUBLE_MIN_REFRESH_MARGIN = MIN_REFRESH_MARGIN.multipliedBy(2);

    @Override
    public long expireAfterCreate(String key, AuthenticationResult value, long currentTime) {
        return expire(value).toNanos();
    }

    @Override
    public long expireAfterUpdate(String key, AuthenticationResult value, long currentTime, long currentDuration) {
        return currentDuration;
    }

    @Override
    public long expireAfterRead(String key, AuthenticationResult value, long currentTime, long currentDuration) {
        return currentDuration;
    }

    private Duration expire(AuthenticationResult value) {
        if (value.getExpiresAfter() == 0) {
            log.debug("Token TTL missing default cache expire {}s", DEFAULT_EXPIRE.toSeconds());
            return DEFAULT_EXPIRE;
        }
        Duration duration = Duration.between(Instant.now(), value.getExpiresOnDate().toInstant());
        Duration expire = suggestedRefreshInterval(duration);
        log.debug("Token TTL {}s cache expire {}s", duration.toSeconds(), expire.toSeconds());
        return expire;
    }

    private static Duration suggestedRefreshInterval(Duration duration) {
        if (duration.minus(DOUBLE_MIN_REFRESH_MARGIN).isNegative()) {
            return duration.dividedBy(2);
        } else {
            return duration.minus(MIN_REFRESH_MARGIN);
        }
    }
}
