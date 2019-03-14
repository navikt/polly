package no.nav.data.catalog.backend.app.record;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/records")
public class RecordController {

	private RecordService recordService;

	public RecordController(RecordService recordService) {
		this.recordService = recordService;
	}

	@PostMapping
	public RecordResponse insertRecord(@RequestBody String jsonString) {
		return recordService.insertRecord(jsonString);
	}

	@GetMapping("/{id}")
	public Record getRecordById(@PathVariable String id) {
		return recordService.getRecordById(id);
	}

	@PutMapping("/{id}")
	public RecordResponse updateFieldsById(@PathVariable String id, @RequestBody String jsonString) {
		return recordService.updateFieldsById(id, jsonString);
	}

	@DeleteMapping("/{id}")
	public RecordResponse deleteRecordById(@PathVariable String id) {
		return recordService.deleteRecordById(id);
	}

	@GetMapping("/allRecords")
	public List<Record> getAllRecords() {
		return recordService.getAllRecords();
	}
}
