package no.nav.data.catalog.backend.app.service;

import no.nav.data.catalog.backend.app.common.exceptions.DataCatalogBackendNotFoundException;
import no.nav.data.catalog.backend.app.common.exceptions.DataCatalogBackendTechnicalException;
import no.nav.data.catalog.backend.app.model.InformationType;
import no.nav.data.catalog.backend.app.model.LookupEntity;
import no.nav.data.catalog.backend.app.model.request.InformationTypeRequest;
import no.nav.data.catalog.backend.app.repository.InformationTypeRepository;
import no.nav.data.catalog.backend.app.repository.LookupEntityRepository;
import no.nav.data.catalog.backend.app.service.mapper.InformationTypeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InformationTypeService {

	@Autowired
	private InformationTypeMapper informationTypeMapper;
	@Autowired
	private InformationTypeRepository informationTypeRepository;
	@Autowired
	private LookupEntityRepository lookupEntityRepository;


	public InformationType createInformationType(InformationTypeRequest request) {
		InformationType informationType = informationTypeMapper.mapRequestToInformationType(request, null);
		return informationTypeRepository.save(informationType);
	}

	public InformationType getInformationType(Long id) {
		Optional<InformationType> optionalInformationType = informationTypeRepository.findById(id);
		if (optionalInformationType.isEmpty()) {
			throw new DataCatalogBackendNotFoundException(String.format("Cannot find Information type with id: %s", id));
		}
		return optionalInformationType.get();
	}

	public List<InformationType> getAllInformationTypes() {
		return informationTypeRepository.findAllByOrderByInformationTypeIdAsc();
	}

	public InformationType updateInformationType(Long id, InformationTypeRequest informationTypeRequest) {
		InformationType informationTypeToBeUpdated = getInformationType(id);
		if (!informationTypeToBeUpdated.getInformationTypeName().equals(informationTypeRequest.getInformationTypeName())) {
			throw new DataCatalogBackendTechnicalException(
					String.format("Cannot update the name of an existing information type. " +
									"Information type with id: %s has the name: %s. Requested to be udated to name: %s",
							id, informationTypeToBeUpdated.getInformationTypeName(), informationTypeRequest.getInformationTypeName()));
		}
		InformationType updatedInformationType = informationTypeMapper.mapRequestToInformationType(informationTypeRequest, informationTypeToBeUpdated);
		return informationTypeRepository.save(updatedInformationType);
	}

	public void deleteInformationTypeById(Long id) {
		informationTypeRepository.deleteById(id);
	}

	public List<LookupEntity> getDecodeTable() {
		return lookupEntityRepository.findAll();
	}

	public List<LookupEntity> getAllForEntityOfDecodedTable(String entity) {
		return lookupEntityRepository.findAllByEntity(entity);
	}

	public LookupEntity getDescriptionForEntityAndCode(String entity, String code) {
		Optional<LookupEntity> optionalLookupEntity = lookupEntityRepository.findByEntityAndCode(entity, code);
		if (optionalLookupEntity.isEmpty()) {
			throw new DataCatalogBackendNotFoundException(String.format("Cannot find description for entity: %s with code: %s", entity, code));
		}
		return optionalLookupEntity.get();
	}

	public void synchToElasticsearch() {
		List<InformationType> unsynchedInformationTypes = informationTypeRepository.findBySynchedToElasticsearchFalse();

		for (InformationType informationType : unsynchedInformationTypes) {
			informationType.setJsonString(informationTypeMapper.mapInformationTypeToElasticsearchString(informationType));
			//send to elasticsearch

			//set synchedToElasticsearch=true
			informationType.setSynchedToElasticsearch(true);
			informationTypeRepository.save(informationType);
		}

	}
}
