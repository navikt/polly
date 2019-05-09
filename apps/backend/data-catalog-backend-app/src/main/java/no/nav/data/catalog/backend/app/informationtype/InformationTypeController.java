package no.nav.data.catalog.backend.app.informationtype;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.catalog.backend.app.common.exceptions.ValidationException;
import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
	public ResponseEntity<InformationType> getInformationTypeById(@PathVariable Long id) {
		logger.info("InformationTypeController, received request for InformationType with the id:{}", id);
		Optional<InformationType> informationType = repository.findById(id);
		if(informationType.isEmpty()) {
			logger.info("InformationTypeController, couldn't find the InformationType with id:{}", id);
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		logger.info("InformationTypeController, returned InformationType");
		return new ResponseEntity<>(informationType.get(), HttpStatus.OK);
	}

	@ApiOperation(value = "Get all InformationTypes", tags = { "InformationType" })
	@ApiResponses(value = {
			@ApiResponse(code = 200, message = "All informationTypes fetched", response = InformationType.class, responseContainer = "List"),
			@ApiResponse(code = 404, message = "No InformationTypes found in repository"),
			@ApiResponse(code = 500, message = "Internal server error")})
	@GetMapping
	public ResponseEntity<List<InformationType>> getAllInformationTypes() {
		logger.info("InformationTypeController, received request for all InformationTypes");
		List<InformationType> informationTypes = repository.findAllByOrderByIdAsc();
		if(informationTypes.isEmpty()) {
			logger.info("InformationTypeController, the repository for InformationTypes is empty");
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		logger.info("InformationTypeController, returned all InformationTypes");
		return new ResponseEntity<>(informationTypes, HttpStatus.OK);
	}

	@ApiOperation(value = "Create InformationType", tags = { "InformationType" })
	@ApiResponses(value = {
			@ApiResponse(code = 201, message = "InformationType successfully created", response = InformationType.class),
			@ApiResponse(code = 400, message = "Illegal arguments"),
			@ApiResponse(code = 500, message = "Internal server error")})
	@PostMapping
	public ResponseEntity<?> createInformationType(@RequestBody InformationTypeRequest request) {
		logger.info("InformationTypeController, received a request to create InformationType");
		try {
			service.validateRequest(request, false);
		}
		catch (ValidationException e) {
			logger.info("InformationTypeController, couldn't create an InformationType due to invalid request");
			return new ResponseEntity<>(e.get(), HttpStatus.BAD_REQUEST);
		}
		InformationType informationType = new InformationType().convertFromRequest(request, false);

		logger.info("InformationTypeController, created and saved new InformationType");
		return new ResponseEntity<>(repository.save(informationType), HttpStatus.ACCEPTED);
	}

	@ApiOperation(value = "Update InformationType", tags = { "InformationType" })
	@ApiResponses(value = {
			@ApiResponse(code = 200, message = "InformationType updated", response = InformationType.class),
			@ApiResponse(code = 400, message = "Illegal arguments"),
			@ApiResponse(code = 404, message = "InformationType not found"),
			@ApiResponse(code = 500, message = "Internal server error")})
	@PutMapping("/{id}")
	public ResponseEntity<?> updateInformationType(@PathVariable Long id, @Valid @RequestBody InformationTypeRequest request) {
		logger.info("InformationTypeController, received a request to update InformationType with id:{}", id);
		Optional<InformationType> fromRepository = repository.findById(id);
		if(fromRepository.isEmpty()) {
			logger.info("InformationTypeController, couldn't find InformationType with id:{}", id);
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		try {
			service.validateRequest(request, true);
		}
		catch (ValidationException e) {
			logger.info("InformationTypeController, couldn't create an InformationType due to invalid request");
			return new ResponseEntity<>(e.get(), HttpStatus.BAD_REQUEST);
		}
		InformationType informationType = fromRepository.get().convertFromRequest(request, true);

		logger.info("InformationTypeController, updated the InformationType");
		return new ResponseEntity<>(repository.save(informationType), HttpStatus.ACCEPTED);
	}

	@ApiOperation(value = "Delete InformationType", tags = { "InformationType" })
	@ApiResponses(value = {
			@ApiResponse(code = 200, message = "InformationType deleted"),
			@ApiResponse(code = 404, message = "InformationType not found"),
			@ApiResponse(code = 500, message = "Internal server error")})
	@DeleteMapping("/{id}")
	@Transactional
	public ResponseEntity<?> deleteInformationTypeById(@PathVariable Long id) {
		logger.info("InformationTypeController, received a request to delete InformationType with id:{}", id);
		Optional<InformationType> fromRepository = repository.findById(id);
		if(fromRepository.isEmpty()) {
			logger.info("InformationTypeController, couldn't find InformationType with id:{}", id);
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		InformationType informationType = fromRepository.get();
		informationType.setElasticsearchStatus(ElasticsearchStatus.TO_BE_DELETED);
		logger.info("InformationTypeController, InformationType with id:{} has been set to be deleted on next schedulated task", id);
		return new ResponseEntity<>(repository.save(informationType), HttpStatus.ACCEPTED);
	}
}
