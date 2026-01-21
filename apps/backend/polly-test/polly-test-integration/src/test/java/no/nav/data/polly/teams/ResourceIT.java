package no.nav.data.polly.teams;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.teams.TeamController.ResourcePage;
import no.nav.data.polly.teams.dto.Resource;
import no.nav.data.polly.teams.dto.ResourceType;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class ResourceIT extends IntegrationTestBase {

    @Test
    void getTeam() {
        Resource body = webTestClient.get()
                .uri("/team/resource/{ident}", "A123456")
                .exchange()
                .expectStatus().isOk()
                .expectBody(Resource.class)
                .returnResult()
                .getResponseBody();

        assertThat(body).isNotNull();
        assertThat(body.getNavIdent()).isEqualTo("A123456");
        assertThat(body.getGivenName()).isEqualTo("Given");
        assertThat(body.getFamilyName()).isEqualTo("Family");
        assertThat(body.getResourceType()).isEqualTo(ResourceType.EXTERNAL);
    }

    @Test
    void getTeamNotFound() {
        webTestClient.get()
                .uri("/team/resource/{ident}", "A999999")
                .exchange()
                .expectStatus().isNotFound();
    }

    @Test
    void searchTeams() {
        ResourcePage body = webTestClient.get()
                .uri("/team/resource/search/{name}", "fam")
                .exchange()
                .expectStatus().isOk()
                .expectBody(ResourcePage.class)
                .returnResult()
                .getResponseBody();

        assertThat(body).isNotNull();
        assertThat(body.getContent()).hasSize(2);
        assertThat(body.getContent().get(0).getNavIdent()).isEqualTo("A123456");
        assertThat(body.getContent().get(1).getNavIdent()).isEqualTo("A123457");
    }
}
