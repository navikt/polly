package no.nav.data.catalog.backend.app.informationtype;

import static no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus.SYNCHED;
import static no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus.TO_BE_CREATED;
import static no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus.TO_BE_DELETED;
import static no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus.TO_BE_UPDATED;

import no.nav.data.catalog.backend.app.codelist.CodelistService;
import no.nav.data.catalog.backend.app.codelist.ListName;
import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchRepository;
import no.nav.data.catalog.backend.app.common.exceptions.DataCatalogBackendNotFoundException;
import no.nav.data.catalog.backend.app.common.exceptions.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static no.nav.data.catalog.backend.app.codelist.CodelistService.codelists;

@Service
public class InformationTypeService {

	@Autowired
	private InformationTypeRepository repository;

	@Autowired
	private ElasticsearchRepository elasticsearch;

	public void synchToElasticsearch() {
		createInformationTypesInElasticsearch();
		updateInformationTypesInElasticsearch();
		deleteInformationTypesInElasticsearchAndInPostgres();
	}

	private void createInformationTypesInElasticsearch() {
		Optional<List<InformationType>> optinalInformationTypes = repository.findByElasticsearchStatus(TO_BE_CREATED
				.toString());
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
		Optional<List<InformationType>> optinalInformationTypes = repository.findByElasticsearchStatus(TO_BE_UPDATED
				.toString());
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
		Optional<List<InformationType>> optinalInformationTypes = repository.findByElasticsearchStatus(TO_BE_DELETED
				.toString());
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
		if (!isUpdate && request.getName() == null ){ validationErrors.put("name", "Name must have value"); }
		if(!isUpdate && request.getName() != null && repository.findByName(request.getName().toLowerCase()).isPresent()) { validationErrors.put("name", "This name is used for an existing information type.."); }
		if(!codelists.get(ListName.PRODUCER).containsKey(request.getProducer())) { validationErrors.put("producer", "The producer was null or not found in the producer codelist."); }
		if(!codelists.get(ListName.CATEGORY).containsKey(request.getCategory())) { validationErrors.put("category", "The category was null or not found in the category codelist."); }
		if(!codelists.get(ListName.SYSTEM).containsKey(request.getSystem())) { validationErrors.put("system", "The system was null or not found in the system codelist."); }
		if(request.getCreatedBy() == null || request.getCreatedBy().equals("")) { validationErrors.put("createdBy", "Created by cannot be null or empty."); }

		if(!validationErrors.isEmpty()) {
			throw new ValidationException(validationErrors);
		}
	}
}
