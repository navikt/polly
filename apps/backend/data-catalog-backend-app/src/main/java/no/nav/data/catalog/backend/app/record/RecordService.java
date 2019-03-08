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
	public Record insertRecord(Record record) {
		record.setId(base64UUID());
		record.setRecordCreationDate(LocalDate.now());

		elasticsearchService.insertRecord(record);
		return record;
	}

	public Record getRecordById(String id) {
		Map<String, Object> dataMap = elasticsearchService.getRecordById(id);
		return objectMapper.convertValue(dataMap, Record.class);
	}

	public void updateFieldsById(String id, String jsonString) {
		try {
			Map<String, Object> jsonMap = objectMapper.readValue(jsonString, new TypeReference<Map<String, String>>() {
			});
			jsonMap.put("recordLastUpdatedDate", LocalDate.now().toString());

			elasticsearchService.updateFieldsById(id, jsonMap);
		} catch (JsonGenerationException | JsonMappingException je) {
			je.getMessage();
		} catch (IOException ioe) {
			ioe.getLocalizedMessage();
		}
	}

	public void deleteRecordById(String id) {
		elasticsearchService.deleteRecordById(id);
	}

	// ------- Search -----------
	public SearchResponse searchByField(String fieldName, String fieldValue) {
		return elasticsearchService.searchByField(fieldName, fieldValue);
	}
}
