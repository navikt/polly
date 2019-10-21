package no.nav.polly.distributionchannel;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.polly.common.validator.FieldValidator;
import no.nav.polly.common.validator.RequestElement;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DistributionChannelRequest implements RequestElement {

    private String name;
    private String description;
    private DistributionChannelType type;
    private List<String> producers;
    private List<String> consumers;

    @JsonIgnore
    private boolean update;
    @JsonIgnore
    private int requestIndex;

    @Override
    public String getIdentifyingFields() {
        return name;
    }

    @Override
    public String getRequestType() {
        return "distributionChannel";
    }

    @Override
    public String getReference() {
        return "Request:" + requestIndex;
    }


    static void initiateRequests(List<DistributionChannelRequest> requests, boolean update) {
        AtomicInteger requestIndex = new AtomicInteger(1);
        requests.forEach(distributionChannelRequest -> {
            distributionChannelRequest.setUpdate(update);
            distributionChannelRequest.setRequestIndex(requestIndex.getAndIncrement());
        });
    }

    @Override
    public FieldValidator validateFields() {
        FieldValidator validator = new FieldValidator(getReference());

        validator.checkBlank("name", getName());
        validator.checkBlank("description", getDescription());
        validator.checkEnum("type", getType().toString(), DistributionChannelType.class);
        validator.checkListOfFields("producers", getProducers());
        validator.checkListOfFields("consumers", getConsumers());

        return validator;
    }
}
