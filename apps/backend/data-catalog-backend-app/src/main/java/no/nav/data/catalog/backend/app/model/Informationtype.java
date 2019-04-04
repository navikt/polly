package no.nav.data.catalog.backend.app.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;
import org.springframework.beans.factory.annotation.Value;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.io.Serializable;
import java.sql.Blob;
import java.sql.Clob;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;


//@DynamicUpdate

@Entity
@Table(name = "INFORMATIONTYPE")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Informationtype implements Serializable {

	@Value(value = "${spring.jpa.properties.serial.version.uid}")
	private static Long serialVersionUID;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "informationtype_id")
	private Long informationtypeId;

	@Column(name = "informationtype_name", nullable = false)
	private String informationtypeName;

	@OneToMany(mappedBy = "Informationtype")
	private Set<PersonalDataRequirement> personalDataRequirements = new HashSet<>();

	@ManyToOne
	@JoinColumn(name = "producer_id", nullable = false)
	private InformationProducer informationProducer;

	@ManyToOne
	@JoinColumn(name = "information_category_id")
	private InformationCategory informationCategory;

	@ManyToOne
	@JoinColumn(name = "information_system_id")
	private InformationSystem informationSystem;

	@Column(name = "description", nullable = false)
	private String description;

	@Column(name = "date_created", nullable = false)
	private LocalDate dateCreated;

	@Column(name = "created_by", nullable = false)
	private String createdBy;

	@Column(name = "date_last_updated")
	private LocalDate dateLastUpdated;

	@Column(name = "updated_by")
	private String updatedBy;

	@Column(name = "synched_to_elasticsearch", nullable = false)
	private boolean synchedToElasticsearch;

	@Column(name = "information_json_object")
	private String informationJsonObject;
}

