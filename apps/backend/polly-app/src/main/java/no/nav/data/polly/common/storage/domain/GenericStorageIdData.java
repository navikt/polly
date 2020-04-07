package no.nav.data.polly.common.storage.domain;

import java.util.UUID;

public interface GenericStorageIdData extends GenericStorageData {

    UUID getId();

    void setId(UUID id);
}
