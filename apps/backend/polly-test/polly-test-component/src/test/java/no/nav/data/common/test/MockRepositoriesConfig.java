package no.nav.data.common.test;

import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.metamodel.Metamodel;
import no.nav.data.common.auditing.domain.AuditVersionRepository;
import no.nav.data.common.auditing.domain.MailLogRepository;
import no.nav.data.common.mail.EmailServiceImpl;
import no.nav.data.common.security.AuthService;
import no.nav.data.common.security.azure.AADStatelessAuthenticationFilter;
import no.nav.data.common.security.domain.AuthRepository;
import no.nav.data.common.storage.StorageService;
import no.nav.data.common.storage.domain.GenericStorageRepository;
import no.nav.data.polly.alert.domain.AlertRepository;
import no.nav.data.polly.codelist.CodelistRepository;
import no.nav.data.polly.disclosure.domain.DisclosureRepository;
import no.nav.data.polly.document.domain.DocumentRepository;
import no.nav.data.polly.informationtype.InformationTypeRepository;
import no.nav.data.polly.policy.domain.PolicyRepository;
import no.nav.data.polly.process.domain.repo.ProcessRepository;
import no.nav.data.polly.process.dpprocess.domain.repo.DpProcessRepository;
import no.nav.data.polly.processor.domain.repo.ProcessorRepository;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;

import static org.mockito.Mockito.mock;

/**
 * Shared test configuration that mocks all JPA repositories, datasource and
 * infrastructure beans, allowing the Spring context to load without a real database.
 * Designed for use with @SpringBootTest + @Import in component (non-integration) tests.
 */
@TestConfiguration
public class MockRepositoriesConfig {

    @Bean @Primary public DataSource dataSource() { return mock(DataSource.class); }
    @Bean @Primary public EntityManagerFactory entityManagerFactory() {
        EntityManagerFactory emf = mock(EntityManagerFactory.class);
        org.mockito.Mockito.when(emf.getMetamodel()).thenReturn(mock(Metamodel.class));
        return emf;
    }
    @Bean @Primary public PlatformTransactionManager transactionManager() {
        return mock(JpaTransactionManager.class);
    }

    @Bean @Primary public MeterRegistry meterRegistry() { return new SimpleMeterRegistry(); }
    @Bean @Primary public CodelistRepository codelistRepository() { return mock(CodelistRepository.class); }
    @Bean @Primary public GenericStorageRepository genericStorageRepository() { return mock(GenericStorageRepository.class); }
    @Bean @Primary public AuditVersionRepository auditVersionRepository() { return mock(AuditVersionRepository.class); }
    @Bean @Primary public MailLogRepository mailLogRepository() { return mock(MailLogRepository.class); }
    @Bean @Primary public AuthRepository authRepository() { return mock(AuthRepository.class); }
    @Bean @Primary public AuthService authService() { return mock(AuthService.class); }
    @Bean @Primary public AlertRepository alertRepository() { return mock(AlertRepository.class); }
    @Bean @Primary public DisclosureRepository disclosureRepository() { return mock(DisclosureRepository.class); }
    @Bean @Primary public DocumentRepository documentRepository() { return mock(DocumentRepository.class); }
    @Bean @Primary public InformationTypeRepository informationTypeRepository() { return mock(InformationTypeRepository.class); }
    @Bean @Primary public PolicyRepository policyRepository() { return mock(PolicyRepository.class); }
    @Bean @Primary public ProcessRepository processRepository() { return mock(ProcessRepository.class); }
    @Bean @Primary public DpProcessRepository dpProcessRepository() { return mock(DpProcessRepository.class); }
    @Bean @Primary public ProcessorRepository processorRepository() { return mock(ProcessorRepository.class); }
    @Bean @Primary public StorageService storageService() { return mock(StorageService.class); }
    @Bean @Primary public EmailServiceImpl emailServiceImpl() { return mock(EmailServiceImpl.class); }
    @Bean @Primary public AADStatelessAuthenticationFilter aadStatelessAuthenticationFilter() { return mock(AADStatelessAuthenticationFilter.class); }
}


