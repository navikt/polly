package no.nav.data.polly.teams;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.common.exceptions.ValidationException;
import no.nav.data.polly.common.rest.RestResponsePage;
import no.nav.data.polly.common.utils.StreamUtils;
import no.nav.data.polly.teams.domain.Team;
import no.nav.data.polly.teams.dto.ProductTeamResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static java.util.Comparator.comparing;
import static no.nav.data.polly.common.utils.StartsWithComparator.startsWith;
import static no.nav.data.polly.common.utils.StreamUtils.convert;
import static org.apache.commons.lang3.StringUtils.containsIgnoreCase;

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
            @ApiResponse(code = 200, message = "Teams fetched", response = TeamPage.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping
    public RestResponsePage<ProductTeamResponse> findAll() {
        log.info("Received a request for all teams");
        return new RestResponsePage<>(convert(teamsService.getAllProductTeams(), Team::convertToResponse));
    }

    @ApiOperation(value = "Get team")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Teams fetched", response = ProductTeamResponse.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/{name}")
    public ResponseEntity<ProductTeamResponse> getTeamByName(@PathVariable String teamId) {
        log.info("Received request for Team with id {}", teamId);
        Team team = teamsService.getTeam(teamId);
        return new ResponseEntity<>(team.convertToResponse(), HttpStatus.OK);
    }

    @ApiOperation(value = "Search teams")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Teams fetched", response = TeamPage.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/search/{name}")
    public ResponseEntity<RestResponsePage<ProductTeamResponse>> searchTeamByName(@PathVariable String name) {
        log.info("Received request for Team with the name like {}", name);
        if (name.length() < 3) {
            throw new ValidationException("Search teams must be at least 3 characters");
        }
        var teams = StreamUtils.filter(teamsService.getAllProductTeams(), team -> containsIgnoreCase(team.getName(), name));
        teams.sort(comparing(Team::getName, startsWith(name)));
        log.info("Returned {} teams", teams.size());
        return new ResponseEntity<>(new RestResponsePage<>(convert(teams, Team::convertToResponse)), HttpStatus.OK);
    }

    static class TeamPage extends RestResponsePage<ProductTeamResponse> {

    }
}
