package no.nav.data.polly.common.jpa;

import no.nav.data.polly.AppStarter;
import no.nav.data.polly.codelist.CodelistRepository;
import no.nav.data.polly.codelist.domain.Codelist;
import no.nav.data.polly.common.auditing.AuditVersionListener;
import no.nav.data.polly.common.auditing.AuditorAwareImpl;
import no.nav.data.polly.common.auditing.domain.AuditVersionRepository;
import no.nav.data.polly.common.utils.MdcUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.support.TransactionTemplate;

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
    @Order(10)
    public ApplicationRunner initAudit(AuditVersionRepository repository) {
        return args -> AuditVersionListener.setRepo(repository);
    }

    @Bean
    @Order(20)
    public ApplicationRunner auditMissingEntities(CodelistRepository codelistRepository, AuditVersionRepository auditVersionRepository, TransactionTemplate tt) {
        Runnable updateMissing = () -> {
            Logger log = LoggerFactory.getLogger("MissingAudits");
            tt.execute(transactionStatus -> {
                List<Codelist> codelists = codelistRepository.findAll();
                codelists.stream().filter(it -> auditVersionRepository.findByTableIdOrderByTimeDesc(AuditVersionListener.getIdForObject(it)).isEmpty())
                        .forEach(it -> {
                            var prevUser = MdcUtils.getUser();
                            MdcUtils.setUser(it.getLastModifiedBy());
                            log.info("Saving audit for codelist {} {}", it.getList(), it.getCode());
                            new AuditVersionListener().prePersist(it);
                            MdcUtils.setUser(prevUser);
                        });
                return null;
            });
        };
        return (args) -> MdcUtils.wrapAsync(updateMissing, "system").run();
    }
}
