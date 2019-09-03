package no.nav.data.catalog.backend.app.dataset;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.catalog.backend.app.common.rest.PageParameters;
import no.nav.data.catalog.backend.app.common.rest.RestResponsePage;
import no.nav.data.catalog.backend.app.dataset.repo.DatasetRepository;
import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus;
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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import javax.validation.Valid;

@Slf4j
@RestController
@CrossOrigin
@RequestMapping("/dataset")
@Api(value = "Dataset", description = "REST API for Dataset", tags = {"Dataset"})
public class DatasetController {

    private final DatasetRepository repository;
    private final DatasetService service;

    public DatasetController(DatasetRepository datasetRepository, DatasetService datasetService) {
        this.repository = datasetRepository;
        this.service = datasetService;
    }

    @ApiOperation(value = "Get Dataset", tags = {"Dataset"})
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Dataset fetched", response = DatasetResponse.class),
            @ApiResponse(code = 404, message = "Dataset not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/{id}")
    public ResponseEntity findForId(
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

    @ApiOperation(value = "Get Dataset", tags = {"Dataset"})
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Dataset fetched", response = DatasetResponse.class),
            @ApiResponse(code = 404, message = "Dataset not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/title/{title}")
    public ResponseEntity getDatasetByTitle(@PathVariable String title) {
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
            @ApiResponse(code = 200, message = "Datasets fetched", response = DatasetResponse.class, responseContainer = "List"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/roots")
    public RestResponsePage<DatasetResponse> findAllRoot(@RequestParam(value = "includeDescendants", defaultValue = "false") boolean includeDescendants, PageParameters page) {
        log.info("Received request for all root Datasets");
        Page<DatasetResponse> allRootDatasets = service.findAllRootDatasets(includeDescendants, page.createIdSortedPage());
        log.info("Returned {} root Datasets", allRootDatasets.getContent().size());
        return new RestResponsePage<>(allRootDatasets.getContent(), allRootDatasets.getPageable(), allRootDatasets.getTotalElements());
    }

    @ApiOperation(value = "Get All Datasets", tags = {"Dataset"})
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Datasets fetched", response = DatasetResponse.class, responseContainer = "List"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/")
    public RestResponsePage<DatasetResponse> findAll(PageParameters page) {
        log.info("Received request for all Datasets");
        Page<DatasetResponse> datasets = repository.findAll(page.createIdSortedPage()).map(Dataset::convertToResponse);
        log.info("Returned {} Datasets", datasets.getContent().size());
        return new RestResponsePage<>(datasets.getContent(), datasets.getPageable(), datasets.getTotalElements());
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
            @ApiResponse(code = 202, message = "Datasets to be created successfully accepted", response = DatasetResponse.class, responseContainer = "List"),
            @ApiResponse(code = 400, message = "Illegal arguments"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @PostMapping
    @ResponseStatus(HttpStatus.ACCEPTED)
    public List<DatasetResponse> createDatasets(@RequestBody List<DatasetRequest> requests) {
        log.info("Received requests to create Datasets");
        service.validateRequests(requests, false);

        List<Dataset> datasets = requests.stream()
                .map(request -> service.convertNewFromRequest(request, DatasetMaster.REST))
                .collect(Collectors.toList());

        return repository.saveAll(datasets).stream()
                .map(Dataset::convertToResponse)
                .collect(Collectors.toList());
    }

    @ApiOperation(value = "Update Dataset", tags = {"Dataset"})
    @ApiResponses(value = {
            @ApiResponse(code = 202, message = "Dataset to be updated successfully accepted", response = DatasetResponse.class, responseContainer = "List"),
            @ApiResponse(code = 400, message = "Illegal arguments"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @PutMapping
    @ResponseStatus(HttpStatus.ACCEPTED)
    public List<DatasetResponse> updateDatasets(@RequestBody List<DatasetRequest> requests) {
        log.info("Received requests to update Datasets");
        service.validateRequests(requests, true);
        List<Dataset> updatedDatasets = service.returnUpdatedDatasetsIfAllArePresent(requests);

        return repository.saveAll(updatedDatasets).stream()
                .map(Dataset::convertToResponse)
                .collect(Collectors.toList());

    }

    @ApiOperation(value = "Update Dataset", tags = {"Dataset"})
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "Accepted one Dataset to be updated", response = Dataset.class),
            @ApiResponse(code = 400, message = "Illegal arguments"),
            @ApiResponse(code = 404, message = "Dataset not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @PutMapping("/{id}")
    public ResponseEntity updateOneDatasetById(@PathVariable UUID id, @Valid @RequestBody DatasetRequest request) {
        log.info("Received a request to update Dataset with id={}", id);
        Optional<Dataset> fromRepository = repository.findById(id);
        if (fromRepository.isEmpty()) {
            log.info("Cannot find Dataset with id={}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        service.validateRequests(List.of(request), true);

        Dataset dataset = service.convertUpdateFromRequest(request, fromRepository.get());

        log.info("Updated the Dataset");
        return new ResponseEntity<>(repository.save(dataset).convertToResponse(), HttpStatus.ACCEPTED);
    }

    @ApiOperation(value = "Delete Dataset", tags = {"Dataset"})
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "Dataset deleted"),
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
        Dataset dataset = fromRepository.get();
        dataset.setElasticsearchStatus(ElasticsearchStatus.TO_BE_DELETED);
        log.info("Dataset with id={} has been set to be deleted during the next scheduled task", id);
        return new ResponseEntity<>(repository.save(dataset).convertToResponse(), HttpStatus.ACCEPTED);
    }
}
