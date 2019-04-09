package no.nav.data.catalog.backend.app.model;

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
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.time.LocalDate;


@Entity
@Table(name = "INFORMATION_TYPE")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InformationType {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_informationType")
	@GenericGenerator(name = "seq_informationType", strategy = "org.hibernate.id.enhanced.SequenceStyleGenerator",
			parameters = {@Parameter(name = "sequence_name", value = "SEQ_INFORMATION_TYPE")})
	@Column(name = "information_type_id", nullable = false, updatable = false, unique = true)
	private Long informationTypeId;

	@Column(name = "information_type_name", nullable = false)
	private String informationTypeName;

	@ManyToOne
	@JoinColumn(name = "information_category_id")
	private InformationCategory informationCategory;

	@ManyToOne
	@JoinColumn(name = "information_producer_id", nullable = false)
	private InformationProducer informationProducer;

	@ManyToOne
	@JoinColumn(name = "information_system_id")
	private InformationSystem informationSystem;

	@Column(name = "description")
	private String description;

	@Column(name = "date_created")
	private LocalDate dateCreated;

	@Column(name = "created_by", nullable = false)
	private String createdBy;

	@Column(name = "date_last_updated")
	private LocalDate dateLastUpdated;

	@Column(name = "updated_by")
	private String updatedBy;

	@Column(name = "synched_to_elasticsearch", nullable = false)
	private boolean synchedToElasticsearch = false;

//	@Lob
//	@Column(name = "information_json_object")
//	private HashMap<String, String> informationJsonObject;
}

