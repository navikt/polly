package no.nav.data.polly.elasticsearch.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.codelist.dto.CodeResponse;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LegalBasisElasticsearch {

    private String gdpr;
    private CodeResponse nationalLaw;
    private String description;
    private String start;
    private String end;

    public String toShortForm() {
        return "gdpr " + gdpr + " " + nationalLaw + " " + description;
    }
}
