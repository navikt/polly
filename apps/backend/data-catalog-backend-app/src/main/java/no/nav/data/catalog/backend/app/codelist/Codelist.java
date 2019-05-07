package no.nav.data.catalog.backend.app.codelist;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.catalog.backend.app.common.auditing.Auditable;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "CODELIST", schema = "BACKEND_SCHEMA")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@IdClass(Codelist.IdClass.class)
public class Codelist extends Auditable<String> {

	@Id
	@Column(name = "LIST_NAME")
	@Enumerated(EnumType.STRING)
	private ListName list;

	@Id
	@Column(name = "CODE")
	private String code;

	@Column(name = "DESCRIPTION")
	private String description;

	@Data
	static class IdClass implements Serializable {
		private ListName list;
		private String code;
	}

}
