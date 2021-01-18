package no.nav.data.common.jpa;

import io.prometheus.client.hibernate.HibernateStatisticsCollector;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.AppStarter;
import no.nav.data.common.auditing.AuditVersionListener;
import no.nav.data.common.auditing.AuditorAwareImpl;
import no.nav.data.common.auditing.domain.AuditVersionRepository;
import no.nav.data.common.utils.MdcUtils;
import no.nav.data.polly.codelist.CodelistRepository;
import no.nav.data.polly.codelist.domain.Codelist;
import no.nav.data.polly.process.ProcessService;
import no.nav.data.polly.process.domain.sub.DataProcessing;
import no.nav.data.polly.processor.domain.Processor;
import no.nav.data.polly.processor.domain.ProcessorData;
import no.nav.data.polly.processor.domain.repo.ProcessorRepository;
import org.hibernate.SessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.support.TransactionTemplate;

import java.util.List;
import javax.persistence.EntityManagerFactory;

import static no.nav.data.common.utils.MdcUtils.wrapAsync;
import static no.nav.data.common.utils.StreamUtils.convert;

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
    public ApplicationRunner initHibernateMetrics(EntityManagerFactory emf) {
        return args -> new HibernateStatisticsCollector(emf.unwrap(SessionFactory.class), "main").register();
    }

    @Bean
    @DependsOn("initAudit")
    public ApplicationRunner migrateProcessors(ProcessService processService, ProcessorRepository processorRepository, TransactionTemplate tt) {
        return args -> wrapAsync(() -> processService.runPaged(process -> {
            if (process.getData().getDataProcessing().getProcessors() != null) {
                return;
            }
            tt.executeWithoutResult(ts -> {
                DataProcessing dp = process.getData().getDataProcessing();

                if (dp.getDataProcessor() != Boolean.TRUE) {
                    dp.setProcessors(List.of());
                } else {
                    var processors = convert(dp.getDataProcessorAgreements(), agreement -> Processor.builder()
                            .generateId()
                            .data(ProcessorData.builder()
                                    .name("%d: %s".formatted(process.getData().getNumber(), agreement))
                                    .contract(agreement)
                                    .outsideEU(dp.getDataProcessorOutsideEU())
                                    .transferGroundsOutsideEU(dp.getTransferGroundsOutsideEU())
                                    .transferGroundsOutsideEUOther(dp.getTransferGroundsOutsideEUOther())
                                    .countries(dp.getTransferCountries())
                                    .build())
                            .build());
                    processorRepository.saveAll(processors);
                    dp.setProcessors(convert(processors, Processor::getId));
                }
                processService.save(process);
            });
        }, 10), "migration").run();
    }
}
