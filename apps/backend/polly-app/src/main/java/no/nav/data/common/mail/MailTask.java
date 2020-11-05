package no.nav.data.common.mail;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.common.security.azure.support.MailLog;
import no.nav.data.common.storage.domain.ChangeStamp;
import no.nav.data.common.storage.domain.GenericStorageData;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MailTask implements GenericStorageData {

    private String to;
    private String subject;
    private String body;

    private ChangeStamp changeStamp;

    public MailLog toMailLog() {
        return MailLog.builder().to(to).subject(subject).body(body).build();
    }
}
