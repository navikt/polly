package no.nav.data.common.mail;

import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.security.SecurityProperties;
import no.nav.data.common.storage.StorageService;
import no.nav.data.common.storage.domain.GenericStorageRepository;
import no.nav.data.common.storage.domain.StorageType;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

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
    public void scheduleMail(MailTask mailTask) {
        log.debug("new mail task recived: " + mailTask.toString());
        storage.save(mailTask);
    }

    @Scheduled(initialDelayString = "PT3M", fixedRateString = "PT5M")
    public void sendMails() {
        var tasks = storageRepository.findAllByType(StorageType.MAIL_TASK);

        tasks.forEach(task -> {
            sendMail(task.getDataObject(MailTask.class));
            storageRepository.delete(task);
        });
    }
}
