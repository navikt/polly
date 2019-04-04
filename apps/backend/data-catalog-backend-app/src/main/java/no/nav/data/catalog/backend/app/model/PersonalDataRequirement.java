package no.nav.data.catalog.backend.app.model;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "PERSONAL_DATA_REQUIREMENT")
@Data
public class PersonalDataRequirement {

	@Id
	@Column(name = "personal_data_requirement_id")
	private Long personalDataRequirementId;

	//TODO: Relation to Purpose
	@Column(name = "purpose_id")
	private Long purposeId;

	//TODO: Relation to Policy
	@Column(name = "policy_id")
	private Long policyId;

	@ManyToOne
	@JoinColumn(name = "informationtype_id", nullable = false)
	private Informationtype informationtype;
}
