package no.nav.data.polly.settings;

import no.nav.data.common.exceptions.ValidationException;
import no.nav.data.common.storage.StorageService;
import no.nav.data.common.storage.domain.GenericStorage;
import no.nav.data.common.validator.RequestValidator;
import no.nav.data.polly.document.domain.DocumentRepository;
import no.nav.data.polly.settings.dto.Settings;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class SettingsService {

    private final StorageService storage;
    private final DocumentRepository documentRepository;

    public SettingsService(StorageService storage, DocumentRepository documentRepository) {
        this.storage = storage;
        this.documentRepository = documentRepository;
    }

    @Transactional // Merk: Kallet kan resultere i save mot databasen
    public Settings getSettings() {
        return storage.getSingleton(Settings.class);
    }

    @Transactional
    public Settings updateSettings(Settings settings) {
        validate(settings);
        GenericStorage settingsStorage = storage.getSingletonAsStorage(Settings.class);
        settingsStorage.setDataObject(settings);
        // FIXME: Settings er en singleton lagret som JSON i GENERIC_STORAGE, og Settings-DTO-en har
        // ingen version-felt i API-et (den er ikke en identifiserbar ressurs med id for klienten).
        // Optimistisk låsing er derfor kun dekket av Hibernate sin versjonssjekk ved flush
        // (samtidige skrivinger gir 409), ikke av en version sendt fra klienten.
        // Å innføre det trygt krever å endre Settings-kontrakten mot frontend.
        return storage.save(settingsStorage).getDataObject(Settings.class);
    }

    private void validate(Settings settings) {
        RequestValidator.validate("Settings", settings);
        if (settings.getDefaultProcessDocument() != null && documentRepository.findById(UUID.fromString(settings.getDefaultProcessDocument())).isEmpty()) {
            throw new ValidationException("Can't find document " + settings.getDefaultProcessDocument());
        }
    }

}
