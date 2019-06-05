package no.nav.data.catalog.backend.app.codelist;

import lombok.extern.slf4j.Slf4j;
import no.nav.data.catalog.backend.app.common.exceptions.CodelistNotFoundException;
import no.nav.data.catalog.backend.app.common.exceptions.ValidationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Slf4j
@Service
public class CodelistService {

	private static final Logger logger = LoggerFactory.getLogger(CodelistService.class);

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

	public List<Codelist> save(List<CodelistRequest> requests) {
		requests.forEach(request -> codelists.get(request.getList())
				.put(request.getCode().toUpperCase(), request.getDescription()));
		return repository.saveAll(requests.stream()
				.map(CodelistRequest::convert)
				.collect(Collectors.toList()));
	}

	public List<Codelist> update(List<CodelistRequest> requests) {
		requests.forEach(request -> codelists.get(request.getList())
				.put(request.getCode().toUpperCase(), request.getDescription()));

		return repository.saveAll(requests.stream()
				.map(this::setDescriptionByCodelistRequest)
				.collect(Collectors.toList()));
	}

	private Codelist setDescriptionByCodelistRequest(CodelistRequest request) {
		Optional<Codelist> optionalCodelist = repository.findByListAndCode(request.getList(), request.getCode().toUpperCase());
		if (optionalCodelist.isPresent()) {
			Codelist codelist = optionalCodelist.get();
			codelist.setDescription(request.getDescription());
			return codelist;
		}
		logger.error("Cannot find codelist with code={} in list={}", request.getCode(), request.getList());
		throw new CodelistNotFoundException(String.format(
				"Cannot find codelist with code=%s in list=%s", request.getCode(), request.getDescription()));
	}

	public void delete(ListName name, String code) {
		Optional<Codelist> toDelete = repository.findByListAndCode(name, code);
		if(toDelete.isPresent()) {
			repository.delete(toDelete.get());
			codelists.get(name).remove(code);
		} else {
			logger.error("Cannot find a codelist to delete with code={} and listName={}", code, name);
			throw new IllegalArgumentException();
		}
	}

	public void validateRequest(CodelistRequest request, boolean isUpdate) throws ValidationException {
		HashMap<String, String> validationErrors = new HashMap<>();

		if (request.getList() == null) {
			validationErrors.put("list", "The codelist must have a list name");
		}
		if (!isUpdate && request.getList() != null && codelists.get(request.getList()).containsKey(request.getCode())) {
			validationErrors.put("code", "The code " + request.getCode() + " already exists in " + request.getList());
		}
		if (request.getCode() == null || request.getCode().isEmpty()) {
			validationErrors.put("code", "The code was null or missing");
		}
		if (request.getDescription() == null || request.getDescription().isEmpty()) {
			validationErrors.put("description", "The description was null or missing");
		}

		if(!validationErrors.isEmpty()) {
			logger.error("Validation errors occured when validating CodelistRequest: {}", validationErrors);
			throw new ValidationException(validationErrors);
		}
	}

	private Optional<ListName> listNameInCodelist(String listName){
		Stream<ListName> streamOfListNames = Arrays.stream(ListName.values());
		return streamOfListNames
				.filter(x -> x.toString().equals(listName.toUpperCase()))
				.findFirst();
	}

	void isListNamePresentInCodelist(String listName) {
		Optional<ListName> optionalListName = listNameInCodelist(listName);
		if (optionalListName.isEmpty()) {
			logger.error("Codelist with listName={} does not exits", listName);
			throw new CodelistNotFoundException(String.format("Codelist with ListName=%s does not exist", listName));
		}
	}


}
