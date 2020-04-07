package no.nav.data.polly.common.storage.domain;

public interface GenericStorageData {

    default StorageType type() {
        return StorageType.fromClass(this.getClass());
    }
}
