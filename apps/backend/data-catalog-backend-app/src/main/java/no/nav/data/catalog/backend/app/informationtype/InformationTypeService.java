package no.nav.data.catalog.backend.app.informationtype;

import static no.nav.data.catalog.backend.app.codelist.CodelistService.codelists;
import static no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus.SYNCED;
import static no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus.TO_BE_CREATED;
import static no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus.TO_BE_DELETED;
import static no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus.TO_BE_UPDATED;

import lombok.extern.slf4j.Slf4j;
import no.nav.data.catalog.backend.app.codelist.ListName;
import no.nav.data.catalog.backend.app.common.exceptions.DataCatalogBackendNotFoundException;
import no.nav.data.catalog.backend.app.common.exceptions.ValidationException;
import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchRepository;
import no.nav.data.catalog.backend.app.policy.PolicyConsumer;
import no.nav.data.catalog.backend.app.policy.PolicyResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;

@Slf4j
@Service
public class InformationTypeService {

	private static final Logger logger = LoggerFactory.getLogger(InformationTypeService.class);

	@Autowired
	private InformationTypeRepository repository;

	@Autowired
	private ElasticsearchRepository elasticsearch;

	@Autowired
	private PolicyConsumer policyConsumer;

	public void synchToElasticsearch() {
		logger.info("Starting sync to ElasticSearch");
		createInformationTypesInElasticsearch();
		updateInformationTypesInElasticsearch();
		deleteInformationTypesInElasticsearchAndInPostgres();
		logger.info("Finished sync to ElasticSearch");
	}

	private void createInformationTypesInElasticsearch() {
		Optional<List<InformationType>> optionalInformationTypes = repository.findByElasticsearchStatus(TO_BE_CREATED);
		if (optionalInformationTypes.isPresent()) {
			Map<String, Object> jsonMap;

			for (InformationType informationType : optionalInformationTypes.get()) {
				InformationTypeESDocument informationTypeESDocument = new InformationTypeESDocument();
				informationTypeESDocument.setInformationTypeResponse(informationType.convertToResponse());
				List<PolicyResponse> policies = policyConsumer.getPolicyForInformationType(informationType.getId());
				informationTypeESDocument.setPolicies(policies);

				jsonMap = informationTypeESDocument.convertToMap();

				elasticsearch.insertInformationType(jsonMap);

				informationType.setElasticsearchStatus(SYNCED);
				repository.save(informationType);
			}
		}
	}

	private void updateInformationTypesInElasticsearch() {
		Optional<List<InformationType>> optinalInformationTypes = repository.findByElasticsearchStatus(TO_BE_UPDATED);
		if (optinalInformationTypes.isPresent()) {
			Map<String, Object> jsonMap;

			for (InformationType informationType : optinalInformationTypes.get()) {
				InformationTypeESDocument informationTypeESDocument = new InformationTypeESDocument();
				informationTypeESDocument.setInformationTypeResponse(informationType.convertToResponse());
				List<PolicyResponse> policies = policyConsumer.getPolicyForInformationType(informationType.getId());
				informationTypeESDocument.setPolicies(policies);

				jsonMap = informationTypeESDocument.convertToMap();

				elasticsearch.updateInformationTypeById(informationType.getElasticsearchId(), jsonMap);

				informationType.setElasticsearchStatus(SYNCED);
				repository.save(informationType);
			}
		}
	}

	private void deleteInformationTypesInElasticsearchAndInPostgres() {
		Optional<List<InformationType>> optinalInformationTypes = repository.findByElasticsearchStatus(TO_BE_DELETED);
		if (optinalInformationTypes.isPresent()) {

			for (InformationType informationType : optinalInformationTypes.get()) {
				elasticsearch.deleteInformationTypeById(informationType.getElasticsearchId());

				repository.deleteById(informationType.getId());
			}
		}
	}

	//TODO: Do we need this?
	public void resendToElasticsearch() {
		repository.updateStatusAllRows(TO_BE_UPDATED);
	}

	public void validateRequests(List<InformationTypeRequest> requests, boolean isUpdate) {
		if (requests == null || requests.isEmpty()) {
			logger.error("The request was not accepted because it is empty");
			throw new ValidationException("The request was not accepted because it is empty");
		}

		Map<String, Map> validationErrorsForTheEntireRequest = new HashMap<>();
		if (duplicatesInRequests(requests)) {
			validationErrorsForTheEntireRequest.put("NotUniqueRequests", findDuplicatesInRequest(requests));
		}

		final AtomicInteger requestIndex = new AtomicInteger();
		requests.forEach(request -> {
			requestIndex.addAndGet(1);
			Map errorsInCurrentRequest = validateThatNoFieldsAreNullOrEmpty(request);

			if (errorsInCurrentRequest.isEmpty()) {
				request.toUpperCaseAndTrim();
				errorsInCurrentRequest = validateThatAllFieldsHaveValidValues(request, isUpdate);
			}

			if (!errorsInCurrentRequest.isEmpty()) {
				validationErrorsForTheEntireRequest.put(String.format("Request:%s", requestIndex.toString()), errorsInCurrentRequest);
			}
		});

		if (!validationErrorsForTheEntireRequest.isEmpty()) {
			logger.error("The request was not accepted. The following errors occurred during validation: {}", validationErrorsForTheEntireRequest);
			throw new ValidationException(validationErrorsForTheEntireRequest, "The request was not accepted. The following errors occurred during validation: ");
		}
	}

	private Boolean duplicatesInRequests(List<InformationTypeRequest> requestList) {
		Set<InformationTypeRequest> requestSet = new HashSet<>(requestList);
		return requestSet.size() < requestList.size();
	}

	private Map<String, String> findDuplicatesInRequest(List<InformationTypeRequest> listWithDuplicates) {
		Map<String, Integer> mapOfRequests = new HashMap<>();
		Map<String, String> mapOfDuplicateErrors = new HashMap<>();

		AtomicInteger requestIndex = new AtomicInteger();
		listWithDuplicates.forEach(request -> {
			requestIndex.incrementAndGet();
			String identifier = request.getName();
			if (mapOfRequests.containsKey(identifier)) {
				mapOfDuplicateErrors.put(identifier,
						String.format("Request:%s - The name %s is not unique because it has already been used in this request (see request:%s)",
								requestIndex, identifier, mapOfRequests.get(identifier)));
			} else {
				mapOfRequests.put(identifier, requestIndex.intValue());
			}
		});
		return mapOfDuplicateErrors;
	}

	private Map validateThatNoFieldsAreNullOrEmpty(InformationTypeRequest request) {
		HashMap<String, String> validationErrors = new HashMap<>();
		if (request.getName() == null || request.getName().isEmpty()) {
			validationErrors.put("name", "The name was null or empty");
		}
		if (request.getDescription() == null || request.getDescription().isEmpty()) {
			validationErrors.put("description", "The description was null or empty");
		}
		if (request.getPersonalData() == null) {
			validationErrors.put("personalData", "PersonalData cannot be null");
		}
		if (request.getCategoryCode() == null || request.getCategoryCode().isEmpty()) {
			validationErrors.put("categoryCode", "The categoryCode was null or empty");
		}
		if (request.getSystemCode() == null || request.getSystemCode().isEmpty()) {
			validationErrors.put("systemCode", "The systemCode was null or empty");
		}
		if (request.getProducerCode() == null || request.getProducerCode().isEmpty()) {
			validationErrors.put("producerCode", "The list of producerCodes was null or empty");
		} else {
			long nrOfErrors = request.getProducerCode().stream().filter(code -> code == null || code.isEmpty()).count();
			if (nrOfErrors > 0) {
				validationErrors.put("producerCode", String.format("There are %s instances where the value of producerCode is null or empty", nrOfErrors));
			}
		}

		return validationErrors;
	}


	private Map validateThatAllFieldsHaveValidValues(InformationTypeRequest request, boolean isUpdate) {
		HashMap<String, String> validationErrors = new HashMap<>();
		if (!isUpdate && repository.findByName(request.getName()).isPresent()) {
			validationErrors.put("nameAlreadyUsed", String.format("The name %s is already in use by another InformationType and therefore cannot be created", request
					.getName()));
		} else if (isUpdate && repository.findByName(request.getName()).isEmpty()) {
			validationErrors.put("nameNotFound", String.format("There is not an InformationType with the name %s and therefore it cannot be updated", request
					.getName()));
		}
		validationErrors.putAll(doesListContainTheCode(ListName.CATEGORY, request.getCategoryCode()));
		validationErrors.putAll(doesListContainTheCode(ListName.SYSTEM, request.getSystemCode()));
		request.getProducerCode().forEach(code ->
				validationErrors.putAll(doesListContainTheCode(ListName.PRODUCER, code)));

		return validationErrors;
	}

	private HashMap<String, String> doesListContainTheCode(ListName listName, String code) {
		HashMap<String, String> listMap = new HashMap<>();
		if (!codelists.get(listName).containsKey(code.toUpperCase().trim())) {
			listMap.put(listName.toString().toLowerCase() + "Code",
					String.format("The code %s was not found in the codelist(%s)", code.toUpperCase().trim(), listName));
		}
		return listMap;
	}

	public List<InformationType> returnUpdatedInformationTypesIfAllArePresent(List<InformationTypeRequest> requests) {
		List<InformationType> informationTypes = new ArrayList<>();
		requests.forEach(request -> {
			Optional<InformationType> optionalInformationType = repository.findByName(request.getName());
			if (optionalInformationType.isEmpty()) {
				throw new DataCatalogBackendNotFoundException(String.format("Cannot find informationType with name: %s", request
						.getName()));
			}
			informationTypes.add(optionalInformationType.get().convertFromRequest(request, true));
		});
		return informationTypes;
	}
}
