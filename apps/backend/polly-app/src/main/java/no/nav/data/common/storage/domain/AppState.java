package no.nav.data.common.storage.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AppState implements GenericStorageData {

    private boolean lock;
    private boolean alertEventsInitialized;
    private ChangeStamp changeStamp;
}
