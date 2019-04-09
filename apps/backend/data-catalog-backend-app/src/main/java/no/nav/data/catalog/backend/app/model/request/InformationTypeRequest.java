package no.nav.data.catalog.backend.app.model.request;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InformationTypeRequest {

	private String informationTypeName;
	private Long informationCategoryId;
	private Long informationProducerId;
	private Long informationSystemId;
	private String description;
	private String createdBy;

	@JsonCreator
	public InformationTypeRequest(
			@JsonProperty(value = "informationTypeName", required = true) String informationTypeName,
			@JsonProperty(value = "informationCategoryId", required = true) Long informationCategoryId,
			@JsonProperty(value = "informationProducerId", required = true) Long informationProducerId,
			@JsonProperty(value = "informationSystemId", required = true) Long informationSystemId,
			@JsonProperty(value = "description", required = true) String description,
			@JsonProperty(value = "createdBy") String createdBy) {
		this.informationTypeName = informationTypeName;
		this.informationCategoryId = informationCategoryId;
		this.informationProducerId = informationProducerId;
		this.informationSystemId = informationSystemId;
		this.description = description;
		this.createdBy = createdBy;
	}

}
