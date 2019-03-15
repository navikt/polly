package no.nav.data.catalog.backend.app.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import no.nav.data.catalog.backend.app.record.Category;
import no.nav.data.catalog.backend.app.record.StorageTime;

import java.time.LocalDate;

@Data
@Builder
public class GithubInformationType {

	private String name;
	private String description;
	private Category category;
	private String sensitivity;
	private String ownership;
	private String sourceOfRecord;
	private StorageTime storageTime;
	private String qualityOfData;
	private Boolean personalData;

	@JsonCreator
	public GithubInformationType(
			@JsonProperty(value = "name", required = true) String name,
			@JsonProperty(value = "description", required = true) String description,
			@JsonProperty(value = "category") Category category,
			@JsonProperty(value = "sensitivity") String sensitivity,
			@JsonProperty(value = "ownership") String ownership,
			@JsonProperty(value = "sourceOfRecord") String sourceOfRecord,
			@JsonProperty(value = "storageTime") StorageTime storageTime,
			@JsonProperty(value = "qualityOfData") String qualityOfData,
			@JsonProperty(value = "personalData", required = true) Boolean personalData) {
		this.name = name;
		this.description = description;
		this.category = category;
		this.sensitivity = sensitivity;
		this.ownership = ownership;
		this.sourceOfRecord = sourceOfRecord;
		this.storageTime = storageTime;
		this.qualityOfData = qualityOfData;
		this.personalData = personalData;
	}
}