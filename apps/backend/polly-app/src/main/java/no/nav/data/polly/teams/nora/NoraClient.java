package no.nav.data.polly.teams.nora;

import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.LoadingCache;
import no.nav.data.polly.common.exceptions.PollyNotFoundException;
import no.nav.data.polly.common.utils.MetricUtils;
import no.nav.data.polly.teams.TeamService;
import no.nav.data.polly.teams.domain.Team;
import org.apache.commons.lang3.StringUtils;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.Objects.requireNonNull;
import static no.nav.data.polly.common.utils.StreamUtils.safeStream;

@Service
@ConditionalOnProperty("polly.client.nora.enable")
public class NoraClient implements TeamService {

    private final RestTemplate restTemplate;
    private final NoraProperties noraProperties;
    private final LoadingCache<String, List<NoraTeam>> allTeamsCache;
    private final LoadingCache<String, NoraTeam> teamCache;

    public NoraClient(RestTemplate restTemplate, NoraProperties noraProperties) {
        this.restTemplate = restTemplate;
        this.noraProperties = noraProperties;

        this.allTeamsCache = Caffeine.newBuilder().recordStats()
                .expireAfterAccess(Duration.ofMinutes(10))
                .maximumSize(1).build(k -> getTeamsResponse());
        this.teamCache = Caffeine.newBuilder().recordStats()
                .expireAfterAccess(Duration.ofMinutes(10))
                .maximumSize(100).build(this::getTeamResponse);
        MetricUtils.register("noraAllTeamsCache", allTeamsCache);
        MetricUtils.register("noraTeamCache", teamCache);
    }

    @Override
    public List<Team> getAllTeams() {
        return getTeams();
    }

    @Override
    public Team getTeam(String teamId) {
        NoraTeam noraTeam = teamCache.get(teamId);
        if (noraTeam == null) {
            throw new PollyNotFoundException("Couldn't find team " + teamId);
        }
        return noraTeam.convertToTeam();
    }

    @Override
    public boolean teamExists(String teamId) {
        return getTeams().stream().anyMatch(team -> team.getId().equals(teamId));
    }

    private List<Team> getTeams() {
        List<NoraTeam> noraApps = allTeamsCache.get("singleton");
        return safeStream(noraApps).map(NoraTeam::convertToTeam).distinct()
                .filter(team -> StringUtils.isNotBlank(team.getId()))
                .sorted(Comparator.comparing(Team::getName)).collect(Collectors.toList());
    }

    private List<NoraTeam> getTeamsResponse() {
        ResponseEntity<NoraTeam[]> response = restTemplate.getForEntity(noraProperties.getTeamsUrl(), NoraTeam[].class);
        Assert.isTrue(response.getStatusCode().is2xxSuccessful() && response.hasBody(), "Call to nora failed " + response.getStatusCode());
        return response.hasBody() ? Arrays.asList(requireNonNull(response.getBody())) : List.of();
    }

    private NoraTeam getTeamResponse(String nick) {
        ResponseEntity<NoraTeam> response = restTemplate.getForEntity(noraProperties.getTeamUrl(), NoraTeam.class, nick);
        Assert.isTrue(response.getStatusCode().is2xxSuccessful() && response.hasBody(), "Call to nora failed for team " + nick + " " + response.getStatusCode());
        return response.hasBody() ? requireNonNull(response.getBody()) : null;
    }

}
