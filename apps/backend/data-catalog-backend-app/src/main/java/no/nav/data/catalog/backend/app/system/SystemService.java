package no.nav.data.catalog.backend.app.system;

import no.nav.data.catalog.backend.app.common.exceptions.DataCatalogBackendNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SystemService {

	@Autowired
	private SystemRepository repository;

	public Optional<System> findSystemById(UUID id) {
		return repository.findById(id);
	}

	public Page<SystemResponse> getAllSystemsByQuery(Map<String, String> queryMap) {
		FilterSystemRequest filterRequest = new FilterSystemRequest().mapFromQuery(queryMap);
		return repository.findAll(filterRequest.getSpecification(), filterRequest.getPageable())
				.map(System::convertToResponse);
	}

	public Long getRepositoryCount() {
		return repository.count();
	}

	public List<SystemResponse> createSystems(List<SystemRequest> requests) {
		List<System> systemList = requests.stream()
				.map(request -> new System().convertFromRequest(request, false))
				.collect(Collectors.toList());

		//TODO: Her må alle berørte datasett og distribusjonskanaler updateres samtidig
		return repository.saveAll(systemList).stream()
				.map(System::convertToResponse)
				.collect(Collectors.toList());
	}

	public List<SystemResponse> updateSystems(List<SystemRequest> requests) {
		List<System> systemList = updateAndReturnAllSystemsIfAllExists(requests);

		//TODO: Her må alle berørte datasett og distribusjonskanaler updateres samtidig
		return repository.saveAll(systemList).stream()
				.map(System::convertToResponse)
				.collect(Collectors.toList());
	}

	private List<System> updateAndReturnAllSystemsIfAllExists(List<SystemRequest> requests) {
		List<System> systemList = new ArrayList<>();
		requests.forEach(request -> {
			Optional<System> optionalSystem = repository.findByName(request.getName());
			if (optionalSystem.isEmpty()) {
				throw new DataCatalogBackendNotFoundException(String.format("Cannot find system with name: %s",
						request.getName()));
			}
			systemList.add(optionalSystem.get().convertFromRequest(request, true));
		});
		return systemList;
	}

	public System deleteSystem(System system) {
		//TODO: Her må alle berørte datasett distribusjonsChannel updateres samtidig som objektet fjernes
		return repository.save(system);
	}
}
