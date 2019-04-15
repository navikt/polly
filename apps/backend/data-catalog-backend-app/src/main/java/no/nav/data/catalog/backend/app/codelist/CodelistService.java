package no.nav.data.catalog.backend.app.codelist;

import no.nav.data.catalog.backend.app.common.exceptions.DataCatalogBackendNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CodelistService {

	@Autowired
	private CodelistRepository codelistRepository;

	public Codelist createLookupEntity(CodelistRequest request) {
		return codelistRepository.save(mapRequestToLookupEntity(request));
	}

	public List<Codelist> getLookupTable() {
		return codelistRepository.findAll();
	}

	public List<Codelist> lookupEntityType(String entity) {
		return codelistRepository.findAllByEntity(entity);
	}

	public Codelist lookupCodeOfEntityType(String entity, String code) {
		Optional<Codelist> optionalLookupEntity = codelistRepository.findByEntityAndCode(entity, code);
		if (optionalLookupEntity.isEmpty()) {
			throw new DataCatalogBackendNotFoundException(String.format("Cannot find description for entity: %s with code: %s", entity, code));
		}
		return optionalLookupEntity.get();
	}

	public Codelist updateLookupEntity(CodelistRequest request) {
		Optional<Codelist> optionalLookupEntity = codelistRepository.findByEntityAndCode(request.getEntity(), request.getCode());
		if (optionalLookupEntity.isEmpty()) {
			throw new DataCatalogBackendNotFoundException(String.format("Cannot update entity: %s with code: %s.", request.getEntity(), request
					.getCode()));
		}
		Codelist codelist = optionalLookupEntity.get();
		codelist.setDescription(request.getDescription());
		return codelistRepository.save(codelist);
	}

	public void deleteLookupEntity(CodelistRequest request) {
		Optional<Codelist> optionalLookupEntity = codelistRepository.findByEntityAndCode(request.getEntity(), request.getCode());
		if (optionalLookupEntity.isEmpty()) {
			throw new DataCatalogBackendNotFoundException(String.format("Cannot delete entity: %s with code: %s.", request.getEntity(), request
					.getCode()));
		}
		codelistRepository.delete(mapRequestToLookupEntity(request));
	}

	private Codelist mapRequestToLookupEntity(CodelistRequest request) {
		return Codelist.builder()
				.entity(request.getEntity())
				.code(request.getCode())
				.description(request.getDescription())
				.build();
	}

}
