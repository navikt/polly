package no.nav.data.common.mail;

import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.security.SecurityProperties;
import no.nav.data.common.storage.StorageService;
import no.nav.data.common.storage.domain.GenericStorage;
import no.nav.data.common.storage.domain.GenericStorageRepository;
import no.nav.data.common.storage.domain.StorageType;

@Slf4j
@Service
public class EmailServiceImpl implements EmailService {

    private final StorageService storage;
    private final GenericStorageRepository storageRepository;
    private final EmailProvider emailProvider;
    private final SecurityProperties securityProperties;

    public EmailServiceImpl(StorageService storage, GenericStorageRepository storageRepository, EmailProvider emailProvider,
            SecurityProperties securityProperties) {
        this.storage = storage;
        this.storageRepository = storageRepository;
        this.emailProvider = emailProvider;
        this.securityProperties = securityProperties;
    }

    @Override
    public void sendMail(MailTask mailTask) {
        var toSend = securityProperties.isDev() ? mailTask.withSubject(mailTask.getSubject() + " [DEV]") : mailTask;
        emailProvider.sendMail(toSend);
    }

    @Override
    @Transactional
    public void scheduleMail(MailTask mailTask) {
        storage.save(mailTask);
    }

    @Scheduled(initialDelayString = "PT3M", fixedRateString = "PT5M")
    public void sendMails() {
        var tasks = storageRepository.findAllByType(StorageType.MAIL_TASK);
        for (GenericStorage task : tasks) {
            try {
                sendMailAndDeleteTask(task);
            } catch (OptimisticLockingFailureException e) {
                // MAIL_TASK-rader har optimistisk låsing. Begge replikaene poller de samme radene,
                // så taperen skal bare hoppe over oppgaven (den andre har sendt den) og fortsette
                // med resten av batchen i stedet for å avbryte hele kjøringen.
                log.info("Mail task already handled by another instance, skipping");
            }
        }
    }
    
    @Transactional
    void sendMailAndDeleteTask(GenericStorage task) {
        // Vi må slette først, siden det kan medføre exception (f.eks. OptimisticLockingFailureException)
        // Ingen problem hvis sendMail feiler med RTE, vil medfører rollback av delete
        storageRepository.delete(task); 
        sendMail(task.getDataObject(MailTask.class));
    }

}
