package no.nav.data.catalog.backend.test.component;

import no.nav.data.catalog.backend.app.consumer.GithubRestConsumer;
import no.nav.data.catalog.backend.app.record.Record;
import no.nav.data.catalog.backend.app.record.RecordService;
import no.nav.data.catalog.backend.app.service.ProcessInformationDatasetService;
import org.apache.http.HttpHost;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.elasticsearch.client.RestClient;
import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = ComponentTestConfig.class)
public class ProcessInformationDatasetServiceTest {
    private final String MULTIPLE_RECORDS_FILENAME = "files/InformationTypes.json";
    private final String SINGLE_RECORD_FILENAME = "files/InformationType.json";

    @Autowired
    private GithubRestConsumer githubRestConsumer;

    @Autowired
    private ProcessInformationDatasetService service;

    @Autowired
    private RecordService recordService;

    String jsonMultipleRecords, jsonSingleRecord;

    private RestClient restClient;

    @ClassRule
    public static FixedElasticsearchContainer container = new FixedElasticsearchContainer("docker.elastic.co/elasticsearch/elasticsearch-oss:6.4.1");

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

        final CredentialsProvider credentialsProvider = new BasicCredentialsProvider();
//        credentialsProvider.setCredentials(AuthScope.ANY, new UsernamePasswordCredentials("elastic", "changeme"));
        restClient = RestClient.builder(HttpHost.create(container.getHttpHostAddress()))
                .setHttpClientConfigCallback(httpClientBuilder -> httpClientBuilder.setDefaultCredentialsProvider(credentialsProvider))
                .build();
    }

    @Test
    public void retriveAndSaveMultipleDataset() throws Exception {
        service.retrieveAndSaveDataset("testdataIkkeSlett/multipleRows.json");
        //Give elasticsearch a few seconds to index documents
        Thread.sleep(5000L);
        List<Record> recordList = recordService.getAllRecords();
        assertEquals(6, recordList.size());
    }

    @Test
    public void retriveAndSaveSingleDataset()  throws Exception{
        service.retrieveAndSaveDataset("testdataIkkeSlett/singleRow.json");
        //Give elasticsearch a few seconds to index documents
        Thread.sleep(5000L);
        List<Record> recordList = recordService.getAllRecords();
        assertEquals(7, recordList.size());
    }

}
