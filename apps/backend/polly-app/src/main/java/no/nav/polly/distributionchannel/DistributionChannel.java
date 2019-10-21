package no.nav.polly.distributionchannel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;
import no.nav.polly.common.auditing.Auditable;
import no.nav.polly.common.utils.StreamUtils;
import no.nav.polly.dataset.Dataset;
import no.nav.polly.system.System;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.annotations.Type;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

@Slf4j
@Data
@EqualsAndHashCode(exclude = {"producers", "consumers"}, callSuper = false)
@ToString(exclude = {"producers", "consumers"})
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "DISTRIBUTION_CHANNEL")
public class DistributionChannel extends Auditable<String> {

    @Id
    @Column(name = "DISTRIBUTION_CHANNEL_ID")
    @Type(type = "pg-uuid")
    private UUID id;

    @NotNull
    @Column(name = "NAME", nullable = false)
    private String name;

    @Column(name = "DESCRIPTION")
    private String description;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "TYPE", nullable = false)
    private DistributionChannelType type;

    @ManyToMany(mappedBy = "distributionChannels")
    private Set<Dataset> datasets = new HashSet<>();

    @ManyToMany
    @JoinTable(name = "DISTRIBUTION_CHANNEL__SYSTEM_PRODUCER",
            joinColumns = @JoinColumn(name = "DISTRIBUTION_CHANNEL_ID"),
            inverseJoinColumns = @JoinColumn(name = "SYSTEM_ID"))
    private Set<System> producers = new HashSet<>();

    @ManyToMany
    @JoinTable(name = "DISTRIBUTION_CHANNEL__SYSTEM_CONSUMER",
            joinColumns = @JoinColumn(name = "DISTRIBUTION_CHANNEL_ID"),
            inverseJoinColumns = @JoinColumn(name = "SYSTEM_ID"))
    private Set<System> consumers = new HashSet<>();

    public DistributionChannel convertNewFromRequest(DistributionChannelRequest request) {
        this.id = UUID.randomUUID();
        this.datasets = new HashSet<>();
        this.producers = new HashSet<>();
        this.consumers = new HashSet<>();
        convertFromRequest(request);
        return this;
    }

    public DistributionChannel convertUpdateFromRequest(DistributionChannelRequest request) {
        convertFromRequest(request);
        return this;
    }

    private void convertFromRequest(DistributionChannelRequest request) {
        this.name = StringUtils.trim(request.getName());
        this.description = StringUtils.trim(request.getDescription());
        this.type = request.getType();
    }

    public DistributionChannelResponse convertToResponse() {
        return new DistributionChannelResponse(this);
    }

    public void addConsumer(System system) {
        if (system != null) {
            getConsumers().add(system);
            system.getConsumerDistributionChannels().add(this);
        }
    }

    public void removeConsumer(System system) {
        if (system != null) {
            getConsumers().remove(system);
            system.getConsumerDistributionChannels().remove(this);
            log.info("Removed consumer={} from distributionChannel={}", system.getName(), getName());
        }
    }

    public void addProducer(System system) {
        if (system != null) {
            getProducers().add(system);
            system.getProducerDistributionChannels().add(this);
        }
    }

    public void removeProducer(System system) {
        if (system != null) {
            getProducers().remove(system);
            system.getProducerDistributionChannels().remove(this);
            log.info("Removed producer={} from distributionChannel={}", system.getName(), getName());
        }
    }

    public static List<String> names(Collection<DistributionChannel> distributionChannels) {
        return StreamUtils.safeStream(distributionChannels).map(DistributionChannel::getName).collect(Collectors.toList());
    }

    // TODO: Add description to distributionChannelShort, otherwise it will overwrite existing description with emtpy string.
    public static List<DistributionChannelShort> distributionChannelShorts(Collection<DistributionChannel> distributionChannels) {
        return StreamUtils.safeStream(distributionChannels)
                .map(distributionChannel -> new DistributionChannelShort(distributionChannel.getName(), distributionChannel.getType().name()))
                .collect(Collectors.toList());
    }

    public static class DistributionChannelBuilder {

        private Set<Dataset> datasets = new HashSet<>();
        private Set<System> producers = new HashSet<>();
        private Set<System> consumers = new HashSet<>();

    }

}
