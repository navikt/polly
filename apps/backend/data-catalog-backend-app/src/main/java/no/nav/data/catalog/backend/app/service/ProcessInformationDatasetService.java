package no.nav.data.catalog.backend.app.service;

import no.nav.data.catalog.backend.app.consumer.GithubRestConsumer;
import no.nav.data.catalog.backend.app.domain.GithubFileInfo;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;

@Component
public class ProcessInformationDatasetService {
    private GithubRestConsumer restConsumer;

    public ProcessInformationDatasetService(GithubRestConsumer restConsumer) {
        this.restConsumer = restConsumer;
    }

    public void retrieveAndSaveDataset(String filename) {
        GithubFileInfo fileInfo = restConsumer.getFileInfo(filename);
        byte[] content = null;
        if (fileInfo != null && "file".equals(fileInfo.getType())) {
            if ("base64".equals(fileInfo.getEncoding())) {
                content = Base64.decodeBase64(fileInfo.getContent().getBytes());
            }
        }
        if (content != null && content.length > 0) {
            //TODO save to elasticsearch
            System.out.println("Content: " + new String(content, StandardCharsets.UTF_8));
        }
    }
}
