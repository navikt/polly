package no.nav.data.common.mail;

import no.nav.data.common.security.SecurityProperties;
import no.nav.data.common.storage.StorageService;
import no.nav.data.common.storage.domain.GenericStorage;
import no.nav.data.common.storage.domain.GenericStorageRepository;
import no.nav.data.common.storage.domain.StorageType;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.slf4j.Slf4j;

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
        tasks.forEach(this::sendMailAndDeleteTask);
    }
    
    @Transactional // Viktig med en transaksjon per mail, slik at ikke allerede sendte mails blir rullet tilbake til repo ved feil 
    void sendMailAndDeleteTask(GenericStorage task) {
        MailTask mailTask = task.getDataObject(MailTask.class);
        try {
            sendMail(mailTask);
            storageRepository.delete(task);
        } catch (RuntimeException e) {
            // Keep task so scheduler can retry later.
            log.error("Failed to send scheduled mail (will retry). to={} subject='{}' taskId={}", mailTask.getTo(), mailTask.getSubject(), task.getId(), e);
            throw e;
        }
    }

}
