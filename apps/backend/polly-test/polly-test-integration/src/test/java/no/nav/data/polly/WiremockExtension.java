package no.nav.data.polly;

import com.github.tomakehurst.wiremock.WireMockServer;
import com.github.tomakehurst.wiremock.client.WireMock;
import com.github.tomakehurst.wiremock.core.WireMockConfiguration;
import no.nav.data.polly.commoncode.CommonCodeMocks;
import no.nav.data.polly.nom.NomAvdelingMocks;
import no.nav.data.polly.teams.TeamcatMocks;
import org.junit.jupiter.api.extension.AfterEachCallback;
import org.junit.jupiter.api.extension.BeforeAllCallback;
import org.junit.jupiter.api.extension.BeforeEachCallback;
import org.junit.jupiter.api.extension.Extension;
import org.junit.jupiter.api.extension.ExtensionContext;

public class WiremockExtension implements Extension, BeforeAllCallback, BeforeEachCallback, AfterEachCallback {

    private static final WireMockServer WIREMOCK = new WireMockServer(
            WireMockConfiguration.wireMockConfig()
                    .dynamicPort()
    );

    @Override
    public void beforeAll(ExtensionContext context) {
        WIREMOCK.start();
        WireMock.configureFor("localhost", WIREMOCK.port());
    }

    @Override
    public void beforeEach(ExtensionContext context) {
        stubCommon();
    }

    @Override
    public void afterEach(ExtensionContext context) {
        WIREMOCK.resetMappings();
    }

    public static int port() {
        return WIREMOCK.port();
    }

    private void stubCommon() {
        TeamcatMocks.mock();
        NomAvdelingMocks.mock();
        CommonCodeMocks.mock();
    }

}
