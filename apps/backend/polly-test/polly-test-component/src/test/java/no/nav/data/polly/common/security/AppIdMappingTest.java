package no.nav.data.polly.common.security;


import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class AppIdMappingTest {

    @Test
    void getAppNameForAppId() {
        AppIdMapping appIdMapping = new AppIdMapping("id:app");
        assertThat(AppIdMapping.getAppNameForAppId("id")).isEqualTo("app");
        assertThat(appIdMapping.getIds()).contains("id");
    }

    @Test
    void getAppNameForAppIds() {
        AppIdMapping appIdMapping = new AppIdMapping("id:app,id2:app2");
        assertThat(AppIdMapping.getAppNameForAppId("id")).isEqualTo("app");
        assertThat(AppIdMapping.getAppNameForAppId("id2")).isEqualTo("app2");
        assertThat(appIdMapping.getIds()).contains("id", "id2");
    }
}