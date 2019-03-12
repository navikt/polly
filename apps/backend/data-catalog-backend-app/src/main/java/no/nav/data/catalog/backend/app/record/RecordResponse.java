package no.nav.data.catalog.backend.app.record;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RecordResponse {

	private String id;
	private String status;

	@JsonCreator
	public RecordResponse(
			@JsonProperty(value = "id", required = true) String id,
			@JsonProperty(value = "status") String status) {
		this.id = id;
		this.status = status;
	}
}
