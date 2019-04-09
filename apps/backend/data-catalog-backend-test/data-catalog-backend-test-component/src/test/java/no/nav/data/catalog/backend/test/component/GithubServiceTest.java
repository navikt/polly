package no.nav.data.catalog.backend.test.component;

import no.nav.data.catalog.backend.app.common.exceptions.DataCatalogBackendTechnicalException;
import no.nav.data.catalog.backend.app.github.GithubConsumer;
import no.nav.data.catalog.backend.app.github.domain.GithubFile;
import no.nav.data.catalog.backend.app.record.Record;
import no.nav.data.catalog.backend.app.record.RecordService;
import no.nav.data.catalog.backend.app.github.GithubService;
import org.elasticsearch.ElasticsearchStatusException;
import org.junit.*;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.when;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = ComponentTestConfig.class)
@ActiveProfiles("test")
@Ignore
public class GithubServiceTest {

    @Mock
    private GithubConsumer consumerMock;

    @InjectMocks
    private GithubService service;

    @Autowired
    private RecordService recordService;

    @ClassRule
    public static FixedElasticsearchContainer container = new FixedElasticsearchContainer("docker.elastic.co/elasticsearch/elasticsearch-oss:6.4.1");

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    @Test
    public void retriveAndSaveMultipleDataset() throws Exception {
        deleteAllFromElasticsearch();
        service.handle("testdataIkkeSlett/multipleRows.json");
        //Give elasticsearch a few seconds to index documents
        Thread.sleep(2000L);
        List<Record> recordList = recordService.getAllRecords();
        assertEquals(6, recordList.size());
    }

    @Test
    public void retriveAndSaveSingleDataset()  throws Exception{
        deleteAllFromElasticsearch();
        service.handle("testdataIkkeSlett/singleRow.json");
        //Give elasticsearch a few seconds to index documents
        Thread.sleep(2000L);
        List<Record> recordList = recordService.getAllRecords();
        assertEquals(1, recordList.size());
    }

    @Test
    public void retriveAndSaveNotExistingFile() {
        expectedException.expect(IllegalArgumentException.class);
        expectedException.expectMessage("The file does not exist");
        service.handle("notExisting.json");
    }

    @Test
    public void retriveAndSaveFileNotValid() {
        expectedException.expect(DataCatalogBackendTechnicalException.class);
        expectedException.expectMessage("Error occurred during parse of Json in file");
        service.handle("testdataIkkeSlett/invalidFile.json");
    }


    private void deleteAllFromElasticsearch() {
        List<Record> recordList = new ArrayList<>();
        try {
            recordList = recordService.getAllRecords();
        } catch (ElasticsearchStatusException e) {
            if (!e.getMessage().contains("no such index")) {
                throw e;
            }
        }
        if (!recordList.isEmpty()) {
            recordList.forEach(record -> recordService.deleteRecordById(record.getId()));
        }
    }
}
