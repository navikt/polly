package no.nav.data.polly.dataset;

import no.nav.data.polly.codelist.CodelistStub;
import no.nav.data.polly.common.rest.PageParameters;
import no.nav.data.polly.common.rest.RestResponsePage;
import no.nav.data.polly.elasticsearch.ElasticsearchStatus;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.IntStream;

import static java.util.stream.Collectors.toList;
import static no.nav.data.polly.dataset.DatacatalogMaster.REST;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertTrue;

class DatasetControllerIT extends AbstractDatasetIT {

    @Autowired
    protected TestRestTemplate restTemplate;
    private Dataset dataset;

    @BeforeEach
    void setUp() {
        CodelistStub.initializeCodelist();
    }

    @AfterEach
    void tearDown() {
        datasetRepository.deleteAll();
    }

    @Test
    void findForId() {
        dataset = datasetRepository.save(createDataset("DatasetData"));
        ResponseEntity<Map> responseEntity = restTemplate.exchange(
                "/dataset/" + dataset.getId(), HttpMethod.GET, HttpEntity.EMPTY, Map.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody().get("title")).isEqualTo(dataset.getTitle());
    }

    @Test
    void getDatasetByTitle() {
        dataset = datasetRepository.save(createDataset("DatasetData"));
        ResponseEntity<Map> responseEntity = restTemplate.exchange(
                "/dataset/title/DatasetData", HttpMethod.GET, HttpEntity.EMPTY, Map.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody().get("title")).isEqualTo(dataset.getTitle());
    }

    @Test
    void findAllRoot() {
        datasetRepository.saveAll(List.of(unrelated, dataset111, dataset12, dataset11, dataset1));

        ResponseEntity<RestResponsePage<DatasetResponse>> responseEntity = restTemplate.exchange("/dataset/roots?includeDescendants=true",
                HttpMethod.GET, new HttpEntity<>(new PageParameters()), new ParameterizedTypeReference<RestResponsePage<DatasetResponse>>() {
                });

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(datasetRepository.findAll().size()).isEqualTo(5);
        assertThat(responseEntity.getBody().getContent().size()).isEqualTo(2);

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

        assertThat(responseUnrelated.getChildren().size()).isEqualTo(0);
        assertThat(response1.getChildren().size()).isEqualTo(2);
        assertThat(response11.getTitle()).isEqualTo("11");
        assertThat(response11.getChildren().get(0).getTitle()).isEqualTo("111");
    }

    @Test
    void findAll() {
        createDatasetTestData(30);

        ResponseEntity<RestResponsePage<DatasetResponse>> responseEntity = restTemplate.exchange("/dataset/",
                HttpMethod.GET, HttpEntity.EMPTY, new ParameterizedTypeReference<RestResponsePage<DatasetResponse>>() {
                });

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(datasetRepository.findAll().size()).isEqualTo(30);
        assertThat(responseEntity.getBody().getContent().size()).isEqualTo(20);
        assertThat(responseEntity.getBody().getPageNumber()).isEqualTo(0);
        assertThat(responseEntity.getBody().getPageSize()).isEqualTo(20);
        assertThat(responseEntity.getBody().getTotalElements()).isEqualTo(30L);
    }

    @Test
    void countAllDatasets() {
        createDatasetTestData(35);

        ResponseEntity<Long> responseEntity = restTemplate.exchange(
                "/dataset/count", HttpMethod.GET, HttpEntity.EMPTY, Long.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isEqualTo(35L);
    }

    @Test
    void createDatasets() {
        List<DatasetRequest> requests = new ArrayList<>();
        requests.add(createRequest("createTitle1"));
        requests.add(createRequest("createTitle2"));

        ResponseEntity<List> responseEntity = restTemplate.exchange(
                "/dataset", HttpMethod.POST, new HttpEntity(requests), List.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(responseEntity.getBody().size()).isEqualTo(2);
        assertThat(datasetRepository.count()).isEqualTo(2L);
        assertTrue(datasetRepository.findByTitle("createTitle1".toUpperCase()).isPresent());
        assertTrue(datasetRepository.findByTitle("createTitle2".toUpperCase()).isPresent());
    }

    @Test
    void updateDatasets() {
        createDatasetTestData(3);

        List<DatasetRequest> requests = new ArrayList<>();
        requests.add(createRequest("Dataset_nr1"));
        requests.add(createRequest("Dataset_nr2"));
        requests.add(createRequest("Dataset_nr3"));

        requests.forEach(request -> request.setDescription("UPDATED DESCRIPTION"));

        ResponseEntity<List> responseEntity = restTemplate.exchange(
                "/dataset", HttpMethod.PUT, new HttpEntity(requests), List.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody().size()).isEqualTo(3);
        assertThat(datasetRepository.count()).isEqualTo(3L);
        assertThat(datasetRepository.findByTitle("Dataset_nr1".toUpperCase())
                .get()
                .getDatasetData()
                .getDescription()).isEqualTo("UPDATED DESCRIPTION");
        assertThat(datasetRepository.findByTitle("Dataset_nr2".toUpperCase())
                .get()
                .getDatasetData()
                .getDescription()).isEqualTo("UPDATED DESCRIPTION");
        assertThat(datasetRepository.findByTitle("Dataset_nr3".toUpperCase())
                .get()
                .getDatasetData()
                .getDescription()).isEqualTo("UPDATED DESCRIPTION");
    }

    @Test
    void updateOneDatasetById() {
        createDatasetTestData(3);
        UUID id = datasetRepository.findByTitle("DATASET_NR2").get().getId();

        DatasetRequest request = createRequest("Dataset_nr2");
        request.setDescription("UPDATED DESCRIPTION");

        ResponseEntity<DatasetResponse> responseEntity = restTemplate.exchange(
                "/dataset/" + id, HttpMethod.PUT, new HttpEntity(request), DatasetResponse.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody().getDescription()).isEqualTo("UPDATED DESCRIPTION");
        assertThat(datasetRepository.count()).isEqualTo(3L);
        assertThat(datasetRepository.findByTitle("Dataset_nr1".toUpperCase())
                .get()
                .getDatasetData()
                .getDescription()).isEqualTo("DatasetDescription");
        assertThat(datasetRepository.findByTitle("Dataset_nr2".toUpperCase())
                .get()
                .getDatasetData()
                .getDescription()).isEqualTo("UPDATED DESCRIPTION");
        assertThat(datasetRepository.findByTitle("Dataset_nr3".toUpperCase())
                .get()
                .getDatasetData()
                .getDescription()).isEqualTo("DatasetDescription");
    }

    @Test
    void deleteDatasetById() {
        createDatasetTestData(3);

        List<Dataset> datasets = datasetRepository.findAll();
        datasets.forEach(d -> d.setElasticsearchStatus(ElasticsearchStatus.SYNCED));
        datasetRepository.saveAll(datasets);

        UUID id = datasetRepository.findByTitle("DATASET_NR2").get().getId();
        assertThat(datasetRepository.count()).isEqualTo(3L);
        assertThat(datasetRepository.findByTitle("Dataset_nr1".toUpperCase())
                .get()
                .getElasticsearchStatus()).isEqualTo(ElasticsearchStatus.SYNCED);
        assertThat(datasetRepository.findByTitle("Dataset_nr2".toUpperCase())
                .get()
                .getElasticsearchStatus()).isEqualTo(ElasticsearchStatus.SYNCED);
        assertThat(datasetRepository.findByTitle("Dataset_nr3".toUpperCase())
                .get()
                .getElasticsearchStatus()).isEqualTo(ElasticsearchStatus.SYNCED);

        ResponseEntity<DatasetResponse> responseEntity = restTemplate.exchange(
                "/dataset/" + id, HttpMethod.DELETE, HttpEntity.EMPTY, DatasetResponse.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.ACCEPTED);
        assertThat(datasetRepository.count()).isEqualTo(3L);
        assertThat(datasetRepository.findByTitle("Dataset_nr1".toUpperCase())
                .get()
                .getElasticsearchStatus()).isEqualTo(ElasticsearchStatus.SYNCED);
        assertThat(datasetRepository.findByTitle("Dataset_nr2".toUpperCase())
                .get()
                .getElasticsearchStatus()).isEqualTo(ElasticsearchStatus.TO_BE_DELETED);
        assertThat(datasetRepository.findByTitle("Dataset_nr3".toUpperCase())
                .get()
                .getElasticsearchStatus()).isEqualTo(ElasticsearchStatus.SYNCED);
    }

    @Test
    void testSync() {
        dataset = datasetRepository.save(createDataset("DatasetData"));

        restTemplate.postForLocation("/dataset/sync", List.of(dataset.getId()), dataset.getId());
        assertThat(datasetRepository.findById(dataset.getId()).get().getElasticsearchStatus()).isEqualTo(ElasticsearchStatus.TO_BE_UPDATED);
    }

    private void createDatasetTestData(int nrOfRows) {
        datasetRepository.saveAll(IntStream.rangeClosed(1, nrOfRows)
                .mapToObj(i -> new Dataset()
                        .convertNewFromRequest(createRequest("Dataset_nr" + i), REST))
                .collect(toList()));
    }

    private DatasetRequest createRequest(String title) {
        return DatasetRequest.builder()
                .contentType(ContentType.DATASET.name())
                .title(title.toUpperCase().trim())
                .description("DatasetDescription")
                .categories(List.of("PERSONALIA"))
                .provenances(List.of("ARBEIDSGIVER"))
                .pi("false")
                .issued(localDateTime.toString())
                .keywords(List.of("Keywords"))
                .themes(Collections.singletonList("Theme"))
                .accessRights("AccessRights")
                .publisher("Publisher")
                .spatial("Spatial")
                .build();
    }
}
