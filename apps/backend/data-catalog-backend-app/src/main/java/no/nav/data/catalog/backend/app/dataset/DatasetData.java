package no.nav.data.catalog.backend.app.dataset;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.catalog.backend.app.policy.PolicyResponse;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class DatasetData {

    private String description;
    private String title;
    private List<String> categories;
    private List<String> provenances;
    private Integer pi;
    private LocalDateTime issued;
    private List<PolicyResponse> policies;
    private List<String> keywords;
    private String theme;
    private String accessRights;
    private String publisher;
    private String spatial;
    private String haspart;

}
