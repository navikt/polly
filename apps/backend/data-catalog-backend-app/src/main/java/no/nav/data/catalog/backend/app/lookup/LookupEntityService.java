package no.nav.data.catalog.backend.app.lookup;

import no.nav.data.catalog.backend.app.common.exceptions.DataCatalogBackendNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LookupEntityService {

	@Autowired
	private LookupEntityRepository lookupEntityRepository;

	public LookupEntity createLookupEntity(LookupEntityRequest request) {
		return lookupEntityRepository.save(mapRequestToLookupEntity(request));
	}

	public List<LookupEntity> getLookupTable() {
		return lookupEntityRepository.findAll();
	}

	public List<LookupEntity> lookupEntityType(String entity) {
		return lookupEntityRepository.findAllByEntity(entity);
	}

	public LookupEntity lookupCodeOfEntityType(String entity, String code) {
		Optional<LookupEntity> optionalLookupEntity = lookupEntityRepository.findByEntityAndCode(entity, code);
		if (optionalLookupEntity.isEmpty()) {
			throw new DataCatalogBackendNotFoundException(String.format("Cannot find description for entity: %s with code: %s", entity, code));
		}
		return optionalLookupEntity.get();
	}

	public LookupEntity updateLookupEntity(LookupEntityRequest request) {
		Optional<LookupEntity> optionalLookupEntity = lookupEntityRepository.findByEntityAndCode(request.getEntity(), request.getCode());
		if (optionalLookupEntity.isEmpty()) {
			throw new DataCatalogBackendNotFoundException(String.format("Cannot update entity: %s with code: %s.", request.getEntity(), request
					.getCode()));
		}
		LookupEntity lookupEntity = optionalLookupEntity.get();
		lookupEntity.setDescription(request.getDescription());
		return lookupEntityRepository.save(lookupEntity);
	}

	public void deleteLookupEntity(LookupEntityRequest request) {
		Optional<LookupEntity> optionalLookupEntity = lookupEntityRepository.findByEntityAndCode(request.getEntity(), request.getCode());
		if (optionalLookupEntity.isEmpty()) {
			throw new DataCatalogBackendNotFoundException(String.format("Cannot delete entity: %s with code: %s.", request.getEntity(), request
					.getCode()));
		}
		lookupEntityRepository.delete(mapRequestToLookupEntity(request));
	}

	private LookupEntity mapRequestToLookupEntity(LookupEntityRequest request) {
		return LookupEntity.builder()
				.entity(request.getEntity())
				.code(request.getCode())
				.description(request.getDescription())
				.build();
	}

}
