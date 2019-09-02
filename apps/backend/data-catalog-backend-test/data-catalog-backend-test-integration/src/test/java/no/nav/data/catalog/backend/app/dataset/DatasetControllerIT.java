package no.nav.data.catalog.backend.app.dataset;

import no.nav.data.catalog.backend.app.common.rest.PageParameters;
import no.nav.data.catalog.backend.app.common.rest.RestResponsePage;
import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.IntStream;

import static java.util.stream.Collectors.toList;
import static no.nav.data.catalog.backend.app.dataset.DatasetMaster.REST;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;

public class DatasetControllerIT extends AbstractDatasetIT {

    @Autowired
    protected TestRestTemplate restTemplate;

    private static final LocalDateTime localDateTime = LocalDateTime.now();

    private final Dataset dataset = Dataset.builder()
            .id(UUID.randomUUID())
            .generateElasticsearchId()
            .elasticsearchStatus(ElasticsearchStatus.SYNCED)
            .datasetData(DatasetData.builder()
                    .title("DatasetData")
                    .description("Description")
                    .categories(List.of("Category"))
                    .provenances(List.of("Provenance"))
                    .pi(false)
                    .issued(localDateTime)
                    .keywords(List.of("Keywords"))
                    .theme("Theme")
                    .accessRights("AccesRights")
                    .publisher("Publisher")
                    .spatial("Spatial")
                    .haspart("Haspart")
                    .master(REST)
                    .build())
            .build();

    @Before
    public void setUp() {
        datasetRepository.deleteAll();
//        datasetRepository.saveAll(Arrays.asList(dataset111, dataset11, dataset12, dataset1, unrelated));
        entityManager.clear();

    }

    @After
    public void tearDown() {
        datasetRepository.deleteAll();
    }

    @Test
    public void findForId() {
        datasetRepository.save(dataset);

        ResponseEntity<Map> responseEntity = restTemplate.exchange(
                "/dataset/" + dataset.getId(), HttpMethod.GET, HttpEntity.EMPTY, Map.class);

        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(responseEntity.getBody().get("title"), is("DatasetData"));
    }

    @Test
    public void getDatasetByTitle() {
        datasetRepository.save(dataset);

        ResponseEntity<Map> responseEntity = restTemplate.exchange(
                "/dataset/title/DatasetData", HttpMethod.GET, HttpEntity.EMPTY, Map.class);

        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(responseEntity.getBody().get("id"), is(dataset.getId().toString()));
    }

    @Test
    public void findAllRoot() {
        datasetRepository.saveAll(List.of(unrelated, dataset111, dataset12, dataset11, dataset1));

        ResponseEntity<RestResponsePage<DatasetResponse>> responseEntity = restTemplate.exchange("/dataset/roots?includeDescendants=true",
                HttpMethod.GET, new HttpEntity<>(new PageParameters()), new ParameterizedTypeReference<RestResponsePage<DatasetResponse>>() {
                });

        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(datasetRepository.findAll().size(), is(5));
        assertThat(responseEntity.getBody().getContent().size(), is(2));

        DatasetResponse responseUnrelated = responseEntity.getBody().getContent().stream()
                .filter(datasetResponse -> datasetResponse.getTitle().equals("unrelated"))
                .findFirst()
                .get();
        DatasetResponse response1 = responseEntity.getBody().getContent().stream()
                .filter(datasetResponse -> datasetResponse.getTitle().equals("1"))
                .findFirst()
                .get();
        DatasetResponse response11 = response1.getChildren().stream()
                .filter(datasetResponse -> datasetResponse.getChildren().size() > 0).findFirst().get();

        assertThat(responseUnrelated.getChildren().size(), is(0));
        assertThat(response1.getChildren().size(), is(2));
        assertThat(response11.getTitle(), is("11"));
        assertThat(response11.getChildren().get(0).getTitle(), is("111"));
    }

    @Test
    public void findAll() {
        createDatasetTestData(30);

        ResponseEntity<RestResponsePage<DatasetResponse>> responseEntity = restTemplate.exchange("/dataset/",
                HttpMethod.GET, HttpEntity.EMPTY, new ParameterizedTypeReference<RestResponsePage<DatasetResponse>>() {
                });

        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(datasetRepository.findAll().size(), is(30));
        assertThat(responseEntity.getBody().getContent().size(), is(20));
        assertThat(responseEntity.getBody().getCurrentPage(), is(0));
        assertThat(responseEntity.getBody().getPageSize(), is(20));
        assertThat(responseEntity.getBody().getTotalElements(), is(30L));
    }

    @Test
    public void countAllDatasets() {
        createDatasetTestData(35);

        ResponseEntity<Long> responseEntity = restTemplate.exchange(
                "/dataset/count", HttpMethod.GET, HttpEntity.EMPTY, Long.class);

        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(responseEntity.getBody(), is(35L));
    }

    @Test
    public void createDatasets() {
        List<DatasetRequest> requests = new ArrayList<>();
        requests.add(createRequest("createTitle1"));
        requests.add(createRequest("createTitle2"));

        ResponseEntity<List> responseEntity = restTemplate.exchange(
                "/dataset", HttpMethod.POST, new HttpEntity(requests), List.class);

        assertThat(responseEntity.getStatusCode(), is(HttpStatus.ACCEPTED));
        assertThat(responseEntity.getBody().size(), is(2));
        assertThat(datasetRepository.count(), is(2L));
        assertTrue(datasetRepository.findByTitle("createTitle1".toUpperCase()).isPresent());
        assertTrue(datasetRepository.findByTitle("createTitle2".toUpperCase()).isPresent());
    }

    @Test
    public void updateDatasets() {
        createDatasetTestData(3);

        List<DatasetRequest> requests = new ArrayList<>();
        requests.add(createRequest("Dataset_nr1"));
        requests.add(createRequest("Dataset_nr2"));
        requests.add(createRequest("Dataset_nr3"));

        requests.forEach(request -> request.setDescription("UPDATED DESCRIPTION"));

        ResponseEntity<List> responseEntity = restTemplate.exchange(
                "/dataset", HttpMethod.PUT, new HttpEntity(requests), List.class);

        assertThat(responseEntity.getStatusCode(), is(HttpStatus.ACCEPTED));
        assertThat(responseEntity.getBody().size(), is(3));
        assertThat(datasetRepository.count(), is(3L));
        assertThat(datasetRepository.findByTitle("Dataset_nr1".toUpperCase())
                .get()
                .getDatasetData()
                .getDescription(), is("UPDATED DESCRIPTION"));
        assertThat(datasetRepository.findByTitle("Dataset_nr2".toUpperCase())
                .get()
                .getDatasetData()
                .getDescription(), is("UPDATED DESCRIPTION"));
        assertThat(datasetRepository.findByTitle("Dataset_nr3".toUpperCase())
                .get()
                .getDatasetData()
                .getDescription(), is("UPDATED DESCRIPTION"));
    }

    @Test
    public void updateOneDatasetById() {
        createDatasetTestData(3);
        UUID id = datasetRepository.findByTitle("DATASET_NR2").get().getId();

        DatasetRequest request = createRequest("Dataset_nr2");
        request.setDescription("UPDATED DESCRIPTION");

        ResponseEntity<DatasetResponse> responseEntity = restTemplate.exchange(
                "/dataset/" + id, HttpMethod.PUT, new HttpEntity(request), DatasetResponse.class);

        assertThat(responseEntity.getStatusCode(), is(HttpStatus.ACCEPTED));
        assertThat(responseEntity.getBody().getDescription(), is("UPDATED DESCRIPTION"));
        assertThat(datasetRepository.count(), is(3L));
        assertThat(datasetRepository.findByTitle("Dataset_nr1".toUpperCase())
                .get()
                .getDatasetData()
                .getDescription(), is("DatasetDescription"));
        assertThat(datasetRepository.findByTitle("Dataset_nr2".toUpperCase())
                .get()
                .getDatasetData()
                .getDescription(), is("UPDATED DESCRIPTION"));
        assertThat(datasetRepository.findByTitle("Dataset_nr3".toUpperCase())
                .get()
                .getDatasetData()
                .getDescription(), is("DatasetDescription"));
    }

    @Test
    public void deleteDatasetById() {
        createDatasetTestData(3);

        List<Dataset> datasets = datasetRepository.findAll();
        datasets.forEach(d -> d.setElasticsearchStatus(ElasticsearchStatus.SYNCED));
        datasetRepository.saveAll(datasets);

        UUID id = datasetRepository.findByTitle("DATASET_NR2").get().getId();
        assertThat(datasetRepository.count(), is(3L));
        assertThat(datasetRepository.findByTitle("Dataset_nr1".toUpperCase())
                .get()
                .getElasticsearchStatus(), is(ElasticsearchStatus.SYNCED));
        assertThat(datasetRepository.findByTitle("Dataset_nr2".toUpperCase())
                .get()
                .getElasticsearchStatus(), is(ElasticsearchStatus.SYNCED));
        assertThat(datasetRepository.findByTitle("Dataset_nr3".toUpperCase())
                .get()
                .getElasticsearchStatus(), is(ElasticsearchStatus.SYNCED));


        ResponseEntity<DatasetResponse> responseEntity = restTemplate.exchange(
                "/dataset/" + id, HttpMethod.DELETE, HttpEntity.EMPTY, DatasetResponse.class);

        assertThat(responseEntity.getStatusCode(), is(HttpStatus.ACCEPTED));
        assertThat(datasetRepository.count(), is(3L));
        assertThat(datasetRepository.findByTitle("Dataset_nr1".toUpperCase())
                .get()
                .getElasticsearchStatus(), is(ElasticsearchStatus.SYNCED));
        assertThat(datasetRepository.findByTitle("Dataset_nr2".toUpperCase())
                .get()
                .getElasticsearchStatus(), is(ElasticsearchStatus.TO_BE_DELETED));
        assertThat(datasetRepository.findByTitle("Dataset_nr3".toUpperCase())
                .get()
                .getElasticsearchStatus(), is(ElasticsearchStatus.SYNCED));
    }

    private void createDatasetTestData(int nrOfRows) {
        datasetRepository.saveAll(IntStream.rangeClosed(1, nrOfRows)
                .mapToObj(i -> new Dataset()
                        .convertNewFromRequest(createRequest("Dataset_nr" + i), REST))
                .collect(toList()));
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
