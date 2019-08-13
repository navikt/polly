package no.nav.data.catalog.backend.app.codelist;

import lombok.extern.slf4j.Slf4j;
import no.nav.data.catalog.backend.app.common.exceptions.CodelistNotFoundException;
import no.nav.data.catalog.backend.app.common.exceptions.ValidationException;
import no.nav.data.catalog.backend.app.common.utils.StreamUtils;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collection;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import javax.annotation.PostConstruct;

@Slf4j
@Service
public class CodelistService {

	private CodelistRepository repository;

	public static final Map<ListName, Map<String, String>> codelists = new EnumMap<>(ListName.class);

	public CodelistService(CodelistRepository repository) {
		this.repository = repository;
		initListNames();
	}

	public static CodeResponse getCodeInfoForCodelistItem(ListName listName, String code) {
		return new CodeResponse(code, codelists.get(listName).get(code));
	}

	public static List<CodeResponse> getCodeInfoForCodelistItems(ListName listName, Collection<String> codes) {
		return StreamUtils.safeStream(codes)
				.map(code -> getCodeInfoForCodelistItem(listName, code))
				.collect(Collectors.toList());
	}

	@PostConstruct
	public void refreshCache() {
		List<Codelist> allCodelists = repository.findAll();
		initListNames();
		allCodelists.forEach(codelist -> codelists.get(codelist.getList()).put(codelist.getCode(), codelist.getDescription()));
	}

	private void initListNames() {
		Stream.of(ListName.values()).forEach(listName -> codelists.put(listName, new HashMap<>()));
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
		log.error("Cannot find codelist with code={} in list={}", request.getCode(), request.getList());
		throw new CodelistNotFoundException(String.format(
				"Cannot find codelist with code=%s in list=%s", request.getCode(), request.getList()));
	}

	public void delete(ListName name, String code) {
		Optional<Codelist> toDelete = repository.findByListAndCode(name, code);
		if (toDelete.isPresent()) {
			repository.delete(toDelete.get());
			codelists.get(name).remove(code);
		} else {
			log.error("Cannot find a codelist to delete with code={} and listName={}", code, name);
			throw new IllegalArgumentException(
					String.format("Cannot find a codelist to delete with code=%s and listName=%s", code, name));
		}
	}

	public void validateListNameExists(String listName) {
		if (!isListNamePresentInCodelist(listName)) {
			log.error("Codelist with listName={} does not exits", listName);
			throw new CodelistNotFoundException(String.format("Codelist with listName=%s does not exist", listName));
		}
	}

	public void validateListNameAndCodeExists(String listName, String code) {
		validateListNameExists(listName);
		if (!codelists.get(ListName.valueOf(listName.toUpperCase())).containsKey(code.toUpperCase())) {
			log.error("The code={} does not exist in the list={}.", code, listName);
			throw new CodelistNotFoundException(String.format("The code=%s does not exist in the list=%s.", code, listName));
		}
	}

	public boolean isListNamePresentInCodelist(String listName) {
		Optional<ListName> optionalListName = Arrays.stream(ListName.values())
				.filter(x -> x.toString().equalsIgnoreCase(listName))
				.findFirst();
		return optionalListName.isPresent();
	}

	public void validateRequests(List<CodelistRequest> requests, boolean isUpdate) {
		Map<String, Map<String, String>> validationMap = new HashMap<>();

		if (requests == null || requests.isEmpty()) {
			log.error("The request was not accepted because it is empty");
			throw new ValidationException("The request was not accepted because it is empty");
		}

		Map<String, Map<String, String>> validationErrorsForTheEntireRequest = new HashMap<>();
		if (duplicatesInRequests(requests)) {
			validationErrorsForTheEntireRequest.put("NotUniqueRequests", findDuplicatesInRequest(requests));
		}

		final AtomicInteger requestIndex = new AtomicInteger();
		requests.forEach(request -> {
			requestIndex.addAndGet(1);
            Map<String, String> errorsInCurrentRequest = validateThatNoFieldsAreNullOrEmpty(request);

			if (errorsInCurrentRequest.isEmpty()) {
				request.toUpperCaseAndTrim();
				errorsInCurrentRequest = validateThatAllFieldsHaveValidValues(request, isUpdate);
			}

			if (!errorsInCurrentRequest.isEmpty()) {
				validationErrorsForTheEntireRequest.put(String.format("Request:%s", requestIndex.toString()), errorsInCurrentRequest);
			}
		});

		if (!validationErrorsForTheEntireRequest.isEmpty()) {
			log.error("The request was not accepted. The following errors occurred during validation: {}", validationErrorsForTheEntireRequest);
			throw new ValidationException(validationErrorsForTheEntireRequest, "The request was not accepted. The following errors occurred during validation: ");
		}
	}

	private Boolean duplicatesInRequests(List<CodelistRequest> requestList) {
		Set<CodelistRequest> requestSet = new HashSet<>(requestList);
		return requestSet.size() < requestList.size();
	}

	private Map<String, String> findDuplicatesInRequest(List<CodelistRequest> listWithDuplicates) {
		Map<String, Integer> mapOfRequests = new HashMap<>();
		Map<String, String> mapOfDuplicateErrors = new HashMap<>();

		AtomicInteger requestIndex = new AtomicInteger();
		listWithDuplicates.forEach(request -> {
			requestIndex.incrementAndGet();
			String identifier = request.getList() + "-" + request.getCode();
			if (mapOfRequests.containsKey(identifier)) {
				mapOfDuplicateErrors.put(identifier,
						String.format("Request:%s - The codelist %s is not unique because it has already been used in this request (see request:%s)",
								requestIndex, identifier, mapOfRequests.get(identifier)));
			} else {
				mapOfRequests.put(identifier, requestIndex.intValue());
			}
		});
		return mapOfDuplicateErrors;
	}

	private Map<String, String> validateThatNoFieldsAreNullOrEmpty(CodelistRequest request) {
		Map<String, String> validationErrors = new HashMap<>();
		if (request.getList() == null) {
			validationErrors.put("list", "The codelist must have a listName");
		}
		if (request.getCode() == null || request.getCode().isEmpty()) {
			validationErrors.put("code", "The code was null or missing");
		}
		if (request.getDescription() == null || request.getDescription().isEmpty()) {
			validationErrors.put("description", "The description was null or missing");
		}
		return validationErrors;
	}

	private Map validateThatAllFieldsHaveValidValues(CodelistRequest request, boolean isUpdate) {
		HashMap<String, String> validationErrors = new HashMap<>();
		if (!isListNamePresentInCodelist(request.getList().toString())) {
			validationErrors.put("listName", String.format("Codelist with listName=%s does not exits", request.getList()));
		} else {
			if (!isUpdate && codelists.get(request.getList()).containsKey(request.getCode())) {
				validationErrors.put("code", String.format("The code %s already exists in the codelist(%s) and therefore cannot be created",
						request.getCode(), request.getList()));
			} else if (isUpdate && codelists.get(request.getList()).get(request.getCode()) == null) {
				validationErrors.put("code", String.format("The code %s does not exist in the codelist(%s) and therefore cannot be updated",
						request.getCode(), request.getList()));
			}
		}
		return validationErrors;
	}
}