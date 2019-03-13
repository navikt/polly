package no.nav.data.catalog.backend.app.record;

import static org.elasticsearch.common.UUIDs.base64UUID;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import no.nav.data.catalog.backend.app.common.elasticsearch.ElasticsearchService;
import org.elasticsearch.action.search.SearchResponse;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Map;

@Repository
public class RecordService {

	private ElasticsearchService elasticsearchService;
	private ObjectMapper objectMapper;

	public RecordService(ElasticsearchService elasticsearchService, ObjectMapper objectMapper) {
		this.elasticsearchService = elasticsearchService;
		this.objectMapper = objectMapper.registerModule(new JavaTimeModule());
	}

	// -------- CRUD operations on records -----------------
	public RecordResponse insertRecord(String jsonString) {
		String id = base64UUID();
		try {
			Map<String, Object> jsonMap = getMapFromString(jsonString);
			jsonMap.put("id", id);
			jsonMap.put("recordCreationDate", LocalDate.now());
			objectMapper.convertValue(jsonMap, Record.class);  //Validation in constructor for class Record
			elasticsearchService.insertRecord(jsonMap);
		} catch (JsonMappingException jme) {
			jme.getMessage();
		} catch (IOException ioe) {
			ioe.getLocalizedMessage();
		}
		return RecordResponse.builder()
				.id(id)
				.status(String.format("Created a new record with id=%s", id))
				.build();
	}

	public Record getRecordById(String id) {
		Map<String, Object> dataMap = elasticsearchService.getRecordById(id);
		return objectMapper.convertValue(dataMap, Record.class);
	}

	public RecordResponse updateFieldsById(String id, String jsonString) {
		try {
			Map<String, Object> jsonMap = getMapFromString(jsonString);
			jsonMap.put("recordLastUpdatedDate", LocalDate.now().toString());
			elasticsearchService.updateFieldsById(id, jsonMap);
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
		elasticsearchService.deleteRecordById(id);
		return RecordResponse.builder()
				.id(id)
				.status(String.format("Deleted record with id=%s", id))
				.build();
	}

	private Map<String, Object> getMapFromString(String jsonString) throws IOException {
		return objectMapper.readValue(jsonString, new TypeReference<Map<String, Object>>() {
		});
	}

	// ------- Search -----------
	public SearchResponse searchByField(String fieldName, String fieldValue) {
		return elasticsearchService.searchByField(fieldName, fieldValue);
	}

	public SearchResponse getAllRecords() {
		return elasticsearchService.getAllRecords();
	}
}
