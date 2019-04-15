package no.nav.data.catalog.backend.app.model;

import static no.nav.data.catalog.backend.app.common.utils.Constants.SERIAL_VERSION_UID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;


@Entity
@Table(name = "INFORMATION_TYPE")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InformationType implements Serializable {

	private static final long serialVersionUID = SERIAL_VERSION_UID;

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_informationType")
	@GenericGenerator(name = "seq_informationType", strategy = "org.hibernate.id.enhanced.SequenceStyleGenerator",
			parameters = {@Parameter(name = "sequence_name", value = "SEQ_INFORMATION_TYPE")})
	@Column(name = "information_type_id", nullable = false, updatable = false, unique = true)
	private Long informationTypeId;

	@Column(name = "information_type_name", nullable = false, unique = true)
	private String informationTypeName;

	@Column(name = "description", nullable = false)
	private String description;

	@Column(name = "information_category")
	private String informationCategory;

	@Column(name = "information_producer")
	private String informationProducer;

	@Column(name = "information_system")
	private String informationSystem;

	@Column(name = "date_created")
	private String dateCreated;

	@Column(name = "created_by", nullable = false)
	private String createdBy;

	@Column(name = "date_last_updated")
	private String dateLastUpdated;

	@Column(name = "updated_by")
	private String updatedBy;

	@Column(name = "personal_data", nullable = false)
	private boolean personalData;

	@Column(name = "json_string")
	private String jsonString;

	@Column(name = "elasticsearch_id", nullable = false)
	private String elasticsearchId;

	@Column(name = "elasticsearch_status", nullable = false)
	private String elasticsearchStatus;
}

