package no.nav.data.polly.teams;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.teams.TeamController.TeamPage;
import no.nav.data.polly.teams.dto.TeamResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

class TeamControllerIT extends IntegrationTestBase {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void getTeams() {
        ResponseEntity<TeamPage> teams = restTemplate.getForEntity("/team", TeamPage.class);
        assertThat(teams.getBody()).isNotNull();
        assertThat(teams.getBody().getContent()).hasSize(2);
        assertThat(teams.getBody().getContent().get(0).getId()).isEqualTo("teamname");
        assertThat(teams.getBody().getContent().get(0).getName()).isEqualTo("Visual Team Name");
    }

    @Test
    void getTeam() {
        ResponseEntity<TeamResponse> team = restTemplate.getForEntity("/team/{teamId}", TeamResponse.class, "teamname");
        assertThat(team.getBody()).isNotNull();
        assertThat(team.getBody().getId()).isEqualTo("teamname");
        assertThat(team.getBody().getName()).isEqualTo("Visual Team Name");
        assertThat(team.getBody().getDescription()).isEqualTo("desc");
        assertThat(team.getBody().getSlackChannel()).isEqualTo("slack");
        assertThat(team.getBody().getMembers()).hasSize(1);
        assertThat(team.getBody().getMembers().get(0).getName()).isEqualTo("Member Name");
        assertThat(team.getBody().getMembers().get(0).getEmail()).isEqualTo("member@email.com");
    }

    @Test
    void searchTeams() {
        ResponseEntity<TeamPage> teams = restTemplate.getForEntity("/team/search/{name}", TeamPage.class, "Visual");
        assertThat(teams.getBody()).isNotNull();
        assertThat(teams.getBody().getContent()).hasSize(1);
        assertThat(teams.getBody().getContent().get(0).getId()).isEqualTo("teamname");
        assertThat(teams.getBody().getContent().get(0).getName()).isEqualTo("Visual Team Name");
    }
}
