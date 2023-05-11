package no.nav.data.polly.teams;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.teams.TeamController.ResourcePage;
import no.nav.data.polly.teams.dto.Resource;
import no.nav.data.polly.teams.dto.ResourceType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.HttpClientErrorException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class ResourceIT extends IntegrationTestBase {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void getTeam() {
        ResponseEntity<Resource> resource = restTemplate.getForEntity("/team/resource/{ident}", Resource.class, "A123456");
        assertThat(resource.getBody()).isNotNull();
        assertThat(resource.getBody().getNavIdent()).isEqualTo("A123456");
        assertThat(resource.getBody().getGivenName()).isEqualTo("Given");
        assertThat(resource.getBody().getFamilyName()).isEqualTo("Family");
        assertThat(resource.getBody().getResourceType()).isEqualTo(ResourceType.EXTERNAL);
    }

    @Test
    void getTeamNotFound() {
        HttpClientErrorException exception = assertThrows(HttpClientErrorException.class, () -> {
            restTemplate.getForEntity("/team/resource/{ident}", Resource.class, "A999999");
        });
        assertThat(exception.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void searchTeams() {
        ResponseEntity<ResourcePage> teams = restTemplate.getForEntity("/team/resource/search/{name}", ResourcePage.class, "fam");
        assertThat(teams.getBody()).isNotNull();
        assertThat(teams.getBody().getContent()).hasSize(2);
        assertThat(teams.getBody().getContent().get(0).getNavIdent()).isEqualTo("A123456");
        assertThat(teams.getBody().getContent().get(1).getNavIdent()).isEqualTo("A123457");
    }
}
