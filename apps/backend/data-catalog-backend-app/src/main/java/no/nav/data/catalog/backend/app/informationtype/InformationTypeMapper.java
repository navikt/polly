package no.nav.data.catalog.backend.app.informationtype;

import static no.nav.data.catalog.backend.app.common.utils.Constants.INFORMATION_CATEGORY;
import static no.nav.data.catalog.backend.app.common.utils.Constants.INFORMATION_PRODUCER;
import static no.nav.data.catalog.backend.app.common.utils.Constants.INFORMATION_SYSTEM;
import static org.elasticsearch.common.UUIDs.base64UUID;

import no.nav.data.catalog.backend.app.codelist.Codelist;
import no.nav.data.catalog.backend.app.codelist.CodelistRepository;
import no.nav.data.catalog.backend.app.common.elasticsearch.ElasticsearchStatus;
import no.nav.data.catalog.backend.app.common.exceptions.DataCatalogBackendNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Component
public class InformationTypeMapper {

	@Autowired
	private CodelistRepository codelistRepository;

	public InformationType mapRequestToInformationType(InformationTypeRequest request, InformationType informationType) {
		if (informationType == null) {    //create new InformationType
			informationType = new InformationType();
			informationType.setCreatedBy(request.getCreatedBy());
			informationType.setDateCreated(LocalDate.now().toString());
			informationType.setElasticsearchId(base64UUID());
			informationType.setElasticsearchStatus(ElasticsearchStatus.TO_BE_CREATED.toString());
		} else {                                // update InformationType
			informationType.setUpdatedBy(request.getCreatedBy());
			informationType.setDateLastUpdated(LocalDate.now().toString());
			informationType.setElasticsearchStatus(ElasticsearchStatus.TO_BE_UPDATED.toString());
		}

		informationType.setInformationTypeName(request.getInformationTypeName());
		informationType.setDescription(request.getDescription());
		informationType.setPersonalData(request.getPersonalData());


		informationType.setInformationCategory(findByEntityAndCode(INFORMATION_CATEGORY, request.getInformationCategory()).getCode());
		informationType.setInformationProducer(findByEntityAndCode(INFORMATION_PRODUCER, request.getInformationProducer()).getCode());
		informationType.setInformationSystem(findByEntityAndCode(INFORMATION_SYSTEM, request.getInformationSystem()).getCode());

		return informationType;
	}

	private Codelist findByEntityAndCode(String entity, String code) {
		Optional<Codelist> optionalEntity = codelistRepository.findByEntityAndCode(entity, code);
		if (optionalEntity.isEmpty()) {
			throw new DataCatalogBackendNotFoundException(String.format("Cannot find description for entity: %s and code: %s", entity, code));
		}
		return optionalEntity.get();
	}

	public Map<String, Object> mapInformationTypeToElasticsearchString(InformationType informationType) {
		Map<String, Object> jsonMap = new HashMap<>();
		jsonMap.put("id", informationType.getElasticsearchId());
		jsonMap.put("informationTypeId", informationType.getInformationTypeId());
		jsonMap.put("name", informationType.getInformationTypeName());
		jsonMap.put("description", informationType.getDescription());
		jsonMap.put("informationCategory", findByEntityAndCode(INFORMATION_CATEGORY, informationType.getInformationCategory()).getDescription());
		jsonMap.put("informationProducer", findByEntityAndCode(INFORMATION_PRODUCER, informationType.getInformationProducer()).getDescription());
		jsonMap.put("informationSystem", findByEntityAndCode(INFORMATION_SYSTEM, informationType.getInformationSystem()).getDescription());
		jsonMap.put("personalData", informationType.isPersonalData());

		return jsonMap;
	}

}
