package no.nav.data.polly.teams;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.common.rest.RestResponsePage;
import no.nav.data.polly.teams.dto.ProductTeamResponse;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@CrossOrigin
@RequestMapping("/team")
@Api(value = "Team", description = "REST API for teams", tags = {"Team"})
public class TeamController {

    private final TeamService teamsService;

    public TeamController(TeamService teamsService) {
        this.teamsService = teamsService;
    }

    @ApiOperation(value = "Get all teams")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Teams fetched", response = TeamsPage.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping
    public RestResponsePage<ProductTeamResponse> findAll() {
        log.info("Received a request for all teams");
        return new RestResponsePage<>(teamsService.getAllProductTeams());
    }

    static class TeamsPage extends RestResponsePage<ProductTeamResponse> {

    }
}
