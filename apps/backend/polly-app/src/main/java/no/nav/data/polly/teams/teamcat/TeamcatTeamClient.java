package no.nav.data.polly.teams.teamcat;

import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.LoadingCache;
import no.nav.data.common.rest.RestResponsePage;
import no.nav.data.common.utils.MetricUtils;
import no.nav.data.polly.teams.TeamService;
import no.nav.data.polly.teams.domain.ProductArea;
import no.nav.data.polly.teams.domain.Team;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

import static java.util.Objects.requireNonNull;
import static no.nav.data.common.utils.StreamUtils.filter;
import static no.nav.data.common.utils.StreamUtils.safeStream;

@Service
@ConditionalOnProperty("polly.client.teamcat-team.enabled")
public class TeamcatTeamClient implements TeamService {

    private final RestTemplate restTemplate;
    private final TeamcatProperties properties;

    private final LoadingCache<String, Map<String, Team>> allTeamsCache;
    private final LoadingCache<String, Map<String, ProductArea>> allPaCache;

    public TeamcatTeamClient(RestTemplate restTemplate,
            TeamcatProperties properties) {
        this.restTemplate = restTemplate;
        this.properties = properties;

        this.allTeamsCache = Caffeine.newBuilder().recordStats()
                .expireAfterAccess(Duration.ofMinutes(10))
                .maximumSize(1).build(k -> getTeamsResponse());
        MetricUtils.register("teamsCache", allTeamsCache);

        this.allPaCache = Caffeine.newBuilder().recordStats()
                .expireAfterAccess(Duration.ofMinutes(10))
                .maximumSize(1).build(k -> getProductAreasResponse());
        MetricUtils.register("productAreaCache", allPaCache);
    }

    @Override
    public List<Team> getAllTeams() {
        ArrayList<Team> teams = new ArrayList<>(getTeams().values());
        teams.sort(Comparator.comparing(Team::getName));
        return teams;
    }

    @Override
    public Optional<Team> getTeam(String teamId) {
        return Optional.ofNullable(getTeams().get(teamId));
    }

    @Override
    public List<ProductArea> getAllProductAreas() {
        var pas = new ArrayList<>(getProductAreas().values());
        pas.sort(Comparator.comparing(ProductArea::getName));
        return pas;
    }

    @Override
    public Optional<ProductArea> getProductArea(String productAreaId) {
        return Optional.ofNullable(getProductAreas().get(productAreaId));
    }

    @Override
    public List<Team> getTeamsForProductArea(String productAreaId) {
        return filter(getAllTeams(), t -> productAreaId.equals(t.getProductAreaId()));
    }

    private Map<String, ProductArea> getProductAreasResponse() {
        var response = restTemplate.getForEntity(properties.getProductAreasUrl(), ProductAreaPage.class);
        List<TeamKatProductArea> teams = response.hasBody() ? requireNonNull(response.getBody()).getContent() : List.of();
        return safeStream(teams)
                .map(TeamKatProductArea::convertToProductArea)
                .collect(Collectors.toMap(ProductArea::getId, Function.identity()));
    }

    private Map<String, ProductArea> getProductAreas() {
        return allPaCache.get("singleton");
    }

    @Override
    public boolean teamExists(String teamId) {
        return getTeams().containsKey(teamId);
    }

    private Map<String, Team> getTeams() {
        return allTeamsCache.get("singleton");
    }

    private Map<String, Team> getTeamsResponse() {
        var response = restTemplate.getForEntity(properties.getTeamsUrl(), TeamPage.class);
        List<TeamKatTeam> teams = response.hasBody() ? requireNonNull(response.getBody()).getContent() : List.of();
        return safeStream(teams)
                .map(TeamKatTeam::convertToTeam)
                .collect(Collectors.toMap(Team::getId, Function.identity()));
    }

    static class TeamPage extends RestResponsePage<TeamKatTeam> {

    }

    static class ProductAreaPage extends RestResponsePage<TeamKatProductArea> {

    }

}
