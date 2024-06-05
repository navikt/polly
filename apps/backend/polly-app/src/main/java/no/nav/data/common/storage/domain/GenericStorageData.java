package no.nav.data.common.storage.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import no.nav.data.common.rest.ChangeStampResponse;

import java.time.LocalDateTime;

public interface GenericStorageData {

    // TODO: Dette interfacet bør types (GenericStorageData<T extends GenericStorageData<T>>)
    
    @JsonIgnore
    ChangeStamp getChangeStamp();

    @JsonIgnore
    void setChangeStamp(ChangeStamp changeStamp);

    default StorageType type() {
        return StorageType.fromClass(this.getClass());
    }

    // TODO: Snu avhengigheten innover
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
