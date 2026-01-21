package no.nav.data.polly.teams;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.teams.TeamController.ProductAreaPage;
import no.nav.data.polly.teams.TeamController.TeamPage;
import no.nav.data.polly.teams.dto.ProductAreaResponse;
import no.nav.data.polly.teams.dto.TeamResponse;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class TeamControllerIT extends IntegrationTestBase {

    @Test
    void getTeams() {
        TeamPage body = webTestClient.get()
                .uri("/team")
                .exchange()
                .expectStatus().isOk()
                .expectBody(TeamPage.class)
                .returnResult()
                .getResponseBody();

        assertThat(body).isNotNull();
        assertThat(body.getContent()).hasSize(2);
        assertThat(body.getContent().get(0).getId()).isEqualTo("teamid1");
        assertThat(body.getContent().get(0).getName()).isEqualTo("Visual Team Name");
    }

    @Test
    void getTeam() {
        TeamResponse body = webTestClient.get()
                .uri("/team/{teamId}", "teamid1")
                .exchange()
                .expectStatus().isOk()
                .expectBody(TeamResponse.class)
                .returnResult()
                .getResponseBody();

        assertThat(body).isNotNull();
        assertThat(body.getId()).isEqualTo("teamid1");
        assertThat(body.getName()).isEqualTo("Visual Team Name");
        assertThat(body.getDescription()).isEqualTo("desc");
        assertThat(body.getSlackChannel()).isEqualTo("slack");
        assertThat(body.getProductAreaId()).isEqualTo("productarea1");
        assertThat(body.getMembers()).hasSize(1);
        assertThat(body.getMembers().get(0).getName()).isEqualTo("Member Name");
        assertThat(body.getMembers().get(0).getEmail()).isEqualTo("member@email.com");
    }

    @Test
    void searchTeams() {
        TeamPage body = webTestClient.get()
                .uri("/team/search/{name}", "Visual")
                .exchange()
                .expectStatus().isOk()
                .expectBody(TeamPage.class)
                .returnResult()
                .getResponseBody();

        assertThat(body).isNotNull();
        assertThat(body.getContent()).hasSize(1);
        assertThat(body.getContent().get(0).getId()).isEqualTo("teamid1");
        assertThat(body.getContent().get(0).getName()).isEqualTo("Visual Team Name");
    }

    @Test
    void getProductAreas() {
        ProductAreaPage body = webTestClient.get()
                .uri("/team/productarea")
                .exchange()
                .expectStatus().isOk()
                .expectBody(ProductAreaPage.class)
                .returnResult()
                .getResponseBody();

        assertThat(body).isNotNull();
        assertThat(body.getContent()).hasSize(2);
        assertThat(body.getContent().get(0).getId()).isEqualTo("productarea1");
        assertThat(body.getContent().get(0).getName()).isEqualTo("Product Area 1");
    }

    @Test
    void getProductArea() {
        ProductAreaResponse body = webTestClient.get()
                .uri("/team/productarea/{id}", "productarea1")
                .exchange()
                .expectStatus().isOk()
                .expectBody(ProductAreaResponse.class)
                .returnResult()
                .getResponseBody();

        assertThat(body).isNotNull();
        assertThat(body.getId()).isEqualTo("productarea1");
        assertThat(body.getName()).isEqualTo("Product Area 1");
        assertThat(body.getDescription()).isEqualTo("desc");
        assertThat(body.getMembers()).hasSize(1);
        assertThat(body.getMembers().get(0).getName()).isEqualTo("Member Name");
        assertThat(body.getMembers().get(0).getEmail()).isEqualTo("member@email.com");
    }
}
