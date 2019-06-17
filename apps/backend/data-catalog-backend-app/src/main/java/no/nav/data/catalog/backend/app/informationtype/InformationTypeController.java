package no.nav.data.catalog.backend.app.informationtype;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import javax.validation.Valid;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@RestController
@CrossOrigin
@RequestMapping("/backend/informationtype")
@Api(value = "InformationTypes", description = "REST API for InformationTypes", tags = { "InformationType" })
public class InformationTypeController {

	private static final Logger logger = LoggerFactory.getLogger(InformationTypeController.class);

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
	public ResponseEntity getInformationTypeById(@PathVariable Long id) {
		logger.info("Received request for InformationType with the id={}", id);
		Optional<InformationType> informationType = repository.findById(id);
		if(informationType.isEmpty()) {
			logger.info("Cannot find the InformationType with id={}", id);
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		logger.info("Returned InformationType");
		return new ResponseEntity<>(informationType.get().convertToResponse(), HttpStatus.OK);
	}

	@ApiOperation(value = "Get InformationTypeByName", tags = { "InformationType" })
	@ApiResponses(value = {
			@ApiResponse(code = 200, message = "InformationType fetched", response = InformationType.class),
			@ApiResponse(code = 404, message = "InformationType not found"),
			@ApiResponse(code = 500, message = "Internal server error")})
	@GetMapping("/name/{name}")
	public ResponseEntity getInformationTypeByName(@PathVariable String name) {
		logger.info("Received request for InformationType with the name={}", name);
		Optional<InformationType> informationType = repository.findByName(name);
		if(informationType.isEmpty()) {
			logger.info("Cannot find the InformationType with name={}", name);
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		logger.info("Returned InformationType");
		return new ResponseEntity<>(informationType.get().convertToResponse(), HttpStatus.OK);
	}

	@ApiOperation(value = "Get all InformationTypes", tags = { "InformationType" })
	@ApiResponses(value = {
			@ApiResponse(code = 200, message = "All informationTypes fetched", response = InformationTypeResponse.class, responseContainer = "Page"),
			@ApiResponse(code = 404, message = "No InformationTypes found in repository"),
			@ApiResponse(code = 500, message = "Internal server error")})
	@GetMapping
	public RestResponsePage<InformationTypeResponse> getAllInformationTypes(Pageable pageable) {
		logger.info("Received request for all InformationTypes");
		List<InformationTypeResponse> listOfInformationTypeResponses = repository.findAllByOrderByIdAsc(pageable).stream()
				.map(InformationType::convertToResponse)
				.collect(Collectors.toList());
		return new RestResponsePage<>(listOfInformationTypeResponses, pageable, listOfInformationTypeResponses.size());
	}

	@ApiOperation(value = "Count all InformationTypes", tags = { "InformationType" })
	@ApiResponses(value = {
			@ApiResponse(code = 200, message = "Count of informationTypes fetched", response = Long.class),
			@ApiResponse(code = 500, message = "Internal server error")})
	@GetMapping("/count")
	public Long countAllInformationTypes() {
		logger.info("Received request for count all InformationTypes");
		return repository.count();
	}

	@ApiOperation(value = "Create InformationType", tags = {"InformationTypes"})
	@ApiResponses(value = {
			@ApiResponse(code = 202, message = "InformationTypes to be created successfully accepted", response = InformationTypeResponse.class, responseContainer = "List"),
			@ApiResponse(code = 400, message = "Illegal arguments"),
			@ApiResponse(code = 500, message = "Internal server error")})
	@PostMapping
	@ResponseStatus(HttpStatus.ACCEPTED)
	public List<InformationTypeResponse> createInformationTypes(@RequestBody List<InformationTypeRequest> requests) {
		logger.info("Received requests to create InformationTypes");
		service.validateRequests(requests, false);

		List<InformationType> informationTypes = requests.stream()
				.map(request -> new InformationType().convertFromRequest(request, false))
				.collect(Collectors.toList());

		return repository.saveAll(informationTypes).stream()
				.map(InformationType::convertToResponse)
				.collect(Collectors.toList());
	}

	@ApiOperation(value = "Update InformationType", tags = {"InformationTypes"})
	@ApiResponses(value = {
			@ApiResponse(code = 202, message = "InformationTypes to be updated successfully accepted", response = InformationTypeResponse.class, responseContainer = "List"),
			@ApiResponse(code = 400, message = "Illegal arguments"),
			@ApiResponse(code = 500, message = "Internal server error")})
	@PutMapping
	@ResponseStatus(HttpStatus.ACCEPTED)
	public List<InformationTypeResponse> updateInformationTypes(@RequestBody List<InformationTypeRequest> requests) {
		logger.info("Received requests to update InformationTypes");
		service.validateRequests(requests, true);
		List<InformationType> updatedInformationTypes = service.returnUpdatedInformationTypesIfAllArePresent(requests);

		return repository.saveAll(updatedInformationTypes).stream()
				.map(InformationType::convertToResponse)
				.collect(Collectors.toList());

	}

	@ApiOperation(value = "Update InformationType", tags = { "InformationType" })
	@ApiResponses(value = {
			@ApiResponse(code = 201, message = "Accepted one InformationType to be updated", response = InformationType.class),
			@ApiResponse(code = 400, message = "Illegal arguments"),
			@ApiResponse(code = 404, message = "InformationType not found"),
			@ApiResponse(code = 500, message = "Internal server error")})
	@PutMapping("/{id}")
	public ResponseEntity updateOneInformationTypeById(@PathVariable Long id, @Valid @RequestBody InformationTypeRequest request) {
		logger.info("Received a request to update InformationType with id={}", id);
		Optional<InformationType> fromRepository = repository.findById(id);
		if (fromRepository.isEmpty()) {
			logger.info("Cannot find InformationType with id={}", id);
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		service.validateRequests(List.of(request), true);

		InformationType informationType = fromRepository.get().convertFromRequest(request, true);

		logger.info("Updated the InformationType");
		return new ResponseEntity<>(repository.save(informationType), HttpStatus.ACCEPTED);
	}

	@ApiOperation(value = "Delete InformationType", tags = { "InformationType" })
	@ApiResponses(value = {
			@ApiResponse(code = 201, message = "InformationType deleted"),
			@ApiResponse(code = 404, message = "InformationType not found"),
			@ApiResponse(code = 500, message = "Internal server error")})
	@DeleteMapping("/{id}")
	@Transactional
	public ResponseEntity deleteInformationTypeById(@PathVariable Long id) {
		logger.info("Received a request to delete InformationType with id={}", id);
		Optional<InformationType> fromRepository = repository.findById(id);
		if(fromRepository.isEmpty()) {
			logger.info("Cannot find InformationType with id={}", id);
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		InformationType informationType = fromRepository.get();
		informationType.setElasticsearchStatus(ElasticsearchStatus.TO_BE_DELETED);
		logger.info("InformationType with id={} has been set to be deleted during the next scheduled task", id);
		return new ResponseEntity<>(repository.save(informationType), HttpStatus.ACCEPTED);
	}

}
