package no.nav.data.catalog.backend.app.record;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class Record {

	private String id;
	private String name;
	private String description;
	private Category category;
	private String sensitivity;
	private String ownership;
	private String sourceOfRecord;
	private StorageTime storageTime;
	private String qualityOfData;
	private Boolean personalData;
	@JsonDeserialize(using = LocalDateDeserializer.class)
	@JsonSerialize(using = LocalDateSerializer.class)
	private LocalDate recordCreationDate;
	@JsonDeserialize(using = LocalDateDeserializer.class)
	@JsonSerialize(using = LocalDateSerializer.class)
	private LocalDate recordLastUpdatedDate;

	@JsonCreator
	public Record(
			@JsonProperty(value = "id") String id,
			@JsonProperty(value = "name", required = true) String name,
			@JsonProperty(value = "description", required = true) String description,
			@JsonProperty(value = "category") Category category,
			@JsonProperty(value = "sensitivity") String sensitivity,
			@JsonProperty(value = "ownership") String ownership,
			@JsonProperty(value = "sourceOfRecord") String sourceOfRecord,
			@JsonProperty(value = "storageTime") StorageTime storageTime,
			@JsonProperty(value = "qualityOfData") String qualityOfData,
			@JsonProperty(value = "personalData", required = true) Boolean personalData,
			@JsonProperty(value = "recordCreationDate") LocalDate recordCreationDate,
			@JsonProperty(value = "recordLastUpdatedDate") LocalDate recordLastUpdatedDate) {
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