package no.nav.polly.dataset;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;
import no.nav.polly.distributionchannel.DistributionChannelShort;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class DatasetData {

    DatasetData(DatacatalogMaster datacatalogMaster) {
        this.datacatalogMaster = datacatalogMaster;
    }

    private ContentType contentType;
    private String title;
    private String description;
    private List<String> categories;
    private List<String> provenances;
    private Boolean pi;
    private List<String> keywords;
    private List<String> themes;
    private String accessRights;
    private String spatial;
    private List<String> haspart;
    private List<DistributionChannelShort> distributionChannels;

    private String publisher;
    private LocalDateTime issued;

    @Setter(AccessLevel.PRIVATE)
    private DatacatalogMaster datacatalogMaster;

    public boolean hasDatacatalogMaster() {
        return datacatalogMaster != null;
    }

}
