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
		Optional<List<InformationType>> optinalInformationTypes = repository.findByElasticsearchStatus(TO_BE_CREATED);
		if (optinalInformationTypes.isPresent()) {
			Map<String, Object> jsonMap = null;

			for (InformationType informationType : optinalInformationTypes.get()) {
				jsonMap = informationType.convertToMap();

				elasticsearch.insertInformationType(jsonMap);

				// informationType.setJsonString(jsonMap.toString());
				informationType.setElasticsearchStatus(SYNCHED);
				repository.save(informationType);
			}
		}
	}

	private void updateInformationTypesInElasticsearch() {
		Optional<List<InformationType>> optinalInformationTypes = repository.findByElasticsearchStatus(TO_BE_UPDATED);
		if (optinalInformationTypes.isPresent()) {
			Map<String, Object> jsonMap = null;

			for (InformationType informationType : optinalInformationTypes.get()) {
				jsonMap = informationType.convertToMap();

				elasticsearch.updateInformationTypeById(informationType.getElasticsearchId(), jsonMap);

				// informationType.setJsonString(jsonMap.toString());
				informationType.setElasticsearchStatus(SYNCHED);
				repository.save(informationType);
			}
		}
	}

	private void deleteInformationTypesInElasticsearchAndInPostgres() {
		Optional<List<InformationType>> optinalInformationTypes = repository.findByElasticsearchStatus(TO_BE_DELETED);
		if (optinalInformationTypes.isPresent()) {
			Map<String, Object> jsonMap = null;

			for (InformationType informationType : optinalInformationTypes.get()) {
				elasticsearch.deleteInformationTypeById(informationType.getElasticsearchId());

				repository.deleteById(informationType.getId());
			}
		}
	}

	//TODO: resendToElasticsearch()

	public void validateRequest(InformationTypeRequest request, boolean isUpdate) throws ValidationException {
		HashMap<String, String> validationErrors = new HashMap<>();
		if (request.getName() == null ){ validationErrors.put("name", "Name must have value"); }
		if(!isUpdate && request.getName() != null && repository.findByName(request.getName().toLowerCase()).isPresent()) { validationErrors.put("name", "This name is used for an existing information type."); }
		if(!codelists.get(ListName.PRODUCER).containsKey(request.getProducer())) { validationErrors.put("producer", "The producer was null or not found in the producer codelist."); }
		if(!codelists.get(ListName.CATEGORY).containsKey(request.getCategory())) { validationErrors.put("category", "The category was null or not found in the category codelist."); }
		if(!codelists.get(ListName.SYSTEM).containsKey(request.getSystem())) { validationErrors.put("system", "The system was null or not found in the system codelist."); }
		if(request.getCreatedBy() == null || request.getCreatedBy().equals("")) { validationErrors.put("createdBy", "Created by cannot be null or empty."); }

		if(!validationErrors.isEmpty()) {
			logger.error("Validation errors occured when validating input file from Github: " + validationErrors.toString());
			throw new ValidationException(validationErrors, "Validation errors occured when validating input file from Github.");
		}
	}
}
