package no.nav.data.catalog.backend.app.record;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/backend/records")
public class RecordController {

	@Autowired
	private RecordService recordService;

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
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
