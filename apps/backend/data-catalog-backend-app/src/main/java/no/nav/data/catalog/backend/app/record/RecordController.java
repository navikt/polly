package no.nav.data.catalog.backend.app.record;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
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
@Api(value = "InformationTypes", description = "REST API for InformationTypes", tags = { "InformationType" })
public class RecordController {

	@Autowired
	private RecordService recordService;

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@ApiOperation(value = "Create InformationType", tags = { "InformationType" })
	@ApiResponses(value = {
			@ApiResponse(code = 201, message = "InformationType successfully created", response = RecordResponse.class),
			@ApiResponse(code = 400, message = "Illegal arguments"),
			@ApiResponse(code = 500, message = "Internal server error")})
	public RecordResponse insertRecord(@RequestBody String jsonString) {
		return recordService.insertRecord(jsonString);
	}

	@ApiOperation(value = "Get InformationType", tags = { "InformationType" })
	@ApiResponses(value = {
			@ApiResponse(code = 200, message = "InformationType fetched", response = Record.class),
			@ApiResponse(code = 404, message = "InformationType not found"),
			@ApiResponse(code = 500, message = "Internal server error")})
	@GetMapping("/{id}")
	public Record getRecordById(@PathVariable String id) {
		return recordService.getRecordById(id);
	}

	@ApiOperation(value = "Update InformationType", tags = { "InformationType" })
	@ApiResponses(value = {
			@ApiResponse(code = 200, message = "InformationType updated"),
			@ApiResponse(code = 404, message = "InformationType not found"),
			@ApiResponse(code = 500, message = "Internal server error")})
	@PutMapping("/{id}")
	public RecordResponse updateFieldsById(@PathVariable String id, @RequestBody String jsonString) {
		return recordService.updateFieldsById(id, jsonString);
	}

	@ApiOperation(value = "Dekete InformationType", tags = { "InformationType" })
	@ApiResponses(value = {
			@ApiResponse(code = 200, message = "InformationType deleted"),
			@ApiResponse(code = 404, message = "InformationType not found"),
			@ApiResponse(code = 500, message = "Internal server error")})
	@DeleteMapping("/{id}")
	public RecordResponse deleteRecordById(@PathVariable String id) {
		return recordService.deleteRecordById(id);
	}

	@ApiOperation(value = "Get all InformationTypes", tags = { "InformationType" })
	@ApiResponses(value = {
			@ApiResponse(code = 200, message = "All policies fetched", response = Record.class, responseContainer = "List"),
			@ApiResponse(code = 500, message = "Internal server error")})
	@GetMapping("/allRecords")
	public List<Record> getAllRecords() {
		return recordService.getAllRecords();
	}
}
