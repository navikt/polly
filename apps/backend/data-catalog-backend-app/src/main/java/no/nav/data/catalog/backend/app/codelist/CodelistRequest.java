package no.nav.data.catalog.backend.app.codelist;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CodelistRequest {

	private String entity;
	private String code;
	private String description;

	@JsonCreator
	public CodelistRequest(
			@JsonProperty(value = "entity", required = true) String entity,
			@JsonProperty(value = "code", required = true) String code,
			@JsonProperty(value = "description") String description) {
		this.entity = entity;
		this.code = code;
		this.description = description;
	}
}
