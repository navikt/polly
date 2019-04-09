package no.nav.data.catalog.backend.app.model.mapper;

import no.nav.data.catalog.backend.app.common.exceptions.DataCatalogBackendNotFoundException;
import no.nav.data.catalog.backend.app.model.InformationCategory;
import no.nav.data.catalog.backend.app.model.InformationProducer;
import no.nav.data.catalog.backend.app.model.InformationSystem;
import no.nav.data.catalog.backend.app.model.InformationType;
import no.nav.data.catalog.backend.app.model.request.InformationTypeRequest;
import no.nav.data.catalog.backend.app.repository.InformationCategoryRepository;
import no.nav.data.catalog.backend.app.repository.InformationProducerRepository;
import no.nav.data.catalog.backend.app.repository.InformationSystemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Optional;

@Component
public class InformationTypeMapper {

	@Autowired
	private InformationCategoryRepository informationCategoryRepository;
	@Autowired
	private InformationProducerRepository informationProducerRepository;
	@Autowired
	private InformationSystemRepository informationSystemRepository;

	public InformationType mapRequestToInformationType(InformationTypeRequest request, Long id) {
		InformationType informationType = new InformationType();

		informationType.setInformationTypeName(request.getInformationTypeName());
		informationType.setDescription(request.getDescription());


		Optional<InformationCategory> optionalCategory = informationCategoryRepository.findById(request.getInformationCategoryId());
		if (!optionalCategory.isPresent()) {
			throw new DataCatalogBackendNotFoundException(String.format("Cannot find information category with id: %s", request.getInformationCategoryId()));
		}
		informationType.setInformationCategory(optionalCategory.get());

		Optional<InformationProducer> optionalProducer = informationProducerRepository.findById(request.getInformationProducerId());
		if (!optionalProducer.isPresent()) {
			throw new DataCatalogBackendNotFoundException(String.format("Cannot find information producer with id: %s", request.getInformationProducerId()));
		}
		informationType.setInformationProducer(optionalProducer.get());

		Optional<InformationSystem> optionalSystem = informationSystemRepository.findById(request.getInformationSystemId());
		if (!optionalSystem.isPresent()) {
			throw new DataCatalogBackendNotFoundException(String.format("Cannot find information system with id: %s", request.getInformationSystemId()));
		}
		informationType.setInformationSystem(optionalSystem.get());

		if (id == null) {            //create new InformationType
			informationType.setCreatedBy(request.getCreatedBy());
			informationType.setDateCreated(LocalDate.now());
		} else {                        // update Informationtype
			informationType.setUpdatedBy(request.getCreatedBy());
			informationType.setDateLastUpdated(LocalDate.now());
			informationType.setInformationTypeId(id);
		}

		return informationType;
	}

}
