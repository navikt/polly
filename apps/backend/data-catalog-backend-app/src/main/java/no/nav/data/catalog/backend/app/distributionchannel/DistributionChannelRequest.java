package no.nav.data.catalog.backend.app.distributionchannel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DistributionChannelRequest {

    private String name;
    private String description;
    private DistributionChannelType type;
    private List<String> producers;
    private List<String> consumers;
}
