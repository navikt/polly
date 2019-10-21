package no.nav.polly.distributionchannel;

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
public class DistributionChannelShort {

    private String name;
    private String type;

    public DistributionChannelRequest toRequest() {
        return DistributionChannelRequest.builder()
                .name(name)
                .type(DistributionChannelType.valueOf(type))
                .build();
    }
}
