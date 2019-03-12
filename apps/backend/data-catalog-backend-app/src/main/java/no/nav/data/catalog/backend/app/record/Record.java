package no.nav.data.catalog.backend.app.record;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
@Builder
public class Record {

	@NotNull
	private String id;
	@NotNull
	private String name;
	@NotNull
	private String description;
	private Category category;
	private String sensitivity;
	private String ownership;
	private String sourceOfRecord;
	private StorageTime storageTime;
	private String qualityOfData;
	@NotNull
	private Boolean personalData;
	@NotNull
	private LocalDate recordCreationDate;
	private LocalDate recordLastUpdatedDate;

	@JsonCreator
	public Record(
			@JsonProperty("id") String id,
			@JsonProperty("name") String name,
			@JsonProperty("description") String description,
			@JsonProperty("category") Category category,
			@JsonProperty("sensitivity") String sensitivity,
			@JsonProperty("ownership") String ownership,
			@JsonProperty("sourceOfRecord") String sourceOfRecord,
			@JsonProperty("storageTime") StorageTime storageTime,
			@JsonProperty("qualityOfData") String qualityOfData,
			@JsonProperty("personalData") Boolean personalData,
			@JsonProperty("recordCreationDate") LocalDate recordCreationDate,
			@JsonProperty("recordLastUpdatedDate") LocalDate recordLastUpdatedDate) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.category = category;
		this.sensitivity = sensitivity;
		this.ownership = ownership;
		this.sourceOfRecord = sourceOfRecord;
		this.storageTime = storageTime;
		this.qualityOfData = qualityOfData;
		this.personalData = personalData;
		this.recordCreationDate = recordCreationDate;
		this.recordLastUpdatedDate = recordLastUpdatedDate;
	}
}