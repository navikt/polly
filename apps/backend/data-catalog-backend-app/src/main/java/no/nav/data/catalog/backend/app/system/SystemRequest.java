package no.nav.data.catalog.backend.app.system;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemRequest {

    private String name;
    private List<String> producerDistributionChannels;
    private List<String> consumerDistributionChannels;

}
