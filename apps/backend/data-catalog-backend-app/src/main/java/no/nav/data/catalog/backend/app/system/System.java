package no.nav.data.catalog.backend.app.system;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import no.nav.data.catalog.backend.app.common.auditing.Auditable;
import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannel;
import org.hibernate.annotations.Type;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import java.util.Set;
import java.util.UUID;

@Data
@EqualsAndHashCode(exclude = {"producerDistributionChannels", "consumerDistributionChannels"}, callSuper = false)
@ToString(exclude = {"producerDistributionChannels", "consumerDistributionChannels"})
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "SYSTEM", schema = "BACKGROUND_SCHEMA")
public class System extends Auditable<String> {

	@Id
	@Column(name = "SYSTEM_ID")
	@Type(type = "pg-uuid")
	private UUID id;

	@NotNull
	@Column(name = "NAME", nullable = false)
	private String name;

	@NotNull
	@ManyToMany(mappedBy = "producers")
	private Set<DistributionChannel> producerDistributionChannels;

	@NotNull
	@ManyToMany(mappedBy = "consumers")
	private Set<DistributionChannel> consumerDistributionChannels;

	public System convertFromRequest(SystemRequest request, Boolean isUpdate) {
		if (!isUpdate) {
			this.id = UUID.randomUUID();
		}
		this.name = request.getName().trim();
		this.producerDistributionChannels = request.getProducerDistributionChannels();
		this.consumerDistributionChannels = request.getConsumerDistributionChannels();
		return this;
	}

	public SystemResponse convertToResponse() {
		return new SystemResponse(this);
	}
}
