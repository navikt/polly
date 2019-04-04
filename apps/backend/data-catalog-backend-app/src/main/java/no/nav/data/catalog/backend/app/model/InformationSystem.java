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
@Table(name = "INFORMATION_SYSTEM")
@Data
public class InformationSystem {

	@Id
	@Column(name = "information_system_id")
	private Long informationSystemId;

	@Enumerated(EnumType.STRING)
	@Column(name = "information_system_code")
	private InformationSystemCode informationSystemCode;

	@Column(name = "information_system_decode")
	private String informationSystemDecode;

	@OneToMany(mappedBy = "InformationSystem")
	private Set<Informationtype> informationtypes = new HashSet<>();
}
