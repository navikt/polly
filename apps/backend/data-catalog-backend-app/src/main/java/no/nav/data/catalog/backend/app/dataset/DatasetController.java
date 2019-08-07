package no.nav.data.catalog.backend.app.dataset;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

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
                service.findDatasetWithAllDescendants(id) :
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
    public ResponseEntity findAllRoot(@RequestParam(value = "includeDescendants", defaultValue = "false") boolean includeDescendants) {
        // TODO paging
        log.info("Received request for all root Datasets");
        List<DatasetResponse> allRootDatasets = service.findAllRootDatasets(includeDescendants);
        log.info("Returned {} Datasets", allRootDatasets.size());
        return new ResponseEntity<>(allRootDatasets, HttpStatus.OK);
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

}
