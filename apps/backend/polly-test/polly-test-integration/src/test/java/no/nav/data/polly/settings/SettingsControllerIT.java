package no.nav.data.polly.settings;

import no.nav.data.common.storage.domain.GenericStorage;
import no.nav.data.common.storage.domain.StorageType;
import no.nav.data.common.utils.JsonUtils;
import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.document.domain.Document;
import no.nav.data.polly.settings.dto.Settings;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class SettingsControllerIT extends IntegrationTestBase {

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

        Settings body = webTestClient.post()
                .uri("/settings")
                .bodyValue(settings)
                .exchange()
                .expectStatus().isOk()
                .expectBody(Settings.class)
                .returnResult()
                .getResponseBody();

        assertThat(body).isNotNull();
        assertThat(body).isEqualTo(settings);
        assertGetSettings(settings);
    }

    @Test
    void validateDefaultProcessDocumentExists() {
        Settings settings = Settings.builder().defaultProcessDocument("d7fc29f4-c006-49ce-9f38-75c82c4bcc98").build();

        webTestClient.post()
                .uri("/settings")
                .bodyValue(settings)
                .exchange()
                .expectStatus().isBadRequest();
    }

    private void assertGetSettings(Settings settings) {
        Settings body = webTestClient.get()
                .uri("/settings")
                .exchange()
                .expectStatus().isOk()
                .expectBody(Settings.class)
                .returnResult()
                .getResponseBody();

        assertThat(body).isNotNull();
        assertThat(body).isEqualTo(settings);
    }
}
