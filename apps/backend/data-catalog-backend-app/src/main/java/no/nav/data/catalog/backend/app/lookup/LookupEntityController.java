package no.nav.data.catalog.backend.app.lookup;

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
public class LookupEntityController {

	@Autowired
	private LookupEntityService lookupEntityService;

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public LookupEntity createLookupEntity(@Valid @RequestBody LookupEntityRequest request) {
		return lookupEntityService.createLookupEntity(request);
	}

	@GetMapping
	public List<LookupEntity> getLookupTable() {
		return lookupEntityService.getLookupTable();
	}

	@GetMapping("/{entity}")
	public List<LookupEntity> lookupEntityType(@PathVariable String entity) {
		return lookupEntityService.lookupEntityType(entity);
	}

	@GetMapping("/{entity}/{code}")
	public LookupEntity lookupCodeOfEntityType(@PathVariable String entity, @PathVariable String code) {
		return lookupEntityService.lookupCodeOfEntityType(entity, code);
	}

	@PutMapping
	public LookupEntity updateLookupEntity(@Valid @RequestBody LookupEntityRequest request) {
		return lookupEntityService.updateLookupEntity(request);
	}

	@DeleteMapping
	public void deleteLookupEntity(@Valid @RequestBody LookupEntityRequest request) {
		lookupEntityService.deleteLookupEntity(request);
	}
}
