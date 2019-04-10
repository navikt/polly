package no.nav.data.catalog.backend.app.service;

import no.nav.data.catalog.backend.app.common.exceptions.DataCatalogBackendNotFoundException;
import no.nav.data.catalog.backend.app.model.InformationCategory;
import no.nav.data.catalog.backend.app.model.InformationProducer;
import no.nav.data.catalog.backend.app.model.InformationSystem;
import no.nav.data.catalog.backend.app.model.InformationType;
import no.nav.data.catalog.backend.app.model.request.InformationTypeRequest;
import no.nav.data.catalog.backend.app.repository.InformationCategoryRepository;
import no.nav.data.catalog.backend.app.repository.InformationProducerRepository;
import no.nav.data.catalog.backend.app.repository.InformationSystemRepository;
import no.nav.data.catalog.backend.app.repository.InformationTypeRepository;
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
	private InformationCategoryRepository informationCategoryRepository;
	@Autowired
	private InformationProducerRepository informationProducerRepository;
	@Autowired
	private InformationSystemRepository informationSystemRepository;

	public InformationType createInformationType(InformationTypeRequest request) {
		InformationType informationType = informationTypeMapper.mapRequestToInformationType(request, null);
		return informationTypeRepository.save(informationType);
	}

	public InformationType getInformationType(Long id) {
		Optional<InformationType> optionalInformationType = informationTypeRepository.findById(id);
		if (!optionalInformationType.isPresent()) {
			throw new DataCatalogBackendNotFoundException(String.format("Cannot find Information type with id: %s", id));
		}
		return optionalInformationType.get();
	}

	public List<InformationType> getAllInformationTypes() {
		return informationTypeRepository.findAllByOrderByInformationTypeIdAsc();
	}

	public InformationType updateInformationType(Long id, InformationTypeRequest informationTypeRequest) {
		InformationType informationType = informationTypeMapper.mapRequestToInformationType(informationTypeRequest, id);
		return informationTypeRepository.save(informationType);
	}

	public void deleteInformationTypeById(Long id) {
		informationTypeRepository.deleteById(id);
	}


	public List<InformationCategory> getInformationCategories() {
		return informationCategoryRepository.findAll();
	}

	public List<InformationProducer> getInformationProducers() {
		return informationProducerRepository.findAll();
	}

	public List<InformationSystem> getInformationSystems() {
		return informationSystemRepository.findAll();
	}
}
