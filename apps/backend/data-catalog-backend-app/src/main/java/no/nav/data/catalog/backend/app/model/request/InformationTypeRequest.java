package no.nav.data.catalog.backend.app.model.request;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InformationTypeRequest {

	private String informationTypeName;
	private String informationCategory;
	private String informationProducer;
	private String informationSystem;
	private String description;
	private Boolean personalData;
	private String createdBy;    //TODO: Retrieve from token, authorized user

	@JsonCreator
	public InformationTypeRequest(
			@JsonProperty(value = "informationTypeName", required = true) String informationTypeName,
			@JsonProperty(value = "informationCategory", required = true) String informationCategory,
			@JsonProperty(value = "informationProducer", required = true) String informationProducer,
			@JsonProperty(value = "informationSystem", required = true) String informationSystem,
			@JsonProperty(value = "description", required = true) String description,
			@JsonProperty(value = "personalData", required = true) Boolean personalData,
			@JsonProperty(value = "createdBy") String createdBy) {
		this.informationTypeName = informationTypeName;
		this.informationCategory = informationCategory;
		this.informationProducer = informationProducer;
		this.informationSystem = informationSystem;
		this.description = description;
		this.personalData = personalData;
		this.createdBy = createdBy;
	}

}
