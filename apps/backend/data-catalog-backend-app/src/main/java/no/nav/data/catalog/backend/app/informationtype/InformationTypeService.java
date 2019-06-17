package no.nav.data.catalog.backend.app.informationtype;

import lombok.extern.slf4j.Slf4j;
import no.nav.data.catalog.backend.app.codelist.ListName;
import no.nav.data.catalog.backend.app.common.exceptions.ValidationException;
import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static no.nav.data.catalog.backend.app.codelist.CodelistService.codelists;
import static no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus.*;

@Slf4j
@Service
public class InformationTypeService {

	private static final Logger logger = LoggerFactory.getLogger(InformationTypeService.class);
	private HashMap<String, String> validationErrors = new HashMap<>();

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

	public void validateRequest(InformationTypeRequest request, boolean isUpdate) {
		validationErrors.clear();
		if (request.getName() == null ){ validationErrors.put("name", "Name must have value"); }
		if (request.getPersonalData() == null) {
			validationErrors.put("personalData", "PersonalData cannot be null");
		}
		if (!isUpdate && request.getName() != null && repository.findByName(request.getName().toLowerCase()).isPresent()) {
			validationErrors.put("name", "This name is used for an existing information type");
		}

		doesListContainTheCode(ListName.CATEGORY, request.getCategoryCode());
		doesListContainTheCode(ListName.SYSTEM, request.getSystemCode());

		if (request.getProducerCode() == null) {
			validationErrors.put("producerCode", "The list of producerCodes was null");
		} else {
			request.getProducerCode().forEach(code -> doesListContainTheCode(ListName.PRODUCER, code));
		}

		if(!validationErrors.isEmpty()) {
			logger.error("Validation errors occurred when validating InformationTypeRequest: {}", validationErrors);
			throw new ValidationException(validationErrors, "Validation errors occurred when validating InformationTypeRequest.");
		}
	}

	private void doesListContainTheCode(ListName listName, String code) {
		String codeType = listName.toString().toLowerCase() + "Code";
		if (code == null) {
			validationErrors.put(codeType, String.format("The %s was null", codeType));
		} else if (!codelists.get(listName).containsKey(code.toUpperCase())) {
			validationErrors.put(codeType, String.format("The code:%s was not found in the codelist:%s", code.toUpperCase(), listName));
		}
	}
}
