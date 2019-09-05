package no.nav.data.catalog.backend.app.dataset;

import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus;
import org.junit.After;
import org.junit.Test;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static no.nav.data.catalog.backend.app.dataset.DatasetMaster.REST;
import static org.hamcrest.CoreMatchers.hasItem;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;

public class DatasetServiceIT extends AbstractDatasetIT {

    @After
    public void tearDown() {
        datasetRepository.deleteAll();
    }

    @Test
    public void testLoad() {
        assertThat(datasetRepository.getOne(unrelated.getId()).getId(), is(unrelated.getId()));
    }

    @Test
    public void getDatasetResponseTree() {
        DatasetResponse datasetResponse = datasetService.findDatasetWithAllDescendants(dataset1.getId());

        assertThat(datasetResponse.getId(), is(dataset1.getId()));
        assertThat(datasetResponse.getChildren(), hasSize(2));
        DatasetResponse datasetResponse11 = findChildByTitle(datasetResponse, "11");
        DatasetResponse datasetResponse12 = findChildByTitle(datasetResponse, "12");
        assertThat(datasetResponse11.getChildren(), hasSize(1));
        assertThat(datasetResponse12.getChildren(), hasSize(0));
        assertThat(findChildByTitle(datasetResponse11, "111").getChildren(), hasSize(0));
    }

    @Test
    public void findRootDataset() {
        Page<DatasetResponse> allRootDatasets = datasetService.findAllRootDatasets(true, PageRequest.of(0, 20));
        assertThat(allRootDatasets.getContent(), hasSize(2));

        ElasticsearchStatus elasticsearchStatus = ElasticsearchStatus.TO_BE_CREATED;
        datasetRepository.findAll(Example.of(Dataset.builder().elasticsearchStatus(elasticsearchStatus).build()));
    }

    @Test
    public void saveDatasetWithChildren() {
        DatasetRequest request = DatasetRequest.builder()
                .title("newParent")
                .haspart(Collections.singletonList(dataset1.getTitle()))
                .build();

        Dataset dataset = datasetService.save(request, DatasetMaster.GITHUB);
        assertThat(dataset.getChildren(), hasItem(dataset1));
        assertThat(dataset.getDatasetData().getHaspart(), hasItem(dataset1.getTitle()));
    }

    private DatasetResponse findChildByTitle(DatasetResponse dataset, String title) {
        Optional<DatasetResponse> optional = dataset.getChildren()
                .stream()
                .filter(ds -> ds.getTitle().equals(title))
                .findFirst();
        assertTrue(title + " child missing from " + dataset.getTitle(), optional.isPresent());
        return optional.get();
    }

    @Test
    public void save() {
        List<DatasetRequest> requests = List.of(DatasetRequest.builder()
                .title("createDataset")
                .description("DatasetDescription")
                .build());
        int nrOfDatasetsBeforeSave = (int) datasetRepository.count();

        datasetService.saveAll(requests, REST);

        assertThat(datasetRepository.findAll().size(), is(nrOfDatasetsBeforeSave + 1));
        assertTrue(datasetRepository.findByTitle("createDataset").isPresent());
    }

    @Test
    public void update() {
        List<DatasetRequest> requests = List.of(DatasetRequest.builder()
                .title("updateDataset")
                .description("DatasetDescription")
                .build());

        datasetService.saveAll(requests, REST);

        assertThat(datasetRepository.findByTitle("updateDataset").get().getDatasetData().getDescription()
                , is("DatasetDescription"));

        requests.get(0).setDescription("UPDATED DESCRIPTION");
        datasetService.updateAll(requests);

        assertThat(datasetRepository.findByTitle("updateDataset").get().getDatasetData().getDescription()
                , is("UPDATED DESCRIPTION"));
    }
}
