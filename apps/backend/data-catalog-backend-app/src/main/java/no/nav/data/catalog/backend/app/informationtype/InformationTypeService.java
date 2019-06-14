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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

@Slf4j
@Service
public class InformationTypeService {

	private static final Logger logger = LoggerFactory.getLogger(InformationTypeService.class);
	private HashMap<String, String> classScopedTemporaryMap = new HashMap<>();

	@Autowired
	private InformationTypeRepository repository;

	@Autowired
	private ElasticsearchRepository elasticsearch;

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
				jsonMap = informationType.convertToMap();

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
				jsonMap = informationType.convertToMap();

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

	public void resendToElasticsearch() {
		repository.updateStatusAllRows(TO_BE_UPDATED);
	}

	public void validateRequests(List<InformationTypeRequest> requests, boolean isUpdate) {
		HashMap<String, HashMap> validationMap = new HashMap<>();

		if (requests == null || requests.isEmpty()) {
			logger.error("The request was not accepted because it is empty");
			throw new ValidationException("The request was not accepted because it is empty");
		}

		HashMap<String, Integer> namesUsedInRequest = new HashMap<>();

		final AtomicInteger i = new AtomicInteger(1);
		requests.forEach(request -> {
			HashMap<String, String> requestMap = validateRequest(request, isUpdate);

			if (namesUsedInRequest.containsKey(request.getName())) {
				requestMap.put("nameNotUniqueInThisRequest", String.format("The name %s is not unique because it is already used in this request (see request nr:%s)", request
						.getName(), namesUsedInRequest.get(request.getName())));
			} else if (request.getName() != null) {
				namesUsedInRequest.put(request.getName(), i.intValue());
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

	private HashMap validateRequest(InformationTypeRequest request, boolean isUpdate) {
		HashMap<String, String> validationErrors = new HashMap<>();

		if (request.getName() == null || request.getName().isEmpty()) {
			validationErrors.put("name", "Name must have a non-empty value");
		}
		if (request.getPersonalData() == null) {
			validationErrors.put("personalData", "PersonalData cannot be null");
		}
		classScopedTemporaryMap.clear();
		doesListContainTheCode(ListName.CATEGORY, request.getCategoryCode());
		doesListContainTheCode(ListName.SYSTEM, request.getSystemCode());
		if (request.getProducerCode() == null) {
			validationErrors.put("producerCode", "The list of producerCodes was null");
		} else {
			request.getProducerCode().forEach(code -> doesListContainTheCode(ListName.PRODUCER, code));
		}
		if (!classScopedTemporaryMap.isEmpty()) {
			validationErrors.putAll(classScopedTemporaryMap);
		}

		if (validationErrors.isEmpty()) {
			request.toUpperCaseAndTrim();
			if (!isUpdate && repository.findByName(request.getName()).isPresent()) {
				validationErrors.put("nameAlreadyUsed", String.format("The name %s is already in use by another InformationType and therefore cannot be created", request
						.getName()));
			} else if (isUpdate && repository.findByName(request.getName()).isEmpty()) {
				validationErrors.put("nameNotFound", String.format("There is not an InformationType with the name %s and therefore it cannot be updated", request
						.getName()));
			}
		}

		return validationErrors;

	}

	private void doesListContainTheCode(ListName listName, String code) {
		String codeType = listName.toString().toLowerCase() + "Code";
		if (code == null) {
			classScopedTemporaryMap.put(codeType, String.format("The %s was null", codeType));
		} else if (!codelists.get(listName).containsKey(code.toUpperCase().trim())) {
			classScopedTemporaryMap.put(codeType, String.format("The code %s was not found in the codelist(%s)", code.toUpperCase()
					.trim(), listName));
		}
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
