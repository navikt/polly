package no.nav.data.polly.dataset;

import no.nav.data.polly.elasticsearch.ElasticsearchStatus;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static no.nav.data.polly.dataset.DatacatalogMaster.REST;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertTrue;

@Disabled
class DatasetServiceIT extends AbstractDatasetIT {

    @BeforeEach
    void setUp() throws Exception {
        saveDatasets();
    }

    @AfterEach
    void tearDown() {
        datasetRepository.deleteAll();
    }

    @Test
    void testLoad() {
        assertThat(datasetRepository.getOne(unrelated.getId()).getId()).isEqualTo(unrelated.getId());
    }

    @Test
    void getDatasetResponseTree() {
        DatasetResponse datasetResponse = datasetService.findDatasetWithAllDescendants(dataset1.getId());

        assertThat(datasetResponse.getTitle()).isEqualTo(dataset1.getTitle());
        assertThat(datasetResponse.getChildren()).hasSize(2);
        DatasetResponse datasetResponse11 = findChildByTitle(datasetResponse, "11");
        DatasetResponse datasetResponse12 = findChildByTitle(datasetResponse, "12");
        assertThat(datasetResponse11.getChildren()).hasSize(1);
        assertThat(datasetResponse12.getChildren()).hasSize(0);
        assertThat(findChildByTitle(datasetResponse11, "111").getChildren()).hasSize(0);
    }

    @Test
    void findRootDataset() {
        Page<DatasetResponse> allRootDatasets = datasetService.findAllRootDatasets(true, PageRequest.of(0, 20));
        assertThat(allRootDatasets.getContent()).hasSize(2);

        ElasticsearchStatus elasticsearchStatus = ElasticsearchStatus.TO_BE_CREATED;
        datasetRepository.findAll(Example.of(Dataset.builder().elasticsearchStatus(elasticsearchStatus).build()));
    }

    @Test
    void saveDatasetWithChildren() {
        DatasetRequest request = DatasetRequest.builder()
                .title("newParent")
                .haspart(Collections.singletonList(dataset1.getTitle()))
                .build();

        Dataset dataset = datasetService.save(request, DatacatalogMaster.GITHUB);
        assertThat(dataset.getChildren()).contains(dataset1);
        assertThat(dataset.getDatasetData().getHaspart()).contains(dataset1.getTitle());
    }

    private DatasetResponse findChildByTitle(DatasetResponse dataset, String title) {
        Optional<DatasetResponse> optional = dataset.getChildren()
                .stream()
                .filter(ds -> ds.getTitle().equals(title))
                .findFirst();
        assertTrue(optional.isPresent(), title + " child missing from " + dataset.getTitle());
        return optional.get();
    }

    @Test
    void save() {
        List<DatasetRequest> requests = List.of(DatasetRequest.builder()
                .title("createDataset")
                .description("DatasetDescription")
                .build());
        int nrOfDatasetsBeforeSave = (int) datasetRepository.count();

        datasetService.saveAll(requests, REST);

        assertThat(datasetRepository.findAll().size()).isEqualTo(nrOfDatasetsBeforeSave + 1);
        assertTrue(datasetRepository.findByTitle("createDataset").isPresent());
    }

    @Test
    void update() {
        List<DatasetRequest> requests = List.of(DatasetRequest.builder()
                .title("updateDataset")
                .description("DatasetDescription")
                .datacatalogMaster(REST)
                .build());

        datasetService.saveAll(requests, REST);

        assertThat(datasetRepository.findByTitle("updateDataset").get().getDatasetData().getDescription()
        ).isEqualTo("DatasetDescription");

        requests.get(0).setDescription("UPDATED DESCRIPTION");
        datasetService.updateAll(requests);

        assertThat(datasetRepository.findByTitle("updateDataset").get().getDatasetData().getDescription()
        ).isEqualTo("UPDATED DESCRIPTION");
    }
}
