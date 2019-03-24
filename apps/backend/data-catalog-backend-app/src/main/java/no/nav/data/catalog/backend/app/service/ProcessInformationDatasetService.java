package no.nav.data.catalog.backend.app.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import no.nav.data.catalog.backend.app.common.exceptions.DataCatalogBackendTechnicalException;
import no.nav.data.catalog.backend.app.consumer.GithubRestConsumer;
import no.nav.data.catalog.backend.app.domain.GithubFileInfo;
import no.nav.data.catalog.backend.app.domain.GithubInformationType;
import no.nav.data.catalog.backend.app.record.RecordService;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

import static no.nav.data.catalog.backend.app.common.tokensupport.JwtTokenGenerator.generateToken;

@Component
public class ProcessInformationDatasetService {
    private GithubRestConsumer restConsumer;
    private RecordService recordService;


    public ProcessInformationDatasetService(GithubRestConsumer restConsumer,
                                            RecordService recordService) {
        this.restConsumer = restConsumer;
        this.recordService = recordService;
    }

    public void retrieveAndSaveDataset(String filename) {
        String installationToken = getInstallationToken("C:\\Visma\\projects\\nav\\data-catalog-backend\\travis\\datajegerne-private-key.pem");
        //TODO Running withour token only works as long as pol-datasett repo is public
        GithubFileInfo fileInfo = restConsumer.getFileInfo(filename, installationToken);
        byte[] content = null;
        if (fileInfo != null && "file".equals(fileInfo.getType())) {
            if ("base64".equals(fileInfo.getEncoding())) {
                content = Base64.decodeBase64(fileInfo.getContent().getBytes());
            }
        }
        if (content != null && content.length > 0) {
            ObjectMapper mapper = new ObjectMapper();
            String jsonString = new String(content, StandardCharsets.UTF_8).trim();
            if (!jsonString.startsWith("[")) {
                jsonString = "[" + jsonString + "]";
            }
            try {
                List<GithubInformationType> recordList = mapper.readValue(jsonString, new TypeReference<List<GithubInformationType>>() {
                });
                recordList.forEach(row -> {
                    try {
                        recordService.insertRecord(mapper.writeValueAsString(row));
                    } catch (JsonProcessingException e) {
                        throw new DataCatalogBackendTechnicalException(String.format("Error occurred during parse of Json in file %s from github", fileInfo.getName()), e);
                    }
                });
            } catch (JsonProcessingException e) {
                throw new DataCatalogBackendTechnicalException(String.format("Error occurred during parse of Json in file %s from github", fileInfo.getName()), e);
            } catch (IOException e) {
                throw new DataCatalogBackendTechnicalException(String.format("Error occurred during parse of Json in file %s from github", fileInfo.getName()), e);
            }
        }
    }

    private String getInstallationToken(String absoluteFilePath) {
        String jwtToken = generateToken(absoluteFilePath);
        String installationId = restConsumer.getInstallationId(jwtToken);
        String installationToken = restConsumer.getInstallationToken(installationId, jwtToken);
        return installationToken;
    }
}
