package no.nav.data.catalog.backend.app.service.mapper;

import static no.nav.data.catalog.backend.app.common.utils.Constants.INFORMATION_CATEGORY;
import static no.nav.data.catalog.backend.app.common.utils.Constants.INFORMATION_PRODUCER;
import static no.nav.data.catalog.backend.app.common.utils.Constants.INFORMATION_SYSTEM;

import no.nav.data.catalog.backend.app.common.exceptions.DataCatalogBackendNotFoundException;
import no.nav.data.catalog.backend.app.model.InformationType;
import no.nav.data.catalog.backend.app.model.LookupEntity;
import no.nav.data.catalog.backend.app.model.request.InformationTypeRequest;
import no.nav.data.catalog.backend.app.repository.LookupEntityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Component
public class InformationTypeMapper {

	@Autowired
	private LookupEntityRepository lookupEntityRepository;

	public InformationType mapRequestToInformationType(InformationTypeRequest request, InformationType informationType) {
		if (informationType == null) {    //create new InformationType
			informationType = new InformationType();
			informationType.setCreatedBy(request.getCreatedBy());
			informationType.setDateCreated(LocalDate.now().toString());
		} else {                                // update InformationType
			informationType.setUpdatedBy(request.getCreatedBy());
			informationType.setDateLastUpdated(LocalDate.now().toString());
			informationType.setSynchedToElasticsearch(false);
		}

		informationType.setInformationTypeName(request.getInformationTypeName());
		informationType.setDescription(request.getDescription());
		informationType.setPersonalData(request.getPersonalData());


		informationType.setInformationCategory(findByEntityAndCode(INFORMATION_CATEGORY, request.getInformationCategory()).getCode());
		informationType.setInformationProducer(findByEntityAndCode(INFORMATION_PRODUCER, request.getInformationProducer()).getCode());
		informationType.setInformationSystem(findByEntityAndCode(INFORMATION_SYSTEM, request.getInformationSystem()).getCode());

		return informationType;

	}

	private LookupEntity findByEntityAndCode(String entity, String code) {
		Optional<LookupEntity> optionalEntity = lookupEntityRepository.findByEntityAndCode(entity, code);
		if (optionalEntity.isEmpty()) {
			throw new DataCatalogBackendNotFoundException(String.format("Cannot find description for entity: %s and code: %s", entity, code));
		}
		return optionalEntity.get();
	}

	public String mapInformationTypeToElasticsearchString(InformationType informationType) {
		Map<String, Object> jsonMap = new HashMap<>();
		jsonMap.put("id", informationType.getInformationTypeId());
		jsonMap.put("name", informationType.getInformationTypeName());
		jsonMap.put("description", informationType.getDescription());
		jsonMap.put("informationCategory", findByEntityAndCode(INFORMATION_CATEGORY, informationType.getInformationCategory()).getDecode());
		jsonMap.put("informationProducer", findByEntityAndCode(INFORMATION_PRODUCER, informationType.getInformationProducer()).getDecode());
		jsonMap.put("informationSystem", findByEntityAndCode(INFORMATION_SYSTEM, informationType.getInformationSystem()).getDecode());
		jsonMap.put("personalData", informationType.isPersonalData());

		return jsonMap.toString();
	}

}
