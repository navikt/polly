package no.nav.data.catalog.backend.app.codelist;

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

import javax.validation.Valid;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/backend/lookup")
public class CodelistController {

	@Autowired
	private CodelistService codelistService;

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public Codelist createLookupEntity(@Valid @RequestBody CodelistRequest request) {
		return codelistService.createLookupEntity(request);
	}

	@GetMapping
	public List<Codelist> getLookupTable() {
		return codelistService.getLookupTable();
	}

	@GetMapping("/{entity}")
	public List<Codelist> lookupEntityType(@PathVariable String entity) {
		return codelistService.lookupEntityType(entity);
	}

	@GetMapping("/{entity}/{code}")
	public Codelist lookupCodeOfEntityType(@PathVariable String entity, @PathVariable String code) {
		return codelistService.lookupCodeOfEntityType(entity, code);
	}

	@PutMapping
	public Codelist updateLookupEntity(@Valid @RequestBody CodelistRequest request) {
		return codelistService.updateLookupEntity(request);
	}

	@DeleteMapping
	public void deleteLookupEntity(@Valid @RequestBody CodelistRequest request) {
		codelistService.deleteLookupEntity(request);
	}
}
