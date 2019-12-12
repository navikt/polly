package no.nav.data.polly.term.catalog;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.term.domain.PollyTerm;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

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

        this.termSearchCache = Caffeine.newBuilder()
                .expireAfterAccess(Duration.ofMinutes(10))
                .maximumSize(1000).build();
        this.termCache = Caffeine.newBuilder()
                .expireAfterAccess(Duration.ofMinutes(10))
                .maximumSize(1000).build();
    }

    public List<PollyTerm> getTerms(String searchString) {
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
        ResponseEntity<GraphNode> response = null;
        try {
            response = restTemplate.getForEntity(properties.getGetUrl(), GraphNode.class, termId);
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                log.debug("term {} not found", termId);
                return null;
            }
            throw e;
        }
        verifyResponse(response);
        return response.getBody();
    }

    private List<CatalogTerm> searchCatalog(String searchString) {
        ResponseEntity<CatalogTerm[]> response = restTemplate.getForEntity(properties.getSearchUrl(), CatalogTerm[].class, searchString);
        verifyResponse(response);
        return response.hasBody() ? asList(requireNonNull(response.getBody())) : List.of();
    }

    private void verifyResponse(ResponseEntity<?> responseEntity) {
        Assert.isTrue(responseEntity.getStatusCode().is2xxSuccessful() && responseEntity.hasBody(), "Call to term catalog failed " + responseEntity.getStatusCode());
    }

}
