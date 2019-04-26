package no.nav.data.catalog.backend.app.informationtype;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import no.nav.data.catalog.backend.app.common.exceptions.ValidationException;
import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchRepository;
import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.transaction.Transactional;
import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/backend/informationtype")
@Api(value = "InformationTypes", description = "REST API for InformationTypes", tags = { "InformationType" })
public class InformationTypeController {

	@Autowired
	private ElasticsearchRepository elasticsearch;

	@Autowired
	private InformationTypeRepository repository;

	@Autowired
	private InformationTypeService service;

	@ApiOperation(value = "Get InformationType", tags = { "InformationType" })
	@ApiResponses(value = {
			@ApiResponse(code = 200, message = "InformationType fetched", response = InformationType.class),
			@ApiResponse(code = 404, message = "InformationType not found"),
			@ApiResponse(code = 500, message = "Internal server error")})
	@GetMapping("/{id}")
	public ResponseEntity<InformationType> getInformationTypeById(@PathVariable Long id) {
		Optional<InformationType> informationType = repository.findById(id);
		if(informationType.isEmpty()) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}

		return new ResponseEntity<>(informationType.get(), HttpStatus.OK);
	}

	@ApiOperation(value = "Get all InformationTypes", tags = { "InformationType" })
	@ApiResponses(value = {
			@ApiResponse(code = 200, message = "All informationTypes fetched", response = InformationType.class, responseContainer = "List"),
			@ApiResponse(code = 500, message = "Internal server error")})
	@GetMapping
	public ResponseEntity<List<InformationType>> getAllInformationTypes() {
		List<InformationType> informationTypes = repository.findAllByOrderByIdAsc();
		if(informationTypes.isEmpty()) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}

		return new ResponseEntity<>(informationTypes, HttpStatus.OK);
	}

	@ApiOperation(value = "Create InformationType", tags = { "InformationType" })
	@ApiResponses(value = {
			@ApiResponse(code = 201, message = "InformationType successfully created", response = InformationType.class),
			@ApiResponse(code = 400, message = "Illegal arguments"),
			@ApiResponse(code = 500, message = "Internal server error")})
	@PostMapping
	public ResponseEntity<?> createInformationType(@RequestBody InformationTypeRequest request) {
		try { service.validateRequest(request, false); }
		catch (ValidationException e) { return new ResponseEntity<>(e.get(), HttpStatus.BAD_REQUEST); }

		return new ResponseEntity<>(repository.save(new InformationType().convertFromRequest(request)), HttpStatus.ACCEPTED);
	}

	@ApiOperation(value = "Update InformationType", tags = { "InformationType" })
	@ApiResponses(value = {
			@ApiResponse(code = 200, message = "InformationType updated", response = InformationType.class),
			@ApiResponse(code = 404, message = "InformationType not found"),
			@ApiResponse(code = 500, message = "Internal server error")})
	@PutMapping("/{id}")
	public ResponseEntity<?> updateInformationType(@PathVariable Long id, @Valid @RequestBody InformationTypeRequest request) {
		Optional<InformationType> fromRepository = repository.findById(id);
		if(fromRepository.isEmpty()) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}

		try { service.validateRequest(request, true); }
		catch (ValidationException e) { return new ResponseEntity<>(e.get(), HttpStatus.BAD_REQUEST); }

		InformationType informationType = fromRepository.get().convertFromRequest(request);
		informationType.setElasticsearchStatus(ElasticsearchStatus.TO_BE_UPDATED);

		return new ResponseEntity<>(repository.save(informationType), HttpStatus.ACCEPTED);

	}

	@ApiOperation(value = "Delete InformationType", tags = {"InformationType"})
	@ApiResponses(value = {
			@ApiResponse(code = 200, message = "InformationType deleted"),
			@ApiResponse(code = 404, message = "InformationType not found"),
			@ApiResponse(code = 500, message = "Internal server error")})
	@DeleteMapping("/{id}")
	@Transactional
	public ResponseEntity<?> deleteInformationTypeById(@PathVariable Long id) {
		Optional<InformationType> informationType = repository.findById(id);
		if(informationType.isEmpty()) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}

		elasticsearch.deleteInformationTypeById(informationType.get().getElasticsearchId());
		repository.delete(informationType.get());

		return new ResponseEntity<>(HttpStatus.ACCEPTED);
	}
}
