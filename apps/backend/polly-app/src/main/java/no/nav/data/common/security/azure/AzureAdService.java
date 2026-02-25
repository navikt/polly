package no.nav.data.common.security.azure;


import com.microsoft.graph.serviceclient.GraphServiceClient;
import com.microsoft.graph.users.item.sendmail.SendMailPostRequestBody;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.exceptions.TechnicalException;
import no.nav.data.common.mail.EmailProvider;
import no.nav.data.common.mail.MailTask;
import no.nav.data.common.storage.StorageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static no.nav.data.common.security.azure.support.MailMessage.compose;

@Slf4j
@Service
@RequiredArgsConstructor
public class AzureAdService implements EmailProvider {

    private final AzureTokenProvider azureTokenProvider;
    private final StorageService storage;

    @Override
    @Transactional
    public void sendMail(MailTask mailTask) {
        // Don't log body; subject + recipient is enough to correlate business events.
        log.info("sending mail subject='{}' to {}", mailTask.getSubject(), mailTask.getTo());

        SendMailPostRequestBody sendMailPostRequestBody = new SendMailPostRequestBody();
        sendMailPostRequestBody.setMessage(compose(mailTask.getTo(), mailTask.getSubject(), mailTask.getBody()));
        sendMailPostRequestBody.setSaveToSentItems(true);

        try {
            getMailGraphClient().me().sendMail().post(sendMailPostRequestBody);
            storage.save(mailTask.toMailLog());
        } catch (RuntimeException e) {
            log.error("Failed to send mail via Microsoft Graph for to={} subject='{}'", mailTask.getTo(), mailTask.getSubject(), e);
            throw new TechnicalException("Failed to send mail via Microsoft Graph", e);
        }
    }

    private GraphServiceClient getMailGraphClient() {
        return azureTokenProvider.getGraphClient(azureTokenProvider.getMailAccessToken());
    }

}
