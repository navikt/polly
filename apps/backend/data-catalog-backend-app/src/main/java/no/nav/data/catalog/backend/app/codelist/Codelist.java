package no.nav.data.catalog.backend.app.codelist;

import static no.nav.data.catalog.backend.app.common.utils.Constants.SERIAL_VERSION_UID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;
import java.io.Serializable;

@Entity
@Table(name = "CODELIST")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@IdClass(Codelist.IdClass.class)
public class Codelist implements Serializable {

	private static final long serialVersionUID = SERIAL_VERSION_UID;

	@Id
	@Column(name = "entity")
	private String entity;

	@Id
	@Column(name = "code")
	private String code;

	@Column(name = "description")
	private String description;

	@Data
	static class IdClass implements Serializable {
		private String entity;
		private String code;
	}

}
