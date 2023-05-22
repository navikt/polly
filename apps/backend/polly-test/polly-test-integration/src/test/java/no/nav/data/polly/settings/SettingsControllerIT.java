package no.nav.data.polly.settings;

import no.nav.data.common.storage.domain.GenericStorage;
import no.nav.data.common.storage.domain.StorageType;
import no.nav.data.common.utils.JsonUtils;
import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.document.domain.Document;
import no.nav.data.polly.settings.dto.Settings;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

public class SettingsControllerIT extends IntegrationTestBase {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void getSettings() {
        Settings settings = Settings.builder().defaultProcessDocument("4f02253c-bbba-4a8e-8c47-15fc32fcc373").build();
        genericStorageRepository.save(GenericStorage.builder().generateId().type(StorageType.SETTINGS).data(JsonUtils.toJsonNode(settings)).build());
        assertGetSettings(settings);
    }

    @Test
    void getSettingsNoneExist() {
        assertGetSettings(new Settings());
    }

    @Test
    void updateSettings() {
        Document doc = documentRepository.save(createDocument("BRUKER", null));
        Settings settings = Settings.builder().defaultProcessDocument(doc.getId().toString()).build();
        ResponseEntity<Settings> resp = restTemplate.postForEntity("/settings", settings, Settings.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody()).isNotNull();
        assertThat(resp.getBody()).isEqualTo(settings);
        assertGetSettings(settings);
    }

    @Test
    void validateDefaultProcessDocumentExists() {
        Settings settings = Settings.builder().defaultProcessDocument("d7fc29f4-c006-49ce-9f38-75c82c4bcc98").build();

        var resp = restTemplate.postForEntity("/settings", settings, String.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(resp.getBody()).contains("Can't find document d7fc29f4-c006-49ce-9f38-75c82c4bcc98");
    }

    private void assertGetSettings(Settings settings) {
        ResponseEntity<Settings> resp = restTemplate.getForEntity("/settings", Settings.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody()).isNotNull();
        assertThat(resp.getBody()).isEqualTo(settings);
    }
}
