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
import java.util.concurrent.atomic.AtomicInteger;
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
				.put(request.getCode(), request.getDescription()));
		return repository.saveAll(requests.stream()
				.map(CodelistRequest::convert)
				.collect(Collectors.toList()));
	}

	public List<Codelist> update(List<CodelistRequest> requests) {
		requests.forEach(request -> codelists.get(request.getList())
				.put(request.getCode(), request.getDescription()));

		return repository.saveAll(requests.stream()
				.map(this::updateDescriptionInRepository)
				.collect(Collectors.toList()));
	}

	private Codelist updateDescriptionInRepository(CodelistRequest request) {
		Optional<Codelist> optionalCodelist = repository.findByListAndCode(request.getList(), request.getCode());
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
		if (toDelete.isPresent()) {
			repository.delete(toDelete.get());
			codelists.get(name).remove(code);
		} else {
			logger.error("Cannot find a codelist to delete with code={} and listName={}", code, name);
			throw new IllegalArgumentException();
		}
	}

	public void validateRequests(List<CodelistRequest> requests, boolean isUpdate) {
		HashMap<String, HashMap> validationMap = new HashMap<>();

		if (requests == null || requests.isEmpty()) {
			logger.error("The request was not accepted because it is empty");
			throw new ValidationException("The request was not accepted because it is empty");
		}

		HashMap<String, Integer> codelistsUsedInRequest = new HashMap<>();

		final AtomicInteger i = new AtomicInteger(1);
		requests.forEach(request -> {
			HashMap<String, String> requestMap = validateRequest(request, isUpdate);

			if (request.getList() != null && request.getCode() != null) {
				String key = String.format("(%s, %s)", request.getList(), request.getCode());
				if (codelistsUsedInRequest.containsKey(key)) {
					requestMap.put("codelistNotUniqueInThisRequest",
							String.format("The codelist %s has already been used in this request (see request nr:%s)",
									key, codelistsUsedInRequest.get(key)));
				} else {
					codelistsUsedInRequest.put(key, i.intValue());
				}
			}

			if (!requestMap.isEmpty()) {
				validationMap.put(String.format("Request nr:%s", i.intValue()), requestMap);
			}
			i.getAndIncrement();
		});

		if (!validationMap.isEmpty()) {
			logger.error("The request was not accepted. The following errors occurred during validation: {}", validationMap);
			throw new ValidationException(validationMap, "The request was not accepted. The following errors occurred during validation: ");
		}
	}

	private HashMap validateRequest(CodelistRequest request, boolean isUpdate) {
		HashMap<String, String> validationErrors = new HashMap<>();
		if (request.getList() == null) {
			validationErrors.put("list", "The codelist must have a list name");
		}
		if (request.getCode() == null || request.getCode().isEmpty()) {
			validationErrors.put("code", "The code was null or missing");
		}
		if (request.getDescription() == null || request.getDescription().isEmpty()) {
			validationErrors.put("description", "The description was null or missing");
		}

		if (validationErrors.isEmpty()) {
			request.toUpperCaseAndTrim();
			if (!isUpdate && codelists.get(request.getList()).containsKey(request.getCode())) {
				validationErrors.put("code", String.format("The code %s already exists in the codelist(%s) and therefore cannot be created",
						request.getCode(), request.getList()));
			} else if (isUpdate && codelists.get(request.getList()).get(request.getCode()) == null) {
				validationErrors.put("code", String.format("The code %s does not exists in the codelist(%s) and therefore cannot be updated",
						request.getCode(), request.getList()));
			}
		}
		return validationErrors;
	}

	private Optional<ListName> listNameInCodelist(String listName) {
		Stream<ListName> streamOfListNames = Arrays.stream(ListName.values());
		return streamOfListNames
				.filter(x -> x.toString().equalsIgnoreCase(listName))
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
