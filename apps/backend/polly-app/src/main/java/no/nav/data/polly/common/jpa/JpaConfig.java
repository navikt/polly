package no.nav.data.polly.common.jpa;

import no.nav.data.polly.AppStarter;
import no.nav.data.polly.common.auditing.AuditVersionListener;
import no.nav.data.polly.common.auditing.AuditorAwareImpl;
import no.nav.data.polly.common.auditing.domain.AuditVersionRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EntityScan(basePackageClasses = AppStarter.class)
@EnableJpaRepositories(basePackageClasses = AppStarter.class)
@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
public class JpaConfig {

    @Bean
    public AuditorAware<String> auditorAware() {
        return new AuditorAwareImpl();
    }

    @Bean
    public ApplicationRunner initAudit(AuditVersionRepository repository) {
        return args -> AuditVersionListener.setRepo(repository);
    }

}
