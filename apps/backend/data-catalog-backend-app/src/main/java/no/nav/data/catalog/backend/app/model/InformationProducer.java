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
@Table(name = "INFORMATION_PRODUCER")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InformationProducer {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_informationProducer")
	@GenericGenerator(name = "seq_informationProducer", strategy = "org.hibernate.id.enhanced.SequenceStyleGenerator",
			parameters = {@Parameter(name = "sequence_name", value = "SEQ_INFORMATION_PRODUCER")})
	@Column(name = "information_producer_id", nullable = false, updatable = false, unique = true)
	private Long informationProducerId;

	@Enumerated(EnumType.STRING)
	@Column(name = "code")
	private InformationProducerCode code;

	@Column(name = "decode")
	private String decode;
}
