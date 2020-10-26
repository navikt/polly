package no.nav.data.common.security.azure;

import com.microsoft.graph.models.extensions.IGraphServiceClient;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.security.azure.support.MailLog;
import no.nav.data.common.storage.StorageService;
import org.springframework.stereotype.Service;

import static no.nav.data.common.security.azure.support.MailMessage.compose;

@Slf4j
@Service
public class AzureAdService {

    private final AzureTokenProvider azureTokenProvider;
    private final StorageService storage;

    public AzureAdService(AzureTokenProvider azureTokenProvider, StorageService storage) {
        this.azureTokenProvider = azureTokenProvider;
        this.storage = storage;
    }

    public void sendMail(String to, String subject, String messageBody) {
        getMailGraphClient().me()
                .sendMail(compose(to, subject, messageBody), false)
                .buildRequest()
                .post();

        storage.save(MailLog.builder().to(to).subject(subject).body(messageBody).build());
    }

    private IGraphServiceClient getMailGraphClient() {
        return azureTokenProvider.getGraphClient(azureTokenProvider.getMailAccessToken());
    }

}
