package no.nav.data.catalog.backend.app.controller;

import no.nav.data.catalog.backend.app.service.InformationtypeService;
import no.nav.data.catalog.backend.app.model.Informationtype;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/backend/informationtype")
public class InformationtypeController {

	@Autowired
	private InformationtypeService informationtypeService;

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public String createInformationtype(@RequestBody String jsonString) {
		//TODO: Informasjon i responsemelding
		return informationtypeService.createInformationtype(jsonString);
	}

	@GetMapping("/{id}")
	public Informationtype getInformationtypeById(@PathVariable Long id) {
		return informationtypeService.getInformationtype(id);
	}

	//TODO: update-logikk
//	@PutMapping("/{id}")
//	public String updateFieldsById(@PathVariable Long id, @RequestBody String jsonString) {
//		return informationtypeService.updateFieldsById(id, jsonString);
//	}

	@DeleteMapping("/{id}")
	public String deleteInformationTypeById(@PathVariable Long id) {
		return informationtypeService.deleteInformationtypeById(id);
	}

	@GetMapping("/all")
	public List<Informationtype> getAllInformationtypes() {
		return informationtypeService.getAllInformationtypes();
	}

}
