package no.nav.data.common.security;


import no.nav.data.common.utils.Constants;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class AppIdMappingTest {

    @Test
    void getAppNameForAppId() {
        String teamCatAppId = "79047220-e01b-490d-a09d-499cadbd1248";
        AppIdMapping appIdMapping = new AppIdMapping("[{\"clientId\":\"appId1\",\"name\":\"thisapp\"},{\"clientId\":\"appId2\",\"name\":\"otherapp\"}]",
                teamCatAppId);
        assertThat(AppIdMapping.getAppNameForAppId("appId1")).isEqualTo("thisapp");
        assertThat(AppIdMapping.getAppNameForAppId("appId2")).isEqualTo("otherapp");
        assertThat(AppIdMapping.getAppNameForAppId(teamCatAppId)).isEqualTo(Constants.APP_ID);
        assertThat(appIdMapping.getIds()).contains("appId1", "appId2", teamCatAppId);
    }

}