package no.nav.data.catalog.backend.app.service;

import static org.elasticsearch.common.UUIDs.base64UUID;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import no.nav.data.catalog.backend.app.common.exceptions.InformationTypeNotFoundException;
import no.nav.data.catalog.backend.app.model.Informationtype;
import no.nav.data.catalog.backend.app.repository.InformationtypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class InformationtypeService {

	@Autowired
	InformationtypeRepository informationTypeRepository;

	@Autowired
	private ObjectMapper objectMapper;

	public String createInformationtype(String jsonString) {
		String functionalId = base64UUID();
		Informationtype informationType = null;

		try {
			Map<String, Object> dataMap = getMapFromString(jsonString);
			dataMap.put("functionalId", functionalId);
			dataMap.put("dateCreated", LocalDate.now());
//			dataMap.put("createdBy", getCreatorFromRequestHeader());  //TODO: En god måte å hente inn denne informasjonen? Headers?
			Informationtype temporaryInformationtype = objectMapper.convertValue(dataMap, Informationtype.class);
			informationType = informationTypeRepository.save(temporaryInformationtype);
		} catch (IOException e) {
			e.getLocalizedMessage();
		}
		assert (informationType != null);
		return String.format("Created a new service with id=%d", informationType.getInformationtypeId());
	}

	public Informationtype getInformationtype(Long id) {
		Informationtype informationType = informationTypeRepository.findById(id).orElse(null);

		if (informationType == null) {
			throw new InformationTypeNotFoundException(String.format(
					"Could not find an service to retrieve, id=%d", id));
		}
		return informationType;
	}

//	public String updateFieldsById(Long id, String jsonString) {
//		Informationtype service = null;
//		try{
//			Map<String, Object> dataMap = getMapFromString(jsonString);
//			dataMap.put("dateLastUpdated", LocalDate.now());
////			dataMap.put("createdBy", getCreatorFromRequestHeader());  //TODO: En god måte å hente inn denne informasjonen? Headers?
//			Informationtype temporaryInformationtype = objectMapper.convertValue(dataMap, Informationtype.class);
//			service = informationTypeRepository.save(temporaryInformationtype);
//		}catch (IOException e){
//			e.getLocalizedMessage();
//		}
//		assert(service != null);
//		return String.format("Updated service with id=%d", service.getId());
//	}


	public String deleteInformationtypeById(Long id) {
		informationTypeRepository.deleteById(id);
		return String.format("Deleted service with id=%d", id);
	}

	public List<Informationtype> getAllInformationtypes(){
		return informationTypeRepository.findAllByOrderByInformationtypeIdAsc();
	}

	private Map<String, Object> getMapFromString(String jsonString) throws IOException {
		return objectMapper.readValue(jsonString, new TypeReference<Map<String, Object>>() {
		});
	}
}
