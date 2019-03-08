package no.nav.data.catalog.backend.app.record;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/records")
public class RecordController {

	private RecordService recordService;

	public RecordController(RecordService recordService) {
		this.recordService = recordService;
	}

	@PostMapping
	public Record insertRecord(@RequestBody Record record) {
		return recordService.insertRecord(record);
	}

	@GetMapping("/{id}")
	public Record getRecordById(@PathVariable String id) {
		return recordService.getRecordById(id);
	}

	@PutMapping("/{id}")
	public void updateFieldsById(@PathVariable String id, @RequestBody String jsonString) {
		recordService.updateFieldsById(id, jsonString);
	}

	@DeleteMapping("/{id}")
	public void deleteRecordById(@PathVariable String id) {
		recordService.deleteRecordById(id);
	}
}
