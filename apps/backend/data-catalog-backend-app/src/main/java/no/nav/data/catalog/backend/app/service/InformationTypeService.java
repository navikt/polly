package no.nav.data.catalog.backend.app.service;

import no.nav.data.catalog.backend.app.common.exceptions.DataCatalogBackendNotFoundException;
import no.nav.data.catalog.backend.app.model.InformationType;
import no.nav.data.catalog.backend.app.model.mapper.InformationTypeMapper;
import no.nav.data.catalog.backend.app.model.request.InformationTypeRequest;
import no.nav.data.catalog.backend.app.repository.InformationTypeRepository;
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
}
