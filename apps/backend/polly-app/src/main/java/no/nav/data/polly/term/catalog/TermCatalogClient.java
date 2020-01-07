package no.nav.data.polly.term.catalog;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.common.utils.MetricUtils;
import no.nav.data.polly.term.domain.PollyTerm;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.Duration;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.util.Arrays.asList;
import static java.util.Objects.requireNonNull;
import static no.nav.data.polly.common.utils.StreamUtils.safeStream;

@Slf4j
@Component
public class TermCatalogClient {

    private final RestTemplate restTemplate;
    private final TermCatalogProperties properties;
    private final Cache<String, List<CatalogTerm>> termSearchCache;
    private final Cache<String, GraphNode> termCache;

    public TermCatalogClient(RestTemplate restTemplate, TermCatalogProperties properties) {
        this.restTemplate = restTemplate;
        this.properties = properties;

        this.termSearchCache = Caffeine.newBuilder().recordStats()
                .expireAfterAccess(Duration.ofMinutes(10))
                .maximumSize(1000).build();
        this.termCache = Caffeine.newBuilder().recordStats()
                .expireAfterAccess(Duration.ofMinutes(10))
                .maximumSize(1000).build();
        MetricUtils.register("termSearchCache", termSearchCache);
        MetricUtils.register("termCache", termCache);
    }

    public List<PollyTerm> searchTerms(String searchString) {
        List<CatalogTerm> terms = termSearchCache.get(searchString, this::searchCatalog);
        return safeStream(terms)
                .map(CatalogTerm::convertToPollyTerm)
                .collect(Collectors.toList());
    }

    public Optional<PollyTerm> getTerm(String termId) {
        GraphNode term = termCache.get(termId, this::getFromCatalog);
        return Optional.ofNullable(term).map(GraphNode::convertToPollyTerm);
    }

    private GraphNode getFromCatalog(String termId) {
        ResponseEntity<GraphNode[]> response;
        try {
            response = restTemplate.getForEntity(properties.getGetUrl(), GraphNode[].class, termId);
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                log.debug("term {} not found", termId);
                return null;
            }
            throw e;
        }
        verifyResponse(response);
        GraphNode[] body = requireNonNull(response.getBody());
        if (body.length == 0) {
            log.debug("term {} not found", termId);
            return null;
        }
        Assert.isTrue(body.length == 1, "more than one result for id lookup");
        return body[0];
    }

    @SneakyThrows
    private List<CatalogTerm> searchCatalog(String searchString) {
        var uri = UriComponentsBuilder.fromUriString(properties.getSearchUrl())
                .queryParam("term_name", searchString)
                .build().toUri();
        ResponseEntity<CatalogTerm[]> response = restTemplate.getForEntity(uri, CatalogTerm[].class);
        verifyResponse(response);
        return asList(requireNonNull(response.getBody()));
    }

    private void verifyResponse(ResponseEntity<?> responseEntity) {
        Assert.isTrue(responseEntity.getStatusCode().is2xxSuccessful() && responseEntity.hasBody(), "Call to term catalog failed " + responseEntity.getStatusCode());
    }

}
