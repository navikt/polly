package no.nav.data.catalog.backend.app.github;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import no.nav.data.catalog.backend.app.common.exceptions.DataCatalogBackendTechnicalException;
import no.nav.data.catalog.backend.app.github.domain.GithubFile;
import no.nav.data.catalog.backend.app.record.Record;
import no.nav.data.catalog.backend.app.record.RecordService;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
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

    public void handle(String filename) {
        List<Record> records = mapToObject(restConsumer.getFile(filename));
        saveAsString(records);
    }

    private List<Record> mapToObject(GithubFile file) {
        byte[] content = null;
        if (file != null && "file".equals(file.getType())) {
            if ("base64".equals(file.getEncoding())) {
                content = Base64.decodeBase64(file.getContent().getBytes());
            }
        }

        if (content != null && content.length > 0) {
            ObjectMapper mapper = new ObjectMapper();
            String jsonString = new String(content, StandardCharsets.UTF_8).trim();

            // make array
            if (!jsonString.startsWith("[")) {
                jsonString = "[" + jsonString + "]";
            }
            try {
                return mapper.readValue(jsonString, new TypeReference<List<Record>>() {});
            } catch (IOException e) {
                throw new DataCatalogBackendTechnicalException(String.format("Error occurred during parse of Json in file %s from github ", file.getName()), e);
            }
        }

        return null;
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
