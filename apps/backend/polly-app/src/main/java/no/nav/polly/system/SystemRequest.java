package no.nav.polly.system;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.polly.common.validator.FieldValidator;
import no.nav.polly.common.validator.RequestElement;
import no.nav.polly.distributionchannel.DistributionChannelShort;
import no.nav.polly.distributionchannel.DistributionChannelType;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import static no.nav.polly.common.utils.StreamUtils.safeStream;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemRequest implements RequestElement {

    private String name;
    private List<DistributionChannelShort> producerDistributionChannels;
    private List<DistributionChannelShort> consumerDistributionChannels;

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
        return "system";
    }

    @Override
    public String getReference() {
        return "Request:" + requestIndex;
    }

    static void initiateRequests(List<SystemRequest> requests, boolean update) {
        AtomicInteger requestIndex = new AtomicInteger(1);
        requests.forEach(systemRequest -> {
            systemRequest.setUpdate(update);
            systemRequest.setRequestIndex(requestIndex.getAndIncrement());
        });
    }

    @Override
    public FieldValidator validateFields() {
        FieldValidator validator = new FieldValidator(getReference());

        validator.checkBlank("name", getName());
        safeStream(getProducerDistributionChannels())
                .forEach(producer -> {
                    validator.checkBlank("producerDistributionChannels.name", producer.getName());
                    validator.checkEnum("producerDistributionChannels.type", producer.getType(), DistributionChannelType.class);
                });
        safeStream(getConsumerDistributionChannels())
                .forEach(consumer -> {
                    validator.checkBlank("consumerDistributionChannels.name", consumer.getName());
                    validator.checkEnum("consumerDistributionChannels.type", consumer.getType(), DistributionChannelType.class);
                });

        return validator;
    }
}
