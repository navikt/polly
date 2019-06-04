package no.nav.data.catalog.backend.app.informationtype;

import static no.nav.data.catalog.backend.app.codelist.CodelistService.codelists;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.catalog.backend.app.codelist.ListName;

import java.util.HashMap;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class InformationTypeResponse {

	private String elasticsearchId;
	private Long informationTypeId;
	private String name;
	private String description;
	private Map category;
	private Map producer;
	private Map system;
	private Boolean personalData;


	public InformationTypeResponse(InformationType informationType) {
		this.elasticsearchId = informationType.getElasticsearchId();
		this.informationTypeId = informationType.getId();
		this.name = informationType.getName();
		this.description = informationType.getDescription();
		this.category = getMapForCodelistItem(ListName.CATEGORY, informationType.getCategoryCode());
		this.producer = getMapForCodelistItem(ListName.PRODUCER, informationType.getProducerCode());
		this.system = getMapForCodelistItem(ListName.SYSTEM, informationType.getSystemCode());
		this.personalData = informationType.isPersonalData();
	}

	private Map<String, String> getMapForCodelistItem(ListName listName, String code) {
		return Map.of("code", code,
				"description", codelists.get(listName).get(code));
	}

	public Map<String, Object> convertToMap() {
		Map<String, Object> jsonMap = new HashMap<>();
		jsonMap.put("id", elasticsearchId);
		jsonMap.put("informationTypeId", informationTypeId);
		jsonMap.put("name", name);
		jsonMap.put("description", description);
		jsonMap.put("category", category);
		jsonMap.put("producer", producer);
		jsonMap.put("system", system);
		jsonMap.put("personalData", personalData);

		return jsonMap;
	}
}
