package no.nav.data.catalog.backend.app.informationtype;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.catalog.backend.app.common.auditing.Auditable;
import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import static org.elasticsearch.common.UUIDs.base64UUID;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "INFORMATION_TYPE", schema = "BACKEND_SCHEMA")
@JsonIgnoreProperties(ignoreUnknown = true)
public class InformationType extends Auditable<String> {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_informationType")
	@GenericGenerator(name = "seq_informationType", strategy = "org.hibernate.id.enhanced.SequenceStyleGenerator",
			parameters = {@Parameter(name = "sequence_name", value = "SEQ_INFORMATION_TYPE")})
	@NotNull
	@Column(name = "INFORMATION_TYPE_ID", nullable = false, updatable = false, unique = true)
	private Long id;

	@NotNull
	@Column(name = "NAME", nullable = false, unique = true)
	private String name;

	@NotNull
	@Column(name = "DESCRIPTION", nullable = false)
	private String description;

	@NotNull
	@Column(name = "CATEGORY_CODE", nullable = false)
	private String categoryCode;

	@NotNull
	@Column(name = "PRODUCER_CODE")
	private String producerCode;

	@NotNull
	@Column(name = "SYSTEM_CODE")
	private String systemCode;

	@NotNull
	@Column(name = "PERSONAL_DATA", nullable = false)
	private boolean personalData;

	@JsonIgnore
	@Column(name = "ELASTICSEARCH_ID")
	private String elasticsearchId;

	@JsonIgnore
	@Column(name = "ELASTICSEARCH_STATUS", nullable = false)
	@Enumerated(EnumType.STRING)
	@NotNull
	private ElasticsearchStatus elasticsearchStatus;

	public InformationType convertFromRequest(InformationTypeRequest request, Boolean isUpdate) {
		if (isUpdate) {
			this.elasticsearchStatus = ElasticsearchStatus.TO_BE_UPDATED;
		} else {
			this.elasticsearchStatus = ElasticsearchStatus.TO_BE_CREATED;
			this.elasticsearchId = base64UUID();
		}
		this.name = request.getName();
		this.categoryCode = request.getCategoryCode();
		this.systemCode = request.getSystemCode();
		this.producerCode = String.join(", ", request.getProducerCode());
		this.description = request.getDescription();
		this.personalData = request.getPersonalData();
		return this;
	}

	public InformationTypeResponse convertToResponse() {
		return new InformationTypeResponse(this);
	}
}

