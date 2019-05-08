package no.nav.data.catalog.backend.app.informationtype;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
import java.util.HashMap;
import java.util.Map;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "INFORMATION_TYPE")
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
	@Column(name = "CATEGORY", nullable = false)
	private String category;

	@NotNull
	@Column(name = "PRODUCER")
	private String producer;

	@NotNull
	@Column(name = "SYSTEM")
	private String system;

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

	public Map<String, Object> convertToMap() {
		Map<String, Object> jsonMap = new HashMap<>();
		jsonMap.put("id", elasticsearchId);
		jsonMap.put("informationTypeId", id);
		jsonMap.put("name", name);
		jsonMap.put("description", description);
		jsonMap.put("informationCategory", category);
		jsonMap.put("informationProducer", producer);
		jsonMap.put("informationSystem", system);
		jsonMap.put("personalData", personalData);

		return jsonMap;
	}


	public InformationType convertFromRequest(InformationTypeRequest request) {
		this.name = request.getName();
		this.category = request.getCategory();
		this.producer = request.getProducer();
		this.system = request.getSystem();
		this.description = request.getDescription();
		this.personalData = request.getPersonalData();
		// TODO er dette alltid riktig:
		this.elasticsearchStatus = ElasticsearchStatus.TO_BE_CREATED;

		return this;
	}
}

