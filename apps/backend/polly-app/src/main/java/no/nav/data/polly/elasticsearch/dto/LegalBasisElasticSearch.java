package no.nav.data.polly.elasticsearch.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class LegalBasisElasticSearch {

    private String gdpr;
    private String nationalLaw;
    private String description;
    private String start;
    private String end;
}
