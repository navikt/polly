package no.nav.data.catalog.backend.app.record;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StorageTime {
	private int legalStorageTime;
	private int actualStorageTime;

	public StorageTime(
			@JsonProperty("legalStorageTime") int legalStorageTime,
			@JsonProperty("actualStorageTime") int actualStorageTime) {
		this.legalStorageTime = legalStorageTime;
		this.actualStorageTime = actualStorageTime;
	}
}
