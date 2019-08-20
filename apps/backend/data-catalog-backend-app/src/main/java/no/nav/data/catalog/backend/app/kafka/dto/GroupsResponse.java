package no.nav.data.catalog.backend.app.kafka.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.catalog.backend.app.common.utils.StreamUtils;
import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannelRequest;
import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannelType;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GroupsResponse {

    private String name;
    private List<Group> groups;

    public DistributionChannelRequest convertToDistributionChannelRequest() {
        return DistributionChannelRequest.builder()
                .name(name)
                .type(DistributionChannelType.KAFKA)
                .producers(find(Type.PRODUCER).convertToSystemNames())
                .consumers(find(Type.CONSUMER).convertToSystemNames())
                .build();
    }

    private Group find(Type type) {
        return StreamUtils.safeStream(groups)
                .filter(group -> group.isType(type))
                .findFirst()
                .orElse(new Group());
    }
}
