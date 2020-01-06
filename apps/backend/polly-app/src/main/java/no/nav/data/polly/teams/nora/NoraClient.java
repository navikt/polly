package no.nav.data.polly.teams.nora;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import no.nav.data.polly.common.utils.MetricUtils;
import no.nav.data.polly.common.utils.StreamUtils;
import no.nav.data.polly.teams.TeamService;
import no.nav.data.polly.teams.domain.Team;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.Objects.requireNonNull;
import static no.nav.data.polly.common.utils.StreamUtils.safeStream;

@Service
@ConditionalOnProperty("polly.client.nora.enable")
public class NoraClient implements TeamService {

    private final RestTemplate restTemplate;
    private final NoraProperties noraProperties;
    private final Cache<String, List<NoraTeam>> appsCache;

    public NoraClient(RestTemplate restTemplate, NoraProperties noraProperties) {
        this.restTemplate = restTemplate;
        this.noraProperties = noraProperties;

        this.appsCache = Caffeine.newBuilder().recordStats()
                .expireAfterAccess(Duration.ofMinutes(10))
                .maximumSize(1).build();
        MetricUtils.register("noraAppsCache", appsCache);
    }

    @Override
    public List<Team> getAllProductTeams() {
        return getTeams();
    }

    @Override
    public Team getTeam(String teamId) {
        return StreamUtils.find(getTeams(), n -> n.getId().equals(teamId));
    }

    @Override
    public boolean teamExists(String teamId) {
        return getTeams().stream().anyMatch(team -> team.getId().equals(teamId));
    }

    private List<Team> getTeams() {
        List<NoraTeam> noraApps = appsCache.get("singleton", key -> getTeamsResponse());
        return safeStream(noraApps).map(noraTeam -> new Team(noraTeam.getNick(), noraTeam.getName())).distinct().sorted().collect(Collectors.toList());
    }

    private List<NoraTeam> getTeamsResponse() {
        ResponseEntity<NoraTeam[]> response = restTemplate.getForEntity(noraProperties.getTeamsUrl(), NoraTeam[].class);
        Assert.isTrue(response.getStatusCode().is2xxSuccessful() && response.hasBody(), "Call to nora failed " + response.getStatusCode());
        return response.hasBody() ? Arrays.asList(requireNonNull(response.getBody())) : List.of();
    }

}
