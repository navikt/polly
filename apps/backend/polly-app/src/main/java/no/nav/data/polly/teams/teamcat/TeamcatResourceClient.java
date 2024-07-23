package no.nav.data.polly.teams.teamcat;

import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.LoadingCache;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.rest.RestResponsePage;
import no.nav.data.common.utils.MetricUtils;
import no.nav.data.polly.teams.ResourceService;
import no.nav.data.polly.teams.dto.Resource;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static no.nav.data.common.utils.StreamUtils.toMap;

@Slf4j
@Component
@ConditionalOnProperty("client.teamcat-resource.enabled")
public class TeamcatResourceClient implements ResourceService {

    private final RestTemplate restTemplate;
    private final TeamcatProperties properties;

    private final LoadingCache<String, RestResponsePage<Resource>> searchCache;
    private final LoadingCache<String, Resource> cache;

    public TeamcatResourceClient(RestTemplate restTemplate, TeamcatProperties properties) {
        this.restTemplate = restTemplate;
        this.properties = properties;

        this.searchCache = Caffeine.newBuilder().recordStats()
                .expireAfterWrite(Duration.ofMinutes(10))
                .maximumSize(1000).build(this::doSearch);
        this.cache = Caffeine.newBuilder().recordStats()
                .expireAfterWrite(Duration.ofMinutes(10))
                .maximumSize(1000).build(this::fetchResource);
        MetricUtils.register("teamcatResourcesSearchCache", searchCache);
        MetricUtils.register("teamcatResourcesCache", cache);
    }

    @Override
    public Optional<Resource> getResource(String ident) {
        return Optional.ofNullable(cache.get(ident));
    }

    @Override
    public Map<String, Resource> getResources(Collection<String> idents) {
        return cache.getAll(idents, this::getResources0);
    }

    @Override
    public RestResponsePage<Resource> search(String name) {
        return searchCache.get(name);
    }

    private Resource fetchResource(String ident) {
        try {
            var response = restTemplate.getForEntity(properties.getResourceUrl(), Resource.class, ident);
            Assert.isTrue(response.getStatusCode().is2xxSuccessful() && response.hasBody(), "Call to teamcat failed " + response.getStatusCode());
            return response.getBody();
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                return null;
            }
            throw e;
        }
    }

    private Map<String, Resource> getResources0(Iterable<? extends String> idents) {
        var response = restTemplate.postForEntity(properties.getResourcesUrl(), idents, ResourcePage.class);
        Assert.isTrue(response.getStatusCode().is2xxSuccessful() && response.hasBody(), "Call to teamcat failed " + response.getStatusCode());
        Assert.isTrue(response.getBody() != null, "response is null");
        List<Resource> resources = response.getBody().getContent();
        log.info("fetched {} resources from teamkat", resources.size());
        return toMap(resources, Resource::getNavIdent);
    }

    private RestResponsePage<Resource> doSearch(String name) {
        var response = restTemplate.getForEntity(properties.getResourceSearchUrl(), ResourcePage.class, name);
        Assert.isTrue(response.getStatusCode().is2xxSuccessful() && response.hasBody(), "Call to teamcat failed " + response.getStatusCode());
        return response.getBody();
    }

    static class ResourcePage extends RestResponsePage<Resource> {
    }
}
