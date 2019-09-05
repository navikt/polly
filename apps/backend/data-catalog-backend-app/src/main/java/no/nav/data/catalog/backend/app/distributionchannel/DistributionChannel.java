package no.nav.data.catalog.backend.app.distributionchannel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.catalog.backend.app.common.auditing.Auditable;
import no.nav.data.catalog.backend.app.common.utils.StreamUtils;
import no.nav.data.catalog.backend.app.dataset.Dataset;
import no.nav.data.catalog.backend.app.system.System;
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
    private Set<System> producers;

    @ManyToMany
    @JoinTable(name = "DISTRIBUTION_CHANNEL__SYSTEM_CONSUMER",
            joinColumns = @JoinColumn(name = "DISTRIBUTION_CHANNEL_ID"),
            inverseJoinColumns = @JoinColumn(name = "SYSTEM_ID"))
    private Set<System> consumers;

    public DistributionChannel convertFromRequest(DistributionChannelRequest request, boolean isUpdate) {
        if (!isUpdate) {
            this.id = UUID.randomUUID();
            this.producers = new HashSet<>();
            this.consumers = new HashSet<>();
        }
        this.name = StringUtils.trim(request.getName());
        this.description = StringUtils.trim(request.getDescription());
        this.type = request.getType();

        return this;
    }

    public DistributionChannelResponse convertToResponse() {
        return new DistributionChannelResponse(this);
    }

    public void addConsumer(System system) {
        getConsumers().add(system);
        system.getConsumerDistributionChannels().add(this);
    }

    public void removeConsumer(System system) {
        getConsumers().remove(system);
        system.getConsumerDistributionChannels().remove(this);
        log.info("Removed consumer={} from distributionChannel={}", system.getName(), getName());
    }

    public void addProducer(System system) {
        getProducers().add(system);
        system.getProducerDistributionChannels().add(this);
    }

    public void removeProducer(System system) {
        getProducers().remove(system);
        system.getProducerDistributionChannels().remove(this);
        log.info("Removed producer={} from distributionChannel={}", system.getName(), getName());
    }

    public static List<String> names(Collection<DistributionChannel> distributionChannels) {
        return StreamUtils.safeStream(distributionChannels).map(DistributionChannel::getName).collect(Collectors.toList());
    }

}
