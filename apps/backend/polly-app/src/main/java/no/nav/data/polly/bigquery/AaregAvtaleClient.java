package no.nav.data.polly.bigquery;


import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.LoadingCache;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.utils.MetricUtils;
import no.nav.data.polly.bigquery.domain.AaregAvtale;
import no.nav.data.polly.bigquery.queryService.AaregAvtaleQueryService;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static no.nav.data.common.utils.StreamUtils.safeStream;

@Slf4j
@Component
public class AaregAvtaleClient implements AaregAvtaleService {

    private final AaregAvtaleQueryService aaregAvtaleQueryService;
    private final LoadingCache<String, List<AaregAvtale>> aaregAvtaleSearchCache;
    private final LoadingCache<String, AaregAvtale> aaregAvtaleCache;


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
    public List<AaregAvtale> searchAaregAvtale(String searchString) {
        List<AaregAvtale> aaregAvtaleList = aaregAvtaleSearchCache.get(searchString);
        return safeStream(aaregAvtaleList).toList();
    }

    @Override
    public Optional<AaregAvtale> getAaregAvtale(String avtaleId) {
        AaregAvtale aaregAvtale = aaregAvtaleCache.get(avtaleId);
        return Optional.ofNullable(aaregAvtale);
    }



    private List<AaregAvtale> searchBigQuery(String searchTerm) {
        List<AaregAvtale> aaregAvtaleList = new ArrayList<>();
        return aaregAvtaleList;
    }

    private AaregAvtale getFromBigQuery(String avtaleId){
        return aaregAvtaleQueryService.getByAvtaleId(avtaleId);
    }
}
