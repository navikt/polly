package no.nav.data.polly.alert.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.common.storage.domain.ChangeStamp;
import no.nav.data.polly.common.storage.domain.GenericStorageIdData;
import org.apache.commons.lang3.builder.CompareToBuilder;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AlertEvent implements GenericStorageIdData, Comparable<AlertEvent> {

    private UUID id;
    private UUID processId;
    private UUID informationTypeId;
    private AlertEventType type;
    private AlertEventLevel level;

    private ChangeStamp changeStamp;

    public AlertEvent(UUID processId, UUID informationTypeId, AlertEventType type) {
        this.processId = processId;
        this.informationTypeId = informationTypeId;
        setAlertEventType(type);
    }

    public void setAlertEventType(AlertEventType type) {
        this.type = type;
        this.level = type.getLevel();
    }

    @Override
    public int compareTo(AlertEvent o) {
        return CompareToBuilder.reflectionCompare(this, o, "id");
    }
}
