package no.nav.data.catalog.backend.app.github;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import no.nav.data.catalog.backend.app.common.exceptions.DataCatalogBackendTechnicalException;
import no.nav.data.catalog.backend.app.common.exceptions.ValidationException;
import no.nav.data.catalog.backend.app.informationtype.InformationType;
import no.nav.data.catalog.backend.app.informationtype.InformationTypeRepository;
import no.nav.data.catalog.backend.app.informationtype.InformationTypeRequest;
import no.nav.data.catalog.backend.app.informationtype.InformationTypeService;
import no.nav.data.catalog.backend.app.record.Record;
import no.nav.data.catalog.backend.app.record.RecordService;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class GithubService {

    @Autowired
    private GithubConsumer restConsumer;

    @Autowired
    private RecordService recordService;

    @Autowired
    private InformationTypeService service;

    @Autowired
    private InformationTypeRepository repository;

    public void handle(String filename) {

    }

    private void saveAsString(List<Record> informationTypes) {
        ObjectMapper mapper = new ObjectMapper();

        if(informationTypes != null) {
            informationTypes.forEach(r -> {
                try {
                    recordService.insertRecord(mapper.writeValueAsString(r)); // TODO: Write in batch - not as individual inserts. Add transactions.
                } catch (JsonProcessingException e) {
                    throw new DataCatalogBackendTechnicalException(String.format("Error occurred during parse of Json in file %s from github ", r.getName()), e);
                }
            });
        }
    }
}
