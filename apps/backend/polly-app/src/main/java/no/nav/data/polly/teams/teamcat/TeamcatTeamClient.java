package no.nav.data.polly.teams.teamcat;

import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.LoadingCache;
import no.nav.data.polly.common.rest.RestResponsePage;
import no.nav.data.polly.common.utils.MetricUtils;
import no.nav.data.polly.teams.TeamService;
import no.nav.data.polly.teams.domain.Team;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
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
import static no.nav.data.polly.common.utils.StreamUtils.safeStream;

@Service
@ConditionalOnProperty("polly.client.teamcat-team.enabled")
public class TeamcatTeamClient implements TeamService {

    private final RestTemplate restTemplate;
    private final TeamcatProperties properties;

    private final LoadingCache<String, Map<String, Team>> allTeamsCache;

    public TeamcatTeamClient(RestTemplate restTemplate,
            TeamcatProperties properties) {
        this.restTemplate = restTemplate;
        this.properties = properties;

        this.allTeamsCache = Caffeine.newBuilder().recordStats()
                .expireAfterAccess(Duration.ofMinutes(10))
                .maximumSize(1).build(k -> getTeamsResponse());
        MetricUtils.register("teamsCache", allTeamsCache);
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
    public boolean teamExists(String teamId) {
        return getTeams().containsKey(teamId);
    }

    private Map<String, Team> getTeams() {
        return allTeamsCache.get("singleton");
    }

    private Map<String, Team> getTeamsResponse() {
        var response = restTemplate.getForEntity(properties.getTeamsUrl(), TeamKatPage.class);
        Assert.isTrue(response.getStatusCode().is2xxSuccessful() && response.hasBody(), "Call to teams failed " + response.getStatusCode());
        List<TeamKatTeam> teams = response.hasBody() ? requireNonNull(response.getBody()).getContent() : List.of();
        return safeStream(teams)
                .map(TeamKatTeam::convertToTeam)
                .collect(Collectors.toMap(Team::getId, Function.identity()));
    }

    static class TeamKatPage extends RestResponsePage<TeamKatTeam> {

    }

}
