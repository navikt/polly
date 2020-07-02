package no.nav.data.polly.teams;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.exceptions.PollyNotFoundException;
import no.nav.data.common.exceptions.ValidationException;
import no.nav.data.common.rest.RestResponsePage;
import no.nav.data.common.utils.StreamUtils;
import no.nav.data.polly.teams.domain.ProductArea;
import no.nav.data.polly.teams.domain.Team;
import no.nav.data.polly.teams.dto.ProductAreaResponse;
import no.nav.data.polly.teams.dto.Resource;
import no.nav.data.polly.teams.dto.TeamResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static java.util.Comparator.comparing;
import static no.nav.data.common.utils.StartsWithComparator.startsWith;
import static no.nav.data.common.utils.StreamUtils.convert;
import static org.apache.commons.lang3.StringUtils.containsIgnoreCase;

@Slf4j
@RestController
@RequestMapping("/team")
@Api(value = "Team", description = "REST API for teams", tags = {"Team"})
public class TeamController {

    private final TeamService teamsService;
    private final ResourceService resourceService;

    public TeamController(TeamService teamsService, ResourceService resourceService) {
        this.teamsService = teamsService;
        this.resourceService = resourceService;
    }

    // Teams

    @ApiOperation(value = "Get all teams")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Teams fetched", response = TeamPage.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping
    public RestResponsePage<TeamResponse> findAllTeams() {
        log.info("Received a request for all teams");
        return new RestResponsePage<>(convert(teamsService.getAllTeams(), Team::convertToResponse));
    }

    @ApiOperation(value = "Get team")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Teams fetched", response = TeamResponse.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/{teamId}")
    public ResponseEntity<TeamResponse> getTeamByName(@PathVariable String teamId) {
        log.info("Received request for Team with id {}", teamId);
        Optional<Team> team = teamsService.getTeam(teamId);
        if (team.isEmpty()) {
            throw new PollyNotFoundException("Couldn't find team " + teamId);
        }
        return new ResponseEntity<>(team.get().convertToResponseWithMembers(), HttpStatus.OK);
    }

    @ApiOperation(value = "Search teams")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Teams fetched", response = TeamPage.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/search/{name}")
    public ResponseEntity<RestResponsePage<TeamResponse>> searchTeamByName(@PathVariable String name) {
        log.info("Received request for Team with the name like {}", name);
        if (name.length() < 3) {
            throw new ValidationException("Search teams must be at least 3 characters");
        }
        var teams = StreamUtils.filter(teamsService.getAllTeams(), team -> containsIgnoreCase(team.getName(), name));
        teams.sort(comparing(Team::getName, startsWith(name)));
        log.info("Returned {} teams", teams.size());
        return new ResponseEntity<>(new RestResponsePage<>(convert(teams, Team::convertToResponse)), HttpStatus.OK);
    }

    // Product Areas

    @ApiOperation(value = "Get all product areas")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Product areas fetched", response = ProductAreaPage.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/productarea")
    public RestResponsePage<ProductAreaResponse> findAllProductAreas() {
        log.info("Received a request for all product areas");
        return new RestResponsePage<>(convert(teamsService.getAllProductAreas(), ProductArea::convertToResponse));
    }

    @ApiOperation(value = "Get product area")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Product area fetched", response = ProductAreaResponse.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/productarea/{paId}")
    public ResponseEntity<ProductAreaResponse> getProductAreaByName(@PathVariable String paId) {
        log.info("Received request for Product area with id {}", paId);
        var pa = teamsService.getProductArea(paId);
        if (pa.isEmpty()) {
            throw new PollyNotFoundException("Couldn't find product area " + paId);
        }
        return new ResponseEntity<>(pa.get().convertToResponseWithMembers(), HttpStatus.OK);
    }

    @ApiOperation(value = "Search product areas")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Product areas fetched", response = ProductAreaPage.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/productarea/search/{name}")
    public ResponseEntity<RestResponsePage<ProductAreaResponse>> searchProductAreaByName(@PathVariable String name) {
        log.info("Received request for product areas with the name like {}", name);
        if (name.length() < 3) {
            throw new ValidationException("Search product area must be at least 3 characters");
        }
        var pas = StreamUtils.filter(teamsService.getAllProductAreas(), pa -> containsIgnoreCase(pa.getName(), name));
        pas.sort(comparing(ProductArea::getName, startsWith(name)));
        log.info("Returned {} pas", pas.size());
        return new ResponseEntity<>(new RestResponsePage<>(convert(pas, ProductArea::convertToResponse)), HttpStatus.OK);
    }

    // Resources

    @ApiOperation(value = "Search resources")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Resources fetched", response = ResourcePage.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/resource/search/{name}")
    public ResponseEntity<RestResponsePage<Resource>> searchResourceName(@PathVariable String name) {
        log.info("Resource search '{}'", name);
        if (Stream.of(name.split(" ")).sorted().distinct().collect(Collectors.joining("")).length() < 3) {
            throw new ValidationException("Search resource must be at least 3 characters");
        }
        var resources = resourceService.search(name);
        log.info("Returned {} resources", resources.getPageSize());
        return new ResponseEntity<>(resources, HttpStatus.OK);
    }

    @ApiOperation("Get Resource")
    @ApiResponses({
            @ApiResponse(code = 200, message = "ok", response = Resource.class),
            @ApiResponse(code = 404, message = "not found")
    })
    @GetMapping("/resource/{id}")
    public ResponseEntity<Resource> getById(@PathVariable String id) {
        log.info("Resource get id={}", id);
        Optional<Resource> resource = resourceService.getResource(id);
        if (resource.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(resource.get());
    }

    static class ResourcePage extends RestResponsePage<Resource> {

    }

    static class TeamPage extends RestResponsePage<TeamResponse> {

    }

    static class ProductAreaPage extends RestResponsePage<ProductAreaResponse> {

    }
}
