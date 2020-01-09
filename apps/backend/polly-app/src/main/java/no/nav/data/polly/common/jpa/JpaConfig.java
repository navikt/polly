package no.nav.data.polly.common.jpa;

import no.nav.data.polly.AppStarter;
import no.nav.data.polly.common.auditing.AuditVersionListener;
import no.nav.data.polly.common.auditing.AuditorAwareImpl;
import no.nav.data.polly.common.auditing.domain.AuditVersionRepository;
import no.nav.data.polly.common.utils.MdcUtils;
import no.nav.data.polly.informationtype.InformationTypeRepository;
import no.nav.data.polly.informationtype.domain.InformationType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.util.List;

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
        return (args) -> AuditVersionListener.setRepo(repository);
    }

    @Bean
    public ApplicationRunner auditMissingEntities(InformationTypeRepository informationTypeRepository, AuditVersionRepository auditVersionRepository) {
        Runnable updateMissing = () -> {
            Logger log = LoggerFactory.getLogger("MissingAudits");
            List<InformationType> all = informationTypeRepository.findAll();
            all.stream().filter(it -> auditVersionRepository.findByTableIdOrderByTimeDesc(it.getId().toString()).isEmpty())
                    .forEach(it -> {
                        log.info("Saving audit for informationType {}", it.getId());
                        new AuditVersionListener().prePersist(it);
                    });
        };
        return (args) -> MdcUtils.wrapAsync(updateMissing, "system").run();
    }
}
