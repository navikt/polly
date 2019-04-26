package no.nav.data.catalog.backend.test.integration;

import no.nav.data.catalog.backend.app.github.GithubConsumer;
import org.elasticsearch.ElasticsearchStatusException;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;


public class GetFromGithubSaveElasticsearchIT {

    @Autowired
    private GithubConsumer consumerMock;

//    @Autowired
//    private RecordService recordService;

//    @Autowired
//    private GithubService service;

//    @ClassRule
//    public static FixedElasticsearchContainer container = new FixedElasticsearchContainer("docker.elastic.co/elasticsearch/elasticsearch-oss:6.4.1");

    @Rule
    public ExpectedException expectedException = ExpectedException.none();


    @Test
    public void retriveAndSaveMultipleDataset() throws Exception {
        deleteAllFromElasticsearch();
        byte[] content = null;
        try (InputStream in = getClass().getResourceAsStream("/files/InformationTypes.json")) {
            content = in.readAllBytes();
        } catch (IOException e) {
            e.printStackTrace();
        }

//        service.handle("testdataIkkeSlett/multipleRows.json");
        //Give elasticsearch a few seconds to index documents
        Thread.sleep(2000L);
//        List<Record> recordList = recordService.getAllRecords();
//        assertEquals(6, recordList.size());
    }

    private void deleteAllFromElasticsearch() {
        List<Object> recordList = new ArrayList<>();
        try {
//            recordList = recordService.getAllRecords();
        } catch (ElasticsearchStatusException e) {
            if (!e.getMessage().contains("no such index")) {
                throw e;
            }
        }
        if (!recordList.isEmpty()) {
  //          recordList.forEach(record -> recordService.deleteRecordById(record.getId()));
        }
    }
}
