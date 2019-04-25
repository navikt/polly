package no.nav.data.catalog.backend.app.codelist;

import no.nav.data.catalog.backend.app.common.exceptions.ValidationException;
import no.nav.data.catalog.backend.app.informationtype.InformationTypeRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.swing.text.html.Option;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CodelistService {

	@Autowired
	private CodelistRepository repository;

	public static HashMap<ListName, HashMap<String, String>> codelists = new HashMap<>();

	@PostConstruct
	public void refreshCache() {
		List<Codelist> allCodelists = repository.findAll();
		List<ListName> listNames = Arrays.asList(ListName.values());

		listNames.forEach(listName -> {
			HashMap<String, String> content = new HashMap<>(allCodelists.stream()
					.filter(inner -> inner.getList().equals(listName))
					.collect(Collectors.toMap(Codelist::getCode, Codelist::getDescription)));

			codelists.put(listName, content);
		});
	}

	public Codelist save(CodelistRequest request) {
		codelists.get(request.getList()).put(request.getCode(), request.getDescription());
		return repository.save(request.convert());
	}

	public void delete(ListName name, String code) {
		Optional<Codelist> toDelete = repository.findByListAndCode(name, code);
		if(toDelete.isPresent()) {
			repository.delete(toDelete.get());
			codelists.get(name).remove(code);
		} else {
			throw new IllegalArgumentException();
		}
	}

	public void validateRequest(CodelistRequest request, boolean isUpdate) throws ValidationException {
		HashMap<String, String> validationErrors = new HashMap<>();

		if(!isUpdate && codelists.get(request.getList()).containsKey(request.getCode())) { validationErrors.put("code", "The code " + request.getCode() + " already exists in " + request.getList()); }
		if(request.getCode().isEmpty() || request.getDescription().isEmpty()) { validationErrors.put("code description", "The code or description seems to be missing."); }

		if(!validationErrors.isEmpty()) {
			throw new ValidationException(validationErrors);
		}
	}
}
