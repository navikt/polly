package no.nav.data.catalog.backend.app.codelist;

import static no.nav.data.catalog.backend.app.codelist.CodelistService.codelists;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.catalog.backend.app.common.exceptions.ValidationException;
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
import java.util.HashMap;
import java.util.Optional;

@Slf4j
@RestController
@CrossOrigin
@RequestMapping("/backend/codelist")
public class CodelistController {

	private static final Logger logger = LoggerFactory.getLogger(CodelistController.class);

	@Autowired
	private CodelistService service;

	@ApiOperation(value = "Get the entire Codelist", tags = {"Codelist"})
	@ApiResponses(value = {
			@ApiResponse(code = 200, message = "Entire Codelist fetched", response = HashMap.class, responseContainer = "Map"),
			@ApiResponse(code = 500, message = "Internal server error")})
	@GetMapping
	public HashMap<ListName, HashMap<String, String>> findAll() {
		logger.info("CodelistController, received a request for and returned the entire Codelist");
		return codelists;
	}

	@ApiOperation(value = "Get codes and descriptions for listName", tags = {"Codelist"})
	@ApiResponses(value = {
			@ApiResponse(code = 200, message = "Fetched codes with description for listName", response = HashMap.class, responseContainer = "Map"),
			@ApiResponse(code = 404, message = "ListName not found"),
			@ApiResponse(code = 500, message = "Internal server error")})
	@GetMapping("/{listName}")
	public ResponseEntity<HashMap<String, String>> findByListName(@PathVariable String listName) {
		logger.info("CodelistController, received a request for the codelist with listName:{}", listName);
		Optional<ListName> optionalListName = service.listNameInCodelist(listName);
		if (optionalListName.isEmpty()) {
			logger.info("CodelistController, couldn't find codelist with listName:{}", listName);
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		logger.info("CodelistController, returned codelist");
		return new ResponseEntity<>(codelists.get(ListName.valueOf(listName.toUpperCase())), HttpStatus.OK);
	}

	@ApiOperation(value = "Get description for code in listName", tags = {"Codelist"})
	@ApiResponses(value = {
			@ApiResponse(code = 200, message = "Description fetched", response = String.class),
			@ApiResponse(code = 404, message = "Code or listName not found"),
			@ApiResponse(code = 500, message = "Internal server error")})
	@GetMapping("/{listName}/{code}")
	public ResponseEntity<String> findByListNameAndCode(@PathVariable String listName, @PathVariable String code) {
		logger.info("CodelistController, received a request for the description of code:{} in list:{}",
				code, listName);
		Optional<ListName> optionalListName = service.listNameInCodelist(listName);
		if (optionalListName.isEmpty() || !codelists.get(ListName.valueOf(listName.toUpperCase()))
				.containsKey(code.toUpperCase())) {
			logger.info("CodelistController, couldn't find description for code:{} in list:{}",
					code, listName);
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		logger.info("CodelistController, returned description");
		return new ResponseEntity<>(codelists.get(ListName.valueOf(listName.toUpperCase())).get(code.toUpperCase()), HttpStatus.OK);
	}

	@ApiOperation(value = "Create Codelist", tags = {"Codelist"})
	@ApiResponses(value = {
			@ApiResponse(code = 202, message = "Codelist successfully created", response = Codelist.class),
			@ApiResponse(code = 400, message = "Illegal arguments"),
			@ApiResponse(code = 500, message = "Internal server error")})
	@PostMapping
	public ResponseEntity<?> save(@Valid @RequestBody CodelistRequest request) {
		logger.info("CodelistController, received a request to create code:{} in the list:{}",
				request.getCode(), request.getList());
		try {
			service.validateRequest(request,false);
		}
		catch (ValidationException e) {
			logger.info("CodelistController, couldn't create a codelist due to invalid request");
			return new ResponseEntity<>(e.get(), HttpStatus.BAD_REQUEST);
		}
		logger.info("CodelistController, created and saved new Codelist");
		return new ResponseEntity<>(service.save(request), HttpStatus.ACCEPTED);
	}

	@ApiOperation(value = "Update Codelist", tags = {"Codelist"})
	@ApiResponses(value = {
			@ApiResponse(code = 202, message = "Codelist updated", response = Codelist.class),
			@ApiResponse(code = 400, message = "Illegal arguments"),
			@ApiResponse(code = 500, message = "Internal server error")})
	@PutMapping
	public ResponseEntity<?> update(@Valid @RequestBody CodelistRequest request) {
		logger.info("CodelistController, received a request to update code:{} in the list:{}", request.getCode(), request.getList());
		try {
			service.validateRequest(request,true);
		}
		catch (ValidationException e) {
			logger.info("CodelistController, couldn't update the codelist due to invalid request");
			return new ResponseEntity<>(e.get(), HttpStatus.BAD_REQUEST);
		}
		logger.info("CodelistController, updated the Codelist");
		return new ResponseEntity<>(service.save(request), HttpStatus.ACCEPTED);
	}

	@ApiOperation(value = "Delete Codelist", tags = {"Codelist"})
	@ApiResponses(value = {
			@ApiResponse(code = 200, message = "Codelist deleted"),
			@ApiResponse(code = 400, message = "Illegal arguments"),
			@ApiResponse(code = 500, message = "Internal server error")})
	@DeleteMapping("/{listName}/{code}")
	@Transactional
	public void delete(@PathVariable String listName, @PathVariable String code) {
		logger.info("CodelistController, received a request to delete code:{} in the list:{}", code, listName);

		Optional<ListName> optionalListName = service.listNameInCodelist(listName);
		if (optionalListName.isEmpty()) {
			logger.error("CodelistController, cannot delete codelist because the listName:{} doesn't exist", listName);
			throw new IllegalArgumentException();
		}
		service.delete(ListName.valueOf(listName), code);
		logger.info("CodelistController, code:{} in the list:{} has been deleted", code, listName);
	}

	@ApiOperation(value = "Refresh Codelist", tags = {"Codelist"})
	@ApiResponses(value = {
			@ApiResponse(code = 200, message = "Codelist refreshed"),
			@ApiResponse(code = 500, message = "Internal server error")})
	@GetMapping("/refresh")
	public ResponseEntity refresh() {
		logger.info("CodelistController, refreshed the codelists");
		service.refreshCache();
		return new ResponseEntity(HttpStatus.OK);
	}
}
