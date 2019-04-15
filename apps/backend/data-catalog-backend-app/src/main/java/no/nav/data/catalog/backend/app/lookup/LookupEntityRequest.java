package no.nav.data.catalog.backend.app.lookup;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LookupEntityRequest {

	private String entity;
	private String code;
	private String description;

	@JsonCreator
	public LookupEntityRequest(
			@JsonProperty(value = "entity", required = true) String entity,
			@JsonProperty(value = "code", required = true) String code,
			@JsonProperty(value = "description") String description) {
		this.entity = entity;
		this.code = code;
		this.description = description;
	}
}
