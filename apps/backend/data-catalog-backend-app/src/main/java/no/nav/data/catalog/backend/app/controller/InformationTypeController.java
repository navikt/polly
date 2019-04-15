package no.nav.data.catalog.backend.app.controller;

import no.nav.data.catalog.backend.app.model.InformationType;
import no.nav.data.catalog.backend.app.model.LookupEntity;
import no.nav.data.catalog.backend.app.model.request.InformationTypeRequest;
import no.nav.data.catalog.backend.app.service.InformationTypeService;
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
@RequestMapping("/backend")
public class InformationTypeController {

	@Autowired
	private InformationTypeService informationTypeService;

	@PostMapping("/informationtype")
	@ResponseStatus(HttpStatus.CREATED)
	public InformationType createInformationType(@Valid @RequestBody InformationTypeRequest informationTypeRequest) {
		return informationTypeService.createInformationType(informationTypeRequest);
	}

	@GetMapping("/informationtype/{id}")
	public InformationType getInformationTypeById(@PathVariable Long id) {
		return informationTypeService.getInformationType(id);
	}

	@GetMapping("/informationtype")
	public List<InformationType> getAllInformationTypes() {
		return informationTypeService.getAllInformationTypes();
	}

	@PutMapping("/informationtype/{id}")
	public InformationType updateInformationType(@PathVariable Long id, @Valid @RequestBody InformationTypeRequest informationTypeRequest) {
		return informationTypeService.updateInformationType(id, informationTypeRequest);
	}

	@DeleteMapping("/informationtype/{id}")
	public void deleteInformationTypeById(@PathVariable Long id) {
		informationTypeService.setInformationTypeToBeDeletedById(id);
	}

	@GetMapping("/lookup")
	public List<LookupEntity> getFullDecodedTable() {
		return informationTypeService.getDecodeTable();
	}

	@GetMapping("/lookup/{entity}")
	public List<LookupEntity> getAllForEntityOfDecodedTable(@PathVariable String entity) {
		return informationTypeService.getAllForEntityOfDecodedTable(entity);
	}

	@GetMapping("/lookup/{entity}/{code}")
	public LookupEntity getDescriptionForEntityAndCode(@PathVariable String entity, @PathVariable String code) {
		return informationTypeService.getDescriptionForEntityAndCode(entity, code);
	}

	@GetMapping("/synch")
	public void synchToElasticsearch() {
		informationTypeService.synchToElasticsearch();
	}
}
