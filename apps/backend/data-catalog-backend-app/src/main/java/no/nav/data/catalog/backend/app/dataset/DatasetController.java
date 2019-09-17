package no.nav.data.catalog.backend.app.dataset;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.catalog.backend.app.common.exceptions.ValidationException;
import no.nav.data.catalog.backend.app.common.rest.PageParameters;
import no.nav.data.catalog.backend.app.common.rest.RestResponsePage;
import no.nav.data.catalog.backend.app.common.utils.StreamUtils;
import no.nav.data.catalog.backend.app.dataset.repo.DatasetRepository;
import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchDatasetService;
import no.nav.data.catalog.backend.app.elasticsearch.domain.DatasetElasticsearch;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import javax.validation.Valid;

import static no.nav.data.catalog.backend.app.dataset.DatacatalogMaster.REST;

@Slf4j
@RestController
@CrossOrigin
@RequestMapping("/dataset")
@Api(value = "Dataset", description = "REST API for Dataset", tags = {"Dataset"})
public class DatasetController {

    private final DatasetRepository repository;
    private final DatasetService service;
    private final ElasticsearchDatasetService elasticsearchDatasetService;

    public DatasetController(DatasetRepository datasetRepository,
            DatasetService datasetService,
            ElasticsearchDatasetService elasticsearchDatasetService) {
        this.repository = datasetRepository;
        this.service = datasetService;
        this.elasticsearchDatasetService = elasticsearchDatasetService;
    }

    @ApiOperation(value = "Get Dataset", tags = {"Dataset"})
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Dataset fetched", response = DatasetResponse.class),
            @ApiResponse(code = 404, message = "Dataset not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/{id}")
    public ResponseEntity<DatasetResponse> findForId(
            @PathVariable UUID id,
            @RequestParam(value = "includeDescendants", defaultValue = "false") boolean includeDescendants
    ) {
        log.info("Received request for Dataset with the id={}", id);
        Optional<DatasetResponse> datasetResponse = includeDescendants ?
                Optional.ofNullable(service.findDatasetWithAllDescendants(id)) :
                repository.findById(id).map(Dataset::convertToResponse);
        if (datasetResponse.isEmpty()) {
            log.info("Cannot find the Dataset with id={}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        log.info("Returned Dataset");
        return new ResponseEntity<>(datasetResponse.get(), HttpStatus.OK);
    }

    @ApiOperation(value = "Get Dataset in Elasticsearch format", tags = {"Dataset"})
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Dataset fetched", response = DatasetElasticsearch.class),
            @ApiResponse(code = 404, message = "Dataset not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/elasticsearch/{id}")
    public ResponseEntity<DatasetElasticsearch> findElasticsearchFormatForId(@PathVariable UUID id) {
        log.info("Received request for Dataset ElasticsearchFormat with the id={}", id);
        Optional<Dataset> datasetResponse = repository.findById(id);
        if (datasetResponse.isEmpty()) {
            log.info("Cannot find the Dataset with id={}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        log.info("Returned Dataset ElasticsearchFormat");
        return new ResponseEntity<>(elasticsearchDatasetService.mapDataset(datasetResponse.get()), HttpStatus.OK);
    }

    @ApiOperation(value = "Get Dataset", tags = {"Dataset"})
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Dataset fetched", response = DatasetResponse.class),
            @ApiResponse(code = 404, message = "Dataset not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/title/{title}")
    public ResponseEntity<DatasetResponse> getDatasetByTitle(@PathVariable String title) {
        log.info("Received request for Dataset with the title={}", title);
        Optional<Dataset> dataset = repository.findByTitle(title);
        if (dataset.isEmpty()) {
            log.info("Cannot find the Dataset with title={}", title);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        log.info("Returned Dataset");
        return new ResponseEntity<>(dataset.get().convertToResponse(), HttpStatus.OK);
    }

    @ApiOperation(value = "Get All Root Datasets", tags = {"Dataset"})
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Datasets fetched", response = DatasetPage.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/roots")
    public ResponseEntity<RestResponsePage<DatasetResponse>> findAllRoot(@RequestParam(value = "includeDescendants", defaultValue = "false") boolean includeDescendants,
            PageParameters page) {
        log.info("Received request for all root Datasets");
        Page<DatasetResponse> allRootDatasets = service.findAllRootDatasets(includeDescendants, page.createIdSortedPage());
        log.info("Returned {} root Datasets", allRootDatasets.getContent().size());
        return ResponseEntity.ok(new RestResponsePage<>(allRootDatasets.getContent(), allRootDatasets.getPageable(), allRootDatasets.getTotalElements()));
    }

    @ApiOperation(value = "Get All Datasets", tags = {"Dataset"})
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Datasets fetched", response = DatasetPage.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/")
    public ResponseEntity<RestResponsePage<DatasetResponse>> findAll(PageParameters page) {
        log.info("Received request for all Datasets");
        Page<DatasetResponse> datasets = repository.findAll(page.createIdSortedPage()).map(Dataset::convertToResponse);
        log.info("Returned {} Datasets", datasets.getContent().size());
        return ResponseEntity.ok(new RestResponsePage<>(datasets.getContent(), datasets.getPageable(), datasets.getTotalElements()));
    }

    @ApiOperation(value = "Count all Datasets", tags = {"Dataset"})
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Count of Datasets fetched", response = Long.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/count")
    public Long countAllDatasets() {
        log.info("Received request for count all Datasets");
        return repository.count();
    }

    @ApiOperation(value = "Create Datasets", tags = {"Dataset"})
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "Datasets to be created successfully accepted", response = DatasetResponse.class, responseContainer = "List"),
            @ApiResponse(code = 400, message = "Illegal arguments"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @PostMapping
    public ResponseEntity<List<DatasetResponse>> createDatasets(@RequestBody List<DatasetRequest> requests) {
        log.info("Received requests to create Datasets");
        requests = StreamUtils.nullToEmptyList(requests);
        DatasetRequest.initiateRequests(requests, false, REST);
        service.validateRequest(requests);

        return new ResponseEntity<>(service.saveAll(requests, REST).stream().map(Dataset::convertToResponse).collect(Collectors.toList()), HttpStatus.CREATED);
    }

    @ApiOperation(value = "Update Dataset", tags = {"Dataset"})
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Dataset to be updated successfully accepted", response = DatasetResponse.class, responseContainer = "List"),
            @ApiResponse(code = 400, message = "Illegal arguments"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @PutMapping
    public ResponseEntity<List<DatasetResponse>> updateDatasets(@RequestBody List<DatasetRequest> requests) {
        log.info("Received requests to update Datasets");
        requests = StreamUtils.nullToEmptyList(requests);
        DatasetRequest.initiateRequests(requests, true, REST);
        service.validateRequest(requests);

        return ResponseEntity.ok(service.updateAll(requests).stream().map(Dataset::convertToResponse).collect(Collectors.toList()));
    }

    @ApiOperation(value = "Update Dataset", tags = {"Dataset"})
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Accepted one Dataset to be updated", response = Dataset.class),
            @ApiResponse(code = 400, message = "Illegal arguments"),
            @ApiResponse(code = 404, message = "Dataset not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @PutMapping("/{id}")
    public ResponseEntity<DatasetResponse> updateOneDatasetById(@PathVariable UUID id, @Valid @RequestBody DatasetRequest request) {
        log.info("Received a request to update Dataset with id={}", id);
        Optional<Dataset> byId = repository.findById(id);
        if (byId.isEmpty()) {
            log.info("Cannot find Dataset with id={}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        String existingTitle = byId.get().getTitle();
        if (!existingTitle.equals(request.getTitle())) {
            throw new ValidationException(String.format("Cannot change title of dataset in update, id=%s has title=%s", id, existingTitle));
        }
        DatasetRequest.initiateRequests(List.of(request), true, REST);
        service.validateRequest(List.of(request));

        Dataset dataset = service.update(request);

        log.info("Updated the Dataset");
        return new ResponseEntity<>(repository.save(dataset).convertToResponse(), HttpStatus.OK);
    }

    @ApiOperation(value = "Delete Dataset", tags = {"Dataset"})
    @ApiResponses(value = {
            @ApiResponse(code = 202, message = "Dataset deleted"),
            @ApiResponse(code = 404, message = "Dataset not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity deleteDatasetById(@PathVariable UUID id) {
        log.info("Received a request to delete Dataset with id={}", id);
        Optional<Dataset> fromRepository = repository.findById(id);
        if (fromRepository.isEmpty()) {
            log.info("Cannot find Dataset with id={}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        log.info("Dataset with id={} has been set to be deleted during the next scheduled task", id);
        DatasetRequest deleteRequest = DatasetRequest.builder().datacatalogMaster(REST).title(fromRepository.get().getTitle()).build();
        return new ResponseEntity<>(service.delete(deleteRequest).convertToResponse(), HttpStatus.ACCEPTED);
    }

    @ApiOperation(value = "Trigger Datasetsync", tags = {"Dataset"})
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Datasets will be synced"),
            @ApiResponse(code = 400, message = "Illegal arguments"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @PostMapping("/sync")
    public void syncDataset(@RequestBody List<UUID> ids) {
        log.info("Received requests to sync Dataset");
        service.sync(ids);
    }

    private static final class DatasetPage extends RestResponsePage<DatasetResponse> {

    }

}
