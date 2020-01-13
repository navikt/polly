package no.nav.data.polly;

import com.github.tomakehurst.wiremock.WireMockServer;
import com.github.tomakehurst.wiremock.client.WireMock;
import com.github.tomakehurst.wiremock.core.WireMockConfiguration;
import no.nav.data.polly.common.nais.LeaderElectionService;
import no.nav.data.polly.common.utils.JsonUtils;
import no.nav.data.polly.teams.nora.NoraTeam;
import org.junit.jupiter.api.extension.AfterEachCallback;
import org.junit.jupiter.api.extension.BeforeAllCallback;
import org.junit.jupiter.api.extension.BeforeEachCallback;
import org.junit.jupiter.api.extension.Extension;
import org.junit.jupiter.api.extension.ExtensionContext;

import java.util.List;

import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.okJson;

public class WiremockExtension implements Extension, BeforeAllCallback, BeforeEachCallback, AfterEachCallback {

    private static final WireMockServer WIREMOCK = new WireMockServer(
            WireMockConfiguration.wireMockConfig()
                    .dynamicPort()
    );

    @Override
    public void beforeAll(ExtensionContext context) {
        getWiremock().start();
        WireMock.configureFor("localhost", getWiremock().port());
    }

    @Override
    public void beforeEach(ExtensionContext context) {
        stubCommon();
    }

    @Override
    public void afterEach(ExtensionContext context) {
        getWiremock().resetMappings();
    }

    private void stubCommon() {
        getWiremock().stubFor(get("/elector").willReturn(okJson(JsonUtils.toJson(LeaderElectionService.getHostInfo()))));
        getWiremock().stubFor(get("/nora/teams").willReturn(okJson(JsonUtils.toJson(noraMockResponse()))));
    }

    static WireMockServer getWiremock() {
        return WIREMOCK;
    }

    private List<NoraTeam> noraMockResponse() {
        return List.of(NoraTeam.builder().name("Visual Team Name").nick("teamname").build(), NoraTeam.builder().name("X Team").nick("xteamR").build());
    }
}
