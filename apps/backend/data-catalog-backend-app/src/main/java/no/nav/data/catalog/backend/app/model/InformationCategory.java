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
@Table(name = "INFORMATION_CATEGORY")
@Data
public class InformationCategory {

	@Id
	@Column(name = "information_category_id")
	private Long informationCategoryId;

	@Enumerated(EnumType.STRING)
	@Column(name = "information_category_code")
	private InformationCategoryCode informationCategoryCode;

	@Column(name = "information_category_decode")
	private String informationCategoryDecode;

	@OneToMany(mappedBy = "InformationCategory")
	private Set<Informationtype> informationtypes = new HashSet<>();
}
