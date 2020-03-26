package no.nav.data.polly;

import com.github.tomakehurst.wiremock.WireMockServer;
import com.github.tomakehurst.wiremock.client.WireMock;
import com.github.tomakehurst.wiremock.core.WireMockConfiguration;
import no.nav.data.polly.common.nais.LeaderElectionService;
import no.nav.data.polly.common.rest.RestResponsePage;
import no.nav.data.polly.common.utils.JsonUtils;
import no.nav.data.polly.teams.dto.Resource;
import no.nav.data.polly.teams.dto.ResourceType;
import no.nav.data.polly.teams.nora.NoraMember;
import no.nav.data.polly.teams.nora.NoraTeam;
import org.junit.jupiter.api.extension.AfterEachCallback;
import org.junit.jupiter.api.extension.BeforeAllCallback;
import org.junit.jupiter.api.extension.BeforeEachCallback;
import org.junit.jupiter.api.extension.Extension;
import org.junit.jupiter.api.extension.ExtensionContext;

import java.time.LocalDateTime;
import java.util.List;

import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.notFound;
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
        getWiremock().stubFor(get("/nora/teams/teamname").willReturn(okJson(JsonUtils.toJson(defaultNoraTeam()))));

        getWiremock().stubFor(get("/teamcat/resource/search/fam").willReturn(okJson(JsonUtils.toJson(new RestResponsePage<>(List.of(resource("A123456"), resource("A123457")))))));
        getWiremock().stubFor(get("/teamcat/resource/A123456").willReturn(okJson(JsonUtils.toJson(resource("A123456")))));
        getWiremock().stubFor(get("/teamcat/resource/A123457").willReturn(okJson(JsonUtils.toJson(resource("A123457")))));
        getWiremock().stubFor(get("/teamcat/resource/A999999").willReturn(notFound().withBody(notFoundJson())));
    }

    static WireMockServer getWiremock() {
        return WIREMOCK;
    }

    private List<NoraTeam> noraMockResponse() {
        return List.of(defaultNoraTeam(), NoraTeam.builder().name("X Team").nick("xteamR").build());
    }

    private NoraTeam defaultNoraTeam() {
        return NoraTeam.builder().name("Visual Team Name").nick("teamname").members(List.of(NoraMember.builder().name("Member Name").email("member@email.com").build())).build();
    }

    private Resource resource(String ident) {
        return Resource.builder()
                .navIdent(ident)
                .familyName("Family")
                .givenName("Given")
                .fullName("Given Family")
                .resourceType(ResourceType.EXTERNAL)
                .email("email@norge.no")
                .build();
    }

    private String notFoundJson() {
        return "{\n"
                + "    \"timestamp\": \"" + LocalDateTime.now() + "\",\n"
                + "    \"status\": 500,\n"
                + "    \"error\": \"Resource not found\",\n"
                + "}";
    }
}
