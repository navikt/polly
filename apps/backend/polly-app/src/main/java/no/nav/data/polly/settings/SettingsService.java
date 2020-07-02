package no.nav.data.polly.settings;

import no.nav.data.polly.common.exceptions.ValidationException;
import no.nav.data.polly.common.storage.StorageService;
import no.nav.data.polly.common.storage.domain.GenericStorage;
import no.nav.data.polly.common.validator.RequestValidator;
import no.nav.data.polly.document.domain.DocumentRepository;
import no.nav.data.polly.settings.dto.Settings;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class SettingsService {

    private final StorageService storage;
    private final DocumentRepository documentRepository;

    public SettingsService(StorageService storage, DocumentRepository documentRepository) {
        this.storage = storage;
        this.documentRepository = documentRepository;
    }

    public Settings getSettings() {
        return storage.getSingleton(Settings.class);
    }

    public Settings updateSettings(Settings settings) {
        validate(settings);
        GenericStorage settingsStorage = storage.getSingletonAsStorage(Settings.class);
        settingsStorage.setDataObject(settings);
        return storage.save(settingsStorage).getDataObject(Settings.class);
    }

    private void validate(Settings settings) {
        RequestValidator.validate("Settings", settings);
        if (settings.getDefaultProcessDocument() != null && documentRepository.findById(UUID.fromString(settings.getDefaultProcessDocument())).isEmpty()) {
            throw new ValidationException("Can't find document " + settings.getDefaultProcessDocument());
        }
    }

}
