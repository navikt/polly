package no.nav.data.catalog.backend.test.integration;

import no.nav.data.catalog.backend.app.common.exceptions.DataCatalogBackendTechnicalException;
import no.nav.data.catalog.backend.app.github.GithubService;
import no.nav.data.catalog.backend.app.record.Record;
import no.nav.data.catalog.backend.app.record.RecordService;
import no.nav.data.catalog.backend.test.component.FixedElasticsearchContainer;
import org.elasticsearch.ElasticsearchStatusException;
import org.junit.ClassRule;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;

public class GetFromGithubSaveElasticsearchIT extends IntegrationTestBase {

    @Autowired
    private GithubService service;

    @Autowired
    private RecordService recordService;

    @ClassRule
    public static FixedElasticsearchContainer container = new FixedElasticsearchContainer("docker.elastic.co/elasticsearch/elasticsearch-oss:6.4.1");

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    @Test
    public void retriveAndSaveSingleDataset() throws Exception {
        deleteAllFromElasticsearch();

        service.handle("testdataIkkeSlett/singleRow.json");
        //Give elasticsearch a few seconds to index documents
        Thread.sleep(2000L);
        List<Record> recordList = recordService.getAllRecords();
        assertEquals(1, recordList.size());
    }

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
    public void retriveInvalidFile() throws Exception {
        expectedException.expect(DataCatalogBackendTechnicalException.class);
        expectedException.expectMessage("Error occurred during parse of Json in file invalidFile.json from github");

        service.handle("testdataIkkeSlett/invalidFile.json");
    }

    @Test
    public void retriveNotExistingFile() throws Exception {
        expectedException.expect(IllegalArgumentException.class);
        expectedException.expectMessage("Calling Github to download file failed with status=404 NOT_FOUND. The file does not exist");

        service.handle("testdataIkkeSlett/notExistingFile.json");
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
