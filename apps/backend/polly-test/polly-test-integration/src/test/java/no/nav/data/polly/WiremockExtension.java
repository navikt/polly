package no.nav.data.polly;

import com.github.tomakehurst.wiremock.WireMockServer;
import com.github.tomakehurst.wiremock.client.WireMock;
import com.github.tomakehurst.wiremock.core.WireMockConfiguration;
import no.nav.data.polly.common.nais.LeaderElectionService;
import no.nav.data.polly.common.rest.RestResponsePage;
import no.nav.data.polly.teams.dto.Resource;
import no.nav.data.polly.teams.dto.ResourceType;
import no.nav.data.polly.teams.teamcat.TeamKatMember;
import no.nav.data.polly.teams.teamcat.TeamKatProductArea;
import no.nav.data.polly.teams.teamcat.TeamKatTeam;
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
import static no.nav.data.polly.common.utils.JsonUtils.toJson;

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
        getWiremock().stubFor(get("/elector").willReturn(okJson(toJson(LeaderElectionService.getHostInfo()))));
        getWiremock().stubFor(get("/teamcat/team").willReturn(okJson(toJson(teamMockResponse()))));
        getWiremock().stubFor(get("/teamcat/productarea").willReturn(okJson(toJson(productAreaMockResponse()))));

        getWiremock().stubFor(get("/teamcat/resource/search/fam").willReturn(okJson(toJson(new RestResponsePage<>(List.of(resource("A123456"), resource("A123457")))))));
        getWiremock().stubFor(get("/teamcat/resource/A123456").willReturn(okJson(toJson(resource("A123456")))));
        getWiremock().stubFor(get("/teamcat/resource/A123457").willReturn(okJson(toJson(resource("A123457")))));
        getWiremock().stubFor(get("/teamcat/resource/A999999").willReturn(notFound().withBody(notFoundJson())));
    }

    static WireMockServer getWiremock() {
        return WIREMOCK;
    }

    private RestResponsePage<TeamKatTeam> teamMockResponse() {
        List<TeamKatTeam> teamKatTeams = List.of(defaultNoraTeam(), TeamKatTeam.builder().name("X Team").id("xteamR").build());
        return new RestResponsePage<>(teamKatTeams);
    }

    private RestResponsePage<TeamKatProductArea> productAreaMockResponse() {
        return new RestResponsePage<>(List.of(
                TeamKatProductArea.builder().id("productarea1").description("desc").name("Product Area 1").members(List.of(member())).build(),
                TeamKatProductArea.builder().id("productarea2").name("Product Area 2").build()
        ));
    }

    private TeamKatTeam defaultNoraTeam() {
        return TeamKatTeam.builder().name("Visual Team Name").id("teamid1").description("desc").productAreaId("productarea1").slackChannel("slack")
                .members(List.of(member()))
                .build();
    }

    private TeamKatMember member() {
        return TeamKatMember.builder().resource(
                TeamKatMember.Resource.builder().fullName("Member Name").email("member@email.com").build()).build();
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
