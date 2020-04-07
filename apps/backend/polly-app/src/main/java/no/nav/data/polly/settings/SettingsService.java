package no.nav.data.polly.settings;

import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import no.nav.data.polly.common.exceptions.ValidationException;
import no.nav.data.polly.common.storage.domain.GenericStorage;
import no.nav.data.polly.common.storage.domain.GenericStorageRepository;
import no.nav.data.polly.common.storage.domain.StorageType;
import no.nav.data.polly.common.validator.RequestValidator;
import no.nav.data.polly.document.domain.DocumentRepository;
import no.nav.data.polly.settings.dto.Settings;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class SettingsService {

    private final GenericStorageRepository repository;
    private final DocumentRepository documentRepository;

    public SettingsService(GenericStorageRepository repository, DocumentRepository documentRepository) {
        this.repository = repository;
        this.documentRepository = documentRepository;
    }

    public Settings getSettings() {
        return findSettings().getDataObject(Settings.class);
    }

    public Settings updateSettings(Settings settings) {
        validate(settings);
        GenericStorage settingsStorage = findSettings();
        settingsStorage.setDataObject(settings);
        return repository.save(settingsStorage).getDataObject(Settings.class);
    }

    private void validate(Settings settings) {
        RequestValidator.validate("Settings", settings);
        if (settings.getDefaultProcessDocument() != null && documentRepository.findById(UUID.fromString(settings.getDefaultProcessDocument())).isEmpty()) {
            throw new ValidationException("Can't find document " + settings.getDefaultProcessDocument());
        }
    }

    private GenericStorage findSettings() {
        return repository.findByType(StorageType.SETTINGS).orElseGet(this::createSettings);
    }

    private GenericStorage createSettings() {
        return repository.save(GenericStorage.builder().generateId().type(StorageType.SETTINGS).data(JsonNodeFactory.instance.objectNode()).build());
    }

}
