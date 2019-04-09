package no.nav.data.catalog.backend.app.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "INFORMATION_SYSTEM")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InformationSystem {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_informationSystem")
	@GenericGenerator(name = "seq_informationSystem", strategy = "org.hibernate.id.enhanced.SequenceStyleGenerator",
			parameters = {@Parameter(name = "sequence_name", value = "SEQ_INFORMATION_SYSTEM")})
	@Column(name = "information_system_id", nullable = false, updatable = false, unique = true)
	private Long informationSystemId;

	@Enumerated(EnumType.STRING)
	@Column(name = "code")
	private InformationSystemCode code;

	@Column(name = "decode")
	private String decode;
}
