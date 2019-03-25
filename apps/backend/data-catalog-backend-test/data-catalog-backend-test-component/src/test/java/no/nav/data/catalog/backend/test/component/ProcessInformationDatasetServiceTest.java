package no.nav.data.catalog.backend.test.component;

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
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

import static org.junit.Assert.assertEquals;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = ComponentTestConfig.class)
@ActiveProfiles("test")
public class ProcessInformationDatasetServiceTest {
    private RestClient restClient;

    @Autowired
    private ProcessInformationDatasetService service;

    @Autowired
    private RecordService recordService;

    @ClassRule
    public static FixedElasticsearchContainer container = new FixedElasticsearchContainer("docker.elastic.co/elasticsearch/elasticsearch-oss:6.4.1");

    @Before
    public void before() {
        final CredentialsProvider credentialsProvider = new BasicCredentialsProvider();
        restClient = RestClient.builder(HttpHost.create(container.getHttpHostAddress()))
                .setHttpClientConfigCallback(httpClientBuilder -> httpClientBuilder.setDefaultCredentialsProvider(credentialsProvider))
                .build();
    }

    @Test
    public void retriveAndSaveMultipleDataset() throws Exception {
        service.retrieveAndSaveDataset("testdataIkkeSlett/multipleRows.json");
        //Give elasticsearch a few seconds to index documents
        Thread.sleep(2000L);
        List<Record> recordList = recordService.getAllRecords();
        assertEquals(6, recordList.size());
    }

    @Test
    public void retriveAndSaveSingleDataset()  throws Exception{
        service.retrieveAndSaveDataset("testdataIkkeSlett/singleRow.json");
        //Give elasticsearch a few seconds to index documents
        Thread.sleep(2000L);
        List<Record> recordList = recordService.getAllRecords();
        assertEquals(7, recordList.size());
    }
}
