package no.nav.data.catalog.backend.app.informationtype;

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
@RequestMapping("/backend/informationtype")
public class InformationTypeController {

	@Autowired
	private InformationTypeService informationTypeService;

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public InformationType createInformationType(@Valid @RequestBody InformationTypeRequest informationTypeRequest) {
		return informationTypeService.createInformationType(informationTypeRequest);
	}

	@GetMapping("/{id}")
	public InformationType getInformationTypeById(@PathVariable Long id) {
		return informationTypeService.getInformationType(id);
	}

	@GetMapping
	public List<InformationType> getAllInformationTypes() {
		return informationTypeService.getAllInformationTypes();
	}

	@PutMapping("/{id}")
	public InformationType updateInformationType(@PathVariable Long id, @Valid @RequestBody InformationTypeRequest informationTypeRequest) {
		return informationTypeService.updateInformationType(id, informationTypeRequest);
	}

	@DeleteMapping("/{id}")
	public void deleteInformationTypeById(@PathVariable Long id) {
		informationTypeService.setInformationTypeToBeDeletedById(id);
	}

	@GetMapping("/synch")
	public void synchToElasticsearch() {
		informationTypeService.synchToElasticsearch();
	}
}
