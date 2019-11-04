package no.nav.data.polly.elasticsearch.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class PolicyElasticsearch {

    private String purpose;
    private String description;
    private String subjectCategory;
    private List<LegalBasisElasticsearch> legalbases = new ArrayList<>();

}
