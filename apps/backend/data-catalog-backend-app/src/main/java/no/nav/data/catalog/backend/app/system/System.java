package no.nav.data.catalog.backend.app.system;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import no.nav.data.catalog.backend.app.common.auditing.Auditable;
import no.nav.data.catalog.backend.app.common.utils.StreamUtils;
import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannel;
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
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

@Data
@EqualsAndHashCode(exclude = {"producerDistributionChannels", "consumerDistributionChannels"}, callSuper = false)
@ToString(exclude = {"producerDistributionChannels", "consumerDistributionChannels"})
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "SYSTEM")
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

	public System convertFromRequest(SystemRequest request, boolean isUpdate) {
		if (!isUpdate) {
			this.id = UUID.randomUUID();
			this.producerDistributionChannels = new HashSet<>();
			this.consumerDistributionChannels = new HashSet<>();
		}
		this.name = StringUtils.trim(request.getName());
		return this;
	}

	public SystemResponse convertToResponse() {
		return new SystemResponse(this);
	}

	public static List<String> names(Collection<System> systems) {
		return StreamUtils.safeStream(systems).map(System::getName).collect(Collectors.toList());
	}
}
