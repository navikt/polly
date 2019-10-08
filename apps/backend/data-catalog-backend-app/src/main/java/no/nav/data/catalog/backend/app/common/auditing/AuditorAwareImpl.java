package no.nav.data.catalog.backend.app.common.auditing;

import com.microsoft.azure.spring.autoconfigure.aad.UserPrincipal;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

public class AuditorAwareImpl implements AuditorAware<String> {

    @Override
    public Optional<String> getCurrentAuditor() {
        return Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .map(authentication -> (UserPrincipal) authentication.getPrincipal())
                .map(principal -> String.format("%s - %s", getNAVident(principal), principal.getName()))
                .or(() -> Optional.of("Datajeger"));
    }

    private String getNAVident(UserPrincipal principal) {
        Object navClaim = principal.getClaim("NAVident");
        return navClaim == null ? "missing-ident" : ((String) navClaim);
    }
}
