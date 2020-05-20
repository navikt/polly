package no.nav.data.polly.common.storage.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import no.nav.data.polly.common.rest.ChangeStampResponse;

import java.time.LocalDateTime;

public interface GenericStorageData {

    @JsonIgnore
    ChangeStamp getChangeStamp();

    @JsonIgnore
    void setChangeStamp(ChangeStamp changeStamp);

    default StorageType type() {
        return StorageType.fromClass(this.getClass());
    }

    default ChangeStampResponse convertChangeStampResponse() {
        if (getChangeStamp() == null) {
            return null;
        }
        return ChangeStampResponse.builder()
                .lastModifiedBy(getChangeStamp().getLastModifiedBy())
                .lastModifiedDate(getChangeStamp().getLastModifiedDate() == null ? LocalDateTime.now() : getChangeStamp().getLastModifiedDate())
                .build();
    }
}
