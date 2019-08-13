package no.nav.data.catalog.backend.app.dataset;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class DatasetData {

    private String title;
    private String description;
    private List<String> categories;
    private List<String> provenances;
    private Boolean pi;
    private LocalDateTime issued;
    private List<String> keywords;
    private String theme;
    private String accessRights;
    private String publisher;
    private String spatial;
    private String haspart;

    private DatasetMaster master;

    public boolean hasMaster() {
        return master != null;
    }

}
