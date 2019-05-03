package no.nav.data.catalog.backend.app.common.auditing;

import org.springframework.data.domain.AuditorAware;

import java.util.Optional;

public class AuditorAwareImpl implements AuditorAware<String> {
    @Override
    public Optional<String> getCurrentAuditor() {
        return Optional.of("Datajeger");
        // Use below commented code when will use Spring Security.
    }
}
