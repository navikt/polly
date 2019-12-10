package no.nav.data.polly.teams.nora;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.Objects.requireNonNull;
import static no.nav.data.polly.common.utils.StreamUtils.safeStream;

@Component
public class NoraClient {

    private final RestTemplate restTemplate;
    private final NoraProperties noraProperties;
    private final Cache<String, List<NoraApp>> appsCache;

    public NoraClient(RestTemplate restTemplate, NoraProperties noraProperties) {
        this.restTemplate = restTemplate;
        this.noraProperties = noraProperties;

        this.appsCache = Caffeine.newBuilder()
                .expireAfterAccess(Duration.ofMinutes(10))
                .maximumSize(1).build();
    }

    public List<String> getTeamNames() {
        List<NoraApp> noraApps = appsCache.get("singleton", key -> getAppsResponse());
        return safeStream(noraApps).map(NoraApp::getTeam).distinct().sorted().collect(Collectors.toList());
    }

    private List<NoraApp> getAppsResponse() {
        ResponseEntity<NoraApp[]> response = restTemplate.getForEntity(noraProperties.getAppsUrl(), NoraApp[].class);
        Assert.isTrue(response.getStatusCode().is2xxSuccessful() && response.hasBody(), "Call to nora failed " + response.getStatusCode());
        return response.hasBody() ? Arrays.asList(requireNonNull(response.getBody())) : List.of();
    }

}
