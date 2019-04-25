package no.nav.data.catalog.backend.app.codelist;

import no.nav.data.catalog.backend.app.common.exceptions.ValidationException;
import no.nav.data.catalog.backend.app.informationtype.InformationType;
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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Optional;

import static no.nav.data.catalog.backend.app.codelist.CodelistService.codelists;

@RestController
@CrossOrigin
@RequestMapping("/backend/codelist")
public class CodelistController {

	@Autowired
	private CodelistService service;

	@GetMapping
	public HashMap<ListName, HashMap<String, String>> findAll() {
		return codelists;
	}


	@GetMapping("/{listName}")
	public ResponseEntity<HashMap<String, String>> findByListName(@PathVariable String listName) {
		if(!codelists.containsKey(ListName.valueOf(listName.toUpperCase()))) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}

		return new ResponseEntity<>(codelists.get(ListName.valueOf(listName.toUpperCase())), HttpStatus.OK);
	}

	@GetMapping("/{listName}/{code}")
	public ResponseEntity<String> findByListNameAndCode(@PathVariable String listName, @PathVariable String code) {
		if(!codelists.get(ListName.valueOf(listName.toUpperCase())).containsKey(code.toUpperCase())) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}

		return new ResponseEntity<>(codelists.get(ListName.valueOf(listName.toUpperCase())).get(code.toUpperCase()), HttpStatus.OK);
	}

	@PostMapping
	public ResponseEntity<?> save(@Valid @RequestBody CodelistRequest request) {
		try { service.validateRequest(request,false); }
		catch (ValidationException e) { return new ResponseEntity<>(e.get(), HttpStatus.BAD_REQUEST); }

		return new ResponseEntity<>(service.save(request), HttpStatus.ACCEPTED);
	}

	@PutMapping
	public ResponseEntity<?> updateLookupEntity(@Valid @RequestBody CodelistRequest request) {
		try { service.validateRequest(request,true); }
		catch (ValidationException e) { return new ResponseEntity<>(e.get(), HttpStatus.BAD_REQUEST); }

		return new ResponseEntity<>(service.save(request), HttpStatus.ACCEPTED);
	}

	@DeleteMapping("/{listName}/{code}")
	public void deleteLookupEntity(@PathVariable String listName, @PathVariable String code) {
		service.delete(ListName.valueOf(listName), code);
	}

	@GetMapping("/refresh")
	public ResponseEntity refresh() {
		service.refreshCache();
		return new ResponseEntity(HttpStatus.OK);
	}
}
