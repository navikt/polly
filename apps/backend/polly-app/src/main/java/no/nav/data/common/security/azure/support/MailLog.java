package no.nav.data.common.security.azure.support;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.common.storage.domain.ChangeStamp;
import no.nav.data.common.storage.domain.GenericStorageData;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MailLog implements GenericStorageData {

    private ChangeStamp changeStamp;

    private String to;
    private String subject;
    private String body;
}
