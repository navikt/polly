package no.nav.data.common.mail;

import no.nav.data.common.storage.StorageService;
import no.nav.data.common.storage.domain.GenericStorageRepository;
import no.nav.data.common.storage.domain.StorageType;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private final StorageService storage;
    private final GenericStorageRepository storageRepository;
    private final EmailProvider emailProvider;

    public EmailServiceImpl(StorageService storage, GenericStorageRepository storageRepository, EmailProvider emailProvider) {
        this.storage = storage;
        this.storageRepository = storageRepository;
        this.emailProvider = emailProvider;
    }

    @Override
    public void sendMail(MailTask mailTask) {
        emailProvider.sendMail(mailTask);
    }

    @Override
    public void scheduleMail(MailTask mailTask) {
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
