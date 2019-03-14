package no.nav.data.catalog.backend.app.record;

import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
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
}
