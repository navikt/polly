package no.nav.data.catalog.backend.app.record;

import static org.elasticsearch.common.UUIDs.base64UUID;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchRepository;
import no.nav.data.catalog.backend.app.common.exceptions.DataCatalogBackendTechnicalException;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class RecordService {

	@Autowired
	private ElasticsearchRepository elasticsearchRepository;

	@Autowired
	private ObjectMapper objectMapper;

	public RecordResponse insertRecord(String jsonString) {
		String id = base64UUID();
		try {
			Map<String, Object> jsonMap = getMapFromString(jsonString);
			jsonMap.put("id", id);
			jsonMap.put("recordCreationDate", LocalDate.now());
			objectMapper.convertValue(jsonMap, Record.class);  //Validation in constructor for class Record
			elasticsearchRepository.insertInformationType(jsonMap);
		} catch (JsonMappingException jme) {
			throw new DataCatalogBackendTechnicalException(jme.getMessage(), jme);
		} catch (IOException ioe) {
			throw new DataCatalogBackendTechnicalException(ioe.getLocalizedMessage(), ioe);
		}
		return RecordResponse.builder()
				.id(id)
				.status(String.format("Created a new record with id=%s", id))
				.build();
	}

	public Record getRecordById(String id) {
		Map<String, Object> dataMap = elasticsearchRepository.getInformationTypeById(id);
		return objectMapper.convertValue(dataMap, Record.class);
	}

	public RecordResponse updateFieldsById(String id, String jsonString) {
		try {
			Map<String, Object> jsonMap = getMapFromString(jsonString);
			jsonMap.put("recordLastUpdatedDate", LocalDate.now().toString());
			elasticsearchRepository.updateInformationTypeById(id, jsonMap);
		} catch (JsonGenerationException | JsonMappingException je) {
			je.getMessage();
		} catch (IOException ioe) {
			ioe.getLocalizedMessage();
		}
		return RecordResponse.builder()
				.id(id)
				.status(String.format("Updated record with id=%s", id))
				.build();
	}

	public RecordResponse deleteRecordById(String id) {
		elasticsearchRepository.deleteInformationTypeById(id);
		return RecordResponse.builder()
				.id(id)
				.status(String.format("Deleted record with id=%s", id))
				.build();
	}

	public List<Record> getAllRecords() {
		SearchResponse searchResponse = elasticsearchRepository.getAllRecords();
		SearchHits hits = searchResponse.getHits();
		SearchHit[] searchHits = hits.getHits();

		List<Record> listOfRecords = new ArrayList<>();

		for (SearchHit hit : searchHits) {
			Map<String, Object> sourceAsMap = hit.getSourceAsMap();
			listOfRecords.add(objectMapper.convertValue(sourceAsMap, Record.class));
		}
		return listOfRecords;
	}

	private Map<String, Object> getMapFromString(String jsonString) throws IOException {
		return objectMapper.readValue(jsonString, new TypeReference<Map<String, Object>>() {
		});
	}

	public SearchResponse searchByField(String fieldName, String fieldValue) {
		return elasticsearchRepository.searchByField(fieldName, fieldValue);
	}

}
