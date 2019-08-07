package no.nav.data.catalog.backend.test.integration.dataset;

import no.nav.data.catalog.backend.app.dataset.Dataset;
import no.nav.data.catalog.backend.app.dataset.DatasetResponse;
import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.data.domain.Example;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;

public class DatasetServiceIT extends AbstractDatasetIT {

    @Before
    public void setUp() {
        datasetRepository.deleteAll();
        datasetRepository.saveAll(Arrays.asList(dataset111, dataset11, dataset12, dataset1, unrelated));
        entityManager.clear();
    }

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
        Optional<DatasetResponse> datasetResponseOptional = datasetService.findDatasetWithAllDescendants(dataset1.getId());
        assertTrue(datasetResponseOptional.isPresent());
        DatasetResponse datasetResponse = datasetResponseOptional.get();

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
        List<DatasetResponse> allRootDatasets = datasetService.findAllRootDatasets(true);
        assertThat(allRootDatasets, hasSize(2));

        ElasticsearchStatus elasticsearchStatus = ElasticsearchStatus.TO_BE_CREATED;
        datasetRepository.findAll(Example.of(Dataset.builder().elasticsearchStatus(elasticsearchStatus).build()));
    }

    private DatasetResponse findChildByTitle(DatasetResponse dataset, String title) {
        Optional<DatasetResponse> optional = dataset.getChildren().stream().filter(ds -> ds.getTitle().equals(title)).findFirst();
        assertTrue(title + " child missing from " + dataset.getTitle(), optional.isPresent());
        return optional.get();
    }

}
