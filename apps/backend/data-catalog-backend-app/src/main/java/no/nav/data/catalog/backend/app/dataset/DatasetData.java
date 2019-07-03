package no.nav.data.catalog.backend.app.dataset;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.catalog.backend.app.policy.PolicyResponse;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DatasetData {

    private String description;
    private String title;
    private List<String> category;
    private List<String> provenance;
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
