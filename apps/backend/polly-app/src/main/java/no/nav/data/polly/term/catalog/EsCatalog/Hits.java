package no.nav.data.polly.term.catalog.EsCatalog;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.term.catalog.CatalogTerm;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Hits {
    private CatalogTerm _source;
}
