package no.nav.data.polly.bigquery;


import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.LoadingCache;
import no.nav.data.common.utils.MetricUtils;
import no.nav.data.polly.bigquery.domain.AaregAvtale;
import no.nav.data.polly.bigquery.domain.PollyAaregAvtale;
import no.nav.data.polly.bigquery.queryService.AaregAvtaleQueryService;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static no.nav.data.common.utils.StreamUtils.safeStream;

@Component
public class AaregAvtaleClient implements AaregAvtaleService {

    private final AaregAvtaleQueryService aaregAvtaleQueryService;
    private final LoadingCache<String, List<PollyAaregAvtale>> aaregAvtaleSearchCache;
    private final LoadingCache<String, PollyAaregAvtale> aaregAvtaleCache;


    public AaregAvtaleClient(AaregAvtaleQueryService aaregAvtaleQueryService) {
        this.aaregAvtaleQueryService = aaregAvtaleQueryService;

        this.aaregAvtaleSearchCache = Caffeine.newBuilder().recordStats()
                .expireAfterWrite(Duration.ofMinutes(10))
                .maximumSize(1000).build(this::searchBigQuery);
        this.aaregAvtaleCache = Caffeine.newBuilder().recordStats()
                .expireAfterWrite(Duration.ofMinutes(10))
                .maximumSize(1000).build(this::getFromBigQuery);
        MetricUtils.register("aaregAvtaleSearchCache", aaregAvtaleSearchCache);
        MetricUtils.register("aaregAvtaleCache", aaregAvtaleCache);
    }

    @Override
    public List<PollyAaregAvtale> searchAaregAvtale(String searchString) {
        List<PollyAaregAvtale> aaregAvtaleList = aaregAvtaleSearchCache.get(searchString);
        return safeStream(aaregAvtaleList).toList();
    }

    @Override
    public Optional<PollyAaregAvtale> getAaregAvtale(String avtaleId) {
        PollyAaregAvtale aaregAvtale = aaregAvtaleCache.get(avtaleId);
        return Optional.ofNullable(aaregAvtale);
    }



    private List<PollyAaregAvtale> searchBigQuery(String searchParam) {
        return aaregAvtaleQueryService.searchAaregAvtale(searchParam).stream().map(AaregAvtale::toPollyAaregAvtale).collect(Collectors.toList());
    }

    private PollyAaregAvtale getFromBigQuery(String avtaleId){
        return aaregAvtaleQueryService.getByAvtaleId(avtaleId).toPollyAaregAvtale();
    }
}
