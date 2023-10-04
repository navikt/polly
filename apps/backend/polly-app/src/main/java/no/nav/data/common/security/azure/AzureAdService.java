package no.nav.data.common.security.azure;

import com.microsoft.graph.models.UserSendMailParameterSet;
import com.microsoft.graph.requests.GraphServiceClient;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.mail.EmailProvider;
import no.nav.data.common.mail.MailTask;
import no.nav.data.common.storage.StorageService;
import okhttp3.Request;
import org.springframework.stereotype.Service;

import static no.nav.data.common.security.azure.support.MailMessage.compose;

@Slf4j
@Service
public class AzureAdService implements EmailProvider {

    private final AzureTokenProvider azureTokenProvider;
    private final StorageService storage;

    public AzureAdService(AzureTokenProvider azureTokenProvider, StorageService storage) {
        this.azureTokenProvider = azureTokenProvider;
        this.storage = storage;
    }

    @Override
    public void sendMail(MailTask mailTask) {
        try {
            log.debug("sending mail: " + mailTask.toString());
            getMailGraphClient().me()
                    .sendMail(UserSendMailParameterSet.newBuilder()
                            .withMessage(compose(mailTask.getTo(), mailTask.getSubject(), mailTask.getBody()))
                            .withSaveToSentItems(false)
                            .build())
                    .buildRequest()
                    .post();
        } catch (Exception e) {
            log.debug("mail sent error: " + e);
        }

        storage.save(mailTask.toMailLog());
    }

    private GraphServiceClient<Request> getMailGraphClient() {
        return azureTokenProvider.getGraphClient(azureTokenProvider.getMailAccessToken());
    }

}
