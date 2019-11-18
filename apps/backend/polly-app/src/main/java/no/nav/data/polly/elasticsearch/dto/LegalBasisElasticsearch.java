package no.nav.data.polly.elasticsearch.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.codelist.dto.CodelistResponse;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LegalBasisElasticsearch {

    private CodelistResponse gdpr;
    private CodelistResponse nationalLaw;
    private String description;
    private String start;
    private String end;
    private boolean active;

    public String toShortForm() {
        return gdpr + " " + nationalLaw + " " + description;
    }
}
