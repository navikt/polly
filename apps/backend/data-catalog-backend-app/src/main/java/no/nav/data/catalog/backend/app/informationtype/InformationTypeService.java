package no.nav.data.catalog.backend.app.informationtype;

import static no.nav.data.catalog.backend.app.common.elasticsearch.ElasticsearchStatus.SYNCHED;
import static no.nav.data.catalog.backend.app.common.elasticsearch.ElasticsearchStatus.TO_BE_CREATED;
import static no.nav.data.catalog.backend.app.common.elasticsearch.ElasticsearchStatus.TO_BE_DELETED;
import static no.nav.data.catalog.backend.app.common.elasticsearch.ElasticsearchStatus.TO_BE_UPDATED;

import no.nav.data.catalog.backend.app.common.elasticsearch.ElasticsearchService;
import no.nav.data.catalog.backend.app.common.elasticsearch.ElasticsearchStatus;
import no.nav.data.catalog.backend.app.common.exceptions.DataCatalogBackendNotFoundException;
import no.nav.data.catalog.backend.app.common.exceptions.DataCatalogBackendTechnicalException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class InformationTypeService {

	@Autowired
	private InformationTypeMapper informationTypeMapper;
	@Autowired
	private InformationTypeRepository informationTypeRepository;
	@Autowired
	private ElasticsearchService elasticsearchService;


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

	public void setInformationTypeToBeDeletedById(Long id) {
		Optional<InformationType> optionalInformationType = informationTypeRepository.findById(id);
		if (optionalInformationType.isEmpty()) {
			throw new DataCatalogBackendNotFoundException(String.format("Cannot delete information type because information type with id: %s does not exist", id));
		}

		InformationType informationTypeToBeDeleted = optionalInformationType.get();
		informationTypeToBeDeleted.setElasticsearchStatus(ElasticsearchStatus.TO_BE_DELETED.toString());
		informationTypeRepository.save(informationTypeToBeDeleted);
	}

	public void synchToElasticsearch() {
		createInformationTypesInElasticsearch();
		updateInformationTypesInElasticsearch();
		deleteInformationTypesInElasticsearchAndInPostgres();
	}

	private void createInformationTypesInElasticsearch() {
		Optional<List<InformationType>> optinalInformationTypes = informationTypeRepository.findByElasticsearchStatus(TO_BE_CREATED
				.toString());
		if (optinalInformationTypes.isPresent()) {
			Map<String, Object> jsonMap = null;

			for (InformationType informationType : optinalInformationTypes.get()) {
				jsonMap = informationTypeMapper.mapInformationTypeToElasticsearchString(informationType);

				elasticsearchService.insertInformationType(jsonMap);

				informationType.setJsonString(jsonMap.toString());
				informationType.setElasticsearchStatus(SYNCHED.toString());
				informationTypeRepository.save(informationType);
			}
		}
	}

	private void updateInformationTypesInElasticsearch() {
		Optional<List<InformationType>> optinalInformationTypes = informationTypeRepository.findByElasticsearchStatus(TO_BE_UPDATED
				.toString());
		if (optinalInformationTypes.isPresent()) {
			Map<String, Object> jsonMap = null;

			for (InformationType informationType : optinalInformationTypes.get()) {
				jsonMap = informationTypeMapper.mapInformationTypeToElasticsearchString(informationType);

				elasticsearchService.updateInformationTypeById(informationType.getElasticsearchId(), jsonMap);

				informationType.setJsonString(jsonMap.toString());
				informationType.setElasticsearchStatus(SYNCHED.toString());
				informationTypeRepository.save(informationType);
			}
		}
	}

	private void deleteInformationTypesInElasticsearchAndInPostgres() {
		Optional<List<InformationType>> optinalInformationTypes = informationTypeRepository.findByElasticsearchStatus(TO_BE_DELETED
				.toString());
		if (optinalInformationTypes.isPresent()) {
			Map<String, Object> jsonMap = null;

			for (InformationType informationType : optinalInformationTypes.get()) {
				elasticsearchService.deleteInformationTypeById(informationType.getElasticsearchId());

				informationTypeRepository.deleteById(informationType.getInformationTypeId());
			}
		}
	}

	//TODO: resendToElasticsearch()
}
