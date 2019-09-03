package no.nav.data.catalog.backend.app.dataset;

import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus;
import org.junit.After;
import org.junit.Test;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.Arrays;
import java.util.Optional;

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

        Dataset dataset = datasetRepository.save(datasetService.convertNewFromRequest(request, DatasetMaster.GITHUB));
        assertThat(dataset.getChildren(), hasItem(dataset1));
        assertThat(dataset.getDatasetData().getHaspart(), hasItem(dataset1.getTitle()));
    }

    private DatasetResponse findChildByTitle(DatasetResponse dataset, String title) {
        Optional<DatasetResponse> optional = dataset.getChildren().stream().filter(ds -> ds.getTitle().equals(title)).findFirst();
        assertTrue(title + " child missing from " + dataset.getTitle(), optional.isPresent());
        return optional.get();
    }

    @Test
    public void save() {
        List<DatasetRequest> requests = new ArrayList<>();
        requests.add(createRequest("createDataset"));

        datasetService.save(requests, REST);

        assertThat(datasetRepository.findAll().size(), is(nrOfDatasetsAtSetup + 1));
        assertTrue(datasetRepository.findByTitle("CREATEDATASET").isPresent());
    }

    @Test
    public void update() {
        List<DatasetRequest> requests = new ArrayList<>();
        requests.add(createRequest("updateDataset"));
        datasetService.save(requests, REST);

        assertThat(datasetRepository.findByTitle("UPDATEDATASET").get().getDatasetData().getDescription()
                , is("DatasetDescription"));

        requests.get(0).setDescription("UPDATED DESCRIPTION");
        datasetService.update(requests);

        assertThat(datasetRepository.findByTitle("UPDATEDATASET").get().getDatasetData().getDescription()
                , is("UPDATED DESCRIPTION"));
    }


    private DatasetRequest createRequest(String title) {
        return DatasetRequest.builder()
                .title(title.toUpperCase().trim())
                .description("DatasetDescription")
                .categories(List.of("PERSONALIA"))
                .provenances(List.of("Provenance"))
                .pi("false")
                .issued(localDateTime.toString())
                .keywords(List.of("Keywords"))
                .theme("Theme")
                .accessRights("AccessRights")
                .publisher("Publisher")
                .spatial("Spatial")
                .haspart("Haspart")
                .distributionChannels(List.of("DistributionChannel"))
                .build();
    }

}
