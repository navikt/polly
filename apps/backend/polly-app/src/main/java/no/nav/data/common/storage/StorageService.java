package no.nav.data.common.storage;

import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import lombok.RequiredArgsConstructor;
import no.nav.data.common.storage.domain.AppState;
import no.nav.data.common.storage.domain.GenericStorage;
import no.nav.data.common.storage.domain.GenericStorageData;
import no.nav.data.common.storage.domain.GenericStorageRepository;
import no.nav.data.common.storage.domain.StorageType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;
import java.util.function.Consumer;

@Service
@RequiredArgsConstructor
public class StorageService {

    private final GenericStorageRepository repository;

    public <T extends GenericStorageData> T getSingleton(Class<T> type) {
        return getSingletonAsStorage(type).getDataObject(type);
    }

    public <T extends GenericStorageData> T get(Class<T> type, UUID id) {
        return repository.findById(id).orElseThrow().getDataObject(type);
    }

    @Transactional(readOnly = false) // Merk: På tross av navnet på metoden, kan den resultere i save
    public <T extends GenericStorageData> GenericStorage getSingletonAsStorage(Class<T> type) {
        return findType(StorageType.fromClass(type));
    }

    private GenericStorage findType(StorageType type) {
        return repository.findByType(type).orElseGet(() -> create(type));
    }

    private GenericStorage create(StorageType type) {
        return repository.save(GenericStorage.builder().generateId().type(type).data(JsonNodeFactory.instance.objectNode()).build());
    }

    @Transactional
    public GenericStorage save(GenericStorage storage) {
        return repository.save(storage);
    }

    @Transactional
    public void save(GenericStorageData data) {
        var storage = GenericStorage.builder().generateId().build();
        storage.setDataObject(data);
        repository.save(storage);
    }

    @Transactional 
    public void usingAppState(Consumer<AppState> consumer) {
        var appStateStorage = getSingletonAsStorage(AppState.class);
        var appState = appStateStorage.getDataObject(AppState.class);
        if (appState.isLock()) {
            return;
        }
        appState.setLock(true);
        save(appStateStorage, appState);
        consumer.accept(appState);
        appState.setLock(false);
        save(appStateStorage, appState);
    }

    private void save(GenericStorage appStateStorage, AppState appState) {
        appStateStorage.setDataObject(appState);
        save(appStateStorage);
    }
}
