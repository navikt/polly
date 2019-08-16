package no.nav.data.catalog.backend.app.dataset;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class DatasetData {

    DatasetData(DatasetMaster master) {
        this.master = master;
    }

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

    @Setter(AccessLevel.PRIVATE)
    private DatasetMaster master;

    public boolean hasMaster() {
        return master != null;
    }

}
