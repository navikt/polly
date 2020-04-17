package no.nav.data.polly.common.storage;

import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import no.nav.data.polly.common.storage.domain.GenericStorage;
import no.nav.data.polly.common.storage.domain.GenericStorageData;
import no.nav.data.polly.common.storage.domain.GenericStorageRepository;
import no.nav.data.polly.common.storage.domain.StorageType;
import org.springframework.stereotype.Service;

@Service
public class StorageService {

    private final GenericStorageRepository repository;

    public StorageService(GenericStorageRepository repository) {
        this.repository = repository;
    }

    public <T extends GenericStorageData> T getSingleton(Class<T> type) {
        return getSingletonAsStorage(type).getDataObject(type);
    }

    public <T extends GenericStorageData> GenericStorage getSingletonAsStorage(Class<T> type) {
        return findType(StorageType.fromClass(type));
    }

    private GenericStorage findType(StorageType type) {
        return repository.findByType(type).orElseGet(() -> create(type));
    }

    private GenericStorage create(StorageType type) {
        return repository.save(GenericStorage.builder().generateId().type(type).data(JsonNodeFactory.instance.objectNode()).build());
    }

    public GenericStorage save(GenericStorage storage) {
        return repository.save(storage);
    }
}
