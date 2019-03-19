package no.nav.data.catalog.backend.test.component;

import no.nav.data.catalog.backend.app.consumer.GithubRestConsumer;
import no.nav.data.catalog.backend.app.domain.GithubFileInfo;
import no.nav.data.catalog.backend.app.record.RecordService;
import no.nav.data.catalog.backend.app.service.ProcessInformationDatasetService;
import org.apache.tomcat.util.codec.binary.Base64;
import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.testcontainers.elasticsearch.ElasticsearchContainer;

import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.stream.Collectors;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class ProcessInformationDatasetServiceTest {
    private final String MULTIPLE_RECORDS_FILENAME = "files/InformationTypes.json";
    private final String SINGLE_RECORD_FILENAME = "files/InformationType.json";

    private GithubRestConsumer githubRestConsumer = mock(GithubRestConsumer.class);

    private RecordService recordService = mock(RecordService.class);

    private ProcessInformationDatasetService service = new ProcessInformationDatasetService(githubRestConsumer, recordService);
    String jsonMultipleRecords, jsonSingleRecord;

    @ClassRule
    public static ElasticsearchContainer container = new ElasticsearchContainer("docker.elastic.co/elasticsearch/elasticsearch-oss:6.4.1");

    // Do whatever you want with the rest client ...
    @Before
    public void before() throws URISyntaxException, IOException {
        ClassLoader loader = ClassLoader.getSystemClassLoader();
        jsonMultipleRecords = Files.lines(Paths.get(loader.getResource(MULTIPLE_RECORDS_FILENAME).toURI()))
                .parallel()
                .collect(Collectors.joining());
        jsonSingleRecord = Files.lines(Paths.get(loader.getResource(SINGLE_RECORD_FILENAME).toURI()))
                .parallel()
                .collect(Collectors.joining());
    }

    @Test
    public void retriveAndSaveMultipleDataset() throws Exception {
        GithubFileInfo inputFileInfo = new GithubFileInfo(MULTIPLE_RECORDS_FILENAME, "filpath", "sha", 1L, "url", "html_url", "git_url", "download_url", "file", new String(Base64.encodeBase64(jsonMultipleRecords.getBytes()), StandardCharsets.UTF_8), "base64");
        when(githubRestConsumer.getFileInfo(anyString(), anyString())).thenReturn(inputFileInfo);
        service.retrieveAndSaveDataset(MULTIPLE_RECORDS_FILENAME);
        container.getHttpHostAddress();
    }

    @Test
    public void retriveAndSaveSingleDataset() {
        GithubFileInfo inputFileInfo = new GithubFileInfo(SINGLE_RECORD_FILENAME, "filpath", "sha", 1L, "url", "html_url", "git_url", "download_url", "file", new String(Base64.encodeBase64(jsonSingleRecord.getBytes()), StandardCharsets.UTF_8), "base64");
        when(githubRestConsumer.getFileInfo(anyString(), anyString())).thenReturn(inputFileInfo);
        service.retrieveAndSaveDataset(SINGLE_RECORD_FILENAME);
    }

}
