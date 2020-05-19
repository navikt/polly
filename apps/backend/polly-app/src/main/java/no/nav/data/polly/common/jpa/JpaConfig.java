package no.nav.data.polly.common.jpa;

import io.prometheus.client.hibernate.HibernateStatisticsCollector;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.AppStarter;
import no.nav.data.polly.codelist.CodelistRepository;
import no.nav.data.polly.codelist.domain.Codelist;
import no.nav.data.polly.common.auditing.AuditVersionListener;
import no.nav.data.polly.common.auditing.AuditorAwareImpl;
import no.nav.data.polly.common.auditing.domain.AuditVersionRepository;
import no.nav.data.polly.common.utils.MdcUtils;
import no.nav.data.polly.policy.domain.LegalBasesUse;
import no.nav.data.polly.policy.domain.PolicyData;
import no.nav.data.polly.process.ProcessService;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessRepository;
import org.hibernate.SessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.support.TransactionTemplate;

import java.util.List;
import javax.persistence.EntityManagerFactory;

import static no.nav.data.polly.common.utils.MdcUtils.wrapAsync;

@Slf4j
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

    @Bean
    @DependsOn("initAudit")
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
        return (args) -> wrapAsync(updateMissing, "system").run();
    }

    @Bean
    @DependsOn("initAudit")
    public ApplicationRunner migrate(ProcessRepository processRepository, ProcessService processService, TransactionTemplate tt) {
        return (args) -> wrapAsync(() -> {
            log.debug("Running migrations");
            tt.execute(status -> {
                Pageable pageReq = PageRequest.of(0, 20, Sort.by("id"));
                while (true) {
                    Page<Process> page = processRepository.findAll(pageReq);
                    page.getContent().forEach(process -> {
                        var prevUser = MdcUtils.getUser();
                        MdcUtils.setUser(process.getLastModifiedBy());
                        process.getPolicies().forEach(p -> p.getData().setLegalBasesUse(legalBasesUseFor(p.getData())));
                        processService.save(process);
                        MdcUtils.setUser(prevUser);
                    });
                    if (!page.hasNext()) {
                        break;
                    }
                    pageReq = page.nextPageable();
                }
                return null;
            });
        }, "Database migration").run();
    }

    private LegalBasesUse legalBasesUseFor(PolicyData policyData) {
        if (policyData.isLegalBasesInherited()) {
            return LegalBasesUse.INHERITED_FROM_PROCESS;
        }
        return policyData.getLegalBases().isEmpty() ? LegalBasesUse.UNRESOLVED : LegalBasesUse.DEDICATED_LEGAL_BASES;
    }


    @Bean
    public ApplicationRunner initHibernateMetrics(EntityManagerFactory emf) {
        return args -> new HibernateStatisticsCollector(emf.unwrap(SessionFactory.class), "main").register();
    }
}
