package no.nav.data.polly.term.catalog;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.term.domain.PollyTerm;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CatalogTerm {

    private String id;
    private String term;
    private String description;

    public PollyTerm convertToPollyTerm() {
        return PollyTerm.builder()
                .id(id)
                .name(term)
                .description(description)
                .build();
    }
}
