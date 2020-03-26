package no.nav.data.polly.teams.teamcat;

import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.LoadingCache;
import no.nav.data.polly.common.rest.RestResponsePage;
import no.nav.data.polly.common.utils.MetricUtils;
import no.nav.data.polly.teams.ResourceService;
import no.nav.data.polly.teams.dto.Resource;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.Optional;

@Service
@ConditionalOnProperty("polly.client.resource-teamcat.enabled")
public class TeamcatClient implements ResourceService {

    private final RestTemplate restTemplate;
    private final TeamcatProperties teamcatProperties;

    private final LoadingCache<String, RestResponsePage<Resource>> searchCache;
    private final LoadingCache<String, Resource> cache;

    public TeamcatClient(RestTemplate restTemplate,
            TeamcatProperties teamcatProperties) {
        this.restTemplate = restTemplate;
        this.teamcatProperties = teamcatProperties;

        this.searchCache = Caffeine.newBuilder().recordStats()
                .expireAfterAccess(Duration.ofMinutes(1))
                .maximumSize(1000).build(this::doSearch);
        this.cache = Caffeine.newBuilder().recordStats()
                .expireAfterAccess(Duration.ofMinutes(1))
                .maximumSize(1000).build(this::fetchResource);
        MetricUtils.register("teamcatResourcesSearchCache", searchCache);
        MetricUtils.register("teamcatResourcesCache", cache);
    }

    @Override
    public Optional<Resource> getResource(String ident) {
        return Optional.ofNullable(cache.get(ident));
    }

    @Override
    public RestResponsePage<Resource> search(String name) {
        return searchCache.get(name);
    }

    private Resource fetchResource(String ident) {
        try {
            var response = restTemplate.getForEntity(teamcatProperties.getGetUrl(), Resource.class, ident);
            Assert.isTrue(response.getStatusCode().is2xxSuccessful() && response.hasBody(), "Call to teamcat failed " + response.getStatusCode());
            return response.getBody();
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                return null;
            }
            throw e;
        }
    }

    private RestResponsePage<Resource> doSearch(String name) {
        var response = restTemplate.getForEntity(teamcatProperties.getSearchUrl(), ResourcePage.class, name);
        Assert.isTrue(response.getStatusCode().is2xxSuccessful() && response.hasBody(), "Call to teamcat failed " + response.getStatusCode());
        return response.getBody();
    }

    static class ResourcePage extends RestResponsePage<Resource> {

    }
}
