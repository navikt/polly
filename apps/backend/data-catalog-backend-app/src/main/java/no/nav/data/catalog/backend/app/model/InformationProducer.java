package no.nav.data.catalog.backend.app.model;


import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "INFORMATION_PRODUCER")
@Data
public class  InformationProducer {

	@Id
	@Column(name = "information_producer_id")
	private Long informationProducerId;

	@Enumerated(EnumType.STRING)
	@Column(name = "information_producer_code")
	private InformationProducerCode informationProducerCode;

	@Column(name = "information_producer_decode")
	private String informationProducerDecode;

	@OneToMany(mappedBy = "InformationProducer")
	private Set<Informationtype> informationtypes = new HashSet<>();
}
