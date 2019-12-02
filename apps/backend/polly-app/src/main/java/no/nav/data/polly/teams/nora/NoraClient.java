package no.nav.data.polly.teams.nora;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import no.nav.data.polly.teams.nora.NoraApps.NoraApp;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

import static no.nav.data.polly.common.utils.StreamUtils.safeStream;

@Component
public class NoraClient {

    private final RestTemplate restTemplate;
    private final NoraProperties noraProperties;
    private final Cache<String, NoraApps> appsCache;

    public NoraClient(RestTemplate restTemplate, NoraProperties noraProperties) {
        this.restTemplate = restTemplate;
        this.noraProperties = noraProperties;

        this.appsCache = Caffeine.newBuilder()
                .expireAfterAccess(Duration.ofMinutes(10))
                .maximumSize(1).build();
    }

    public List<String> getTeamNames() {
        NoraApps noraApps = appsCache.get("singleton", key -> getAppsResponse());
        return safeStream(noraApps.getApps()).map(NoraApp::getTeam).distinct().sorted().collect(Collectors.toList());
    }

    private NoraApps getAppsResponse() {
        ResponseEntity<NoraApps> response = restTemplate.getForEntity(noraProperties.getAppsUrl(), NoraApps.class);
        Assert.isTrue(response.getStatusCode().is2xxSuccessful() && response.hasBody(), "Call to nora failed " + response.getStatusCode());
        return response.getBody();
    }

}
