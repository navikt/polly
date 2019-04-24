package no.nav.data.catalog.backend.app.informationtype;

import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchRepository;
import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus;
import no.nav.data.catalog.backend.app.common.exceptions.ValidationException;
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
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/backend/informationtype")
public class InformationTypeController {

	@Autowired
	private ElasticsearchRepository elasticsearch;

	@Autowired
	private InformationTypeRepository repository;

	@Autowired
	private InformationTypeService service;

	@GetMapping("/{id}")
	public ResponseEntity<InformationType> getInformationTypeById(@PathVariable Long id) {
		Optional<InformationType> informationType = repository.findById(id);
		if(informationType.isEmpty()) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}

		return new ResponseEntity<>(informationType.get(), HttpStatus.OK);
	}

	@GetMapping
	public ResponseEntity<List<InformationType>> getAllInformationTypes() {
		List<InformationType> informationTypes = repository.findAllByOrderByIdAsc();
		if(informationTypes.isEmpty()) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}

		return new ResponseEntity<>(informationTypes, HttpStatus.OK);
	}

	@PostMapping
	public ResponseEntity<?> createInformationType(@RequestBody InformationTypeRequest request) {
		try { service.validateRequest(request, false); }
		catch (ValidationException e) { return new ResponseEntity<>(e.get(), HttpStatus.BAD_REQUEST); }

		return new ResponseEntity<>(repository.save(new InformationType().convertFromRequest(request)), HttpStatus.ACCEPTED);
	}

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
