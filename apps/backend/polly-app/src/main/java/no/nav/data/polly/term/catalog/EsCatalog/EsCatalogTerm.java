package no.nav.data.polly.term.catalog.EsCatalog;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.term.catalog.CatalogTerm;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EsCatalogTerm {
    private EsResults hits;

    public CatalogTerm[] getResults() {
        List<CatalogTerm> results = new ArrayList<>();

        this.hits.getHits().forEach(hit -> {
            results.add(hit.get_source());
        });

        return results.toArray(CatalogTerm[]::new);
    }
}
