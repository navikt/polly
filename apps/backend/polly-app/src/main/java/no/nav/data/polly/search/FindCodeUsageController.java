package no.nav.data.polly.search;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.common.utils.StreamUtils;
import no.nav.data.polly.search.dto.FindCodeUsageRequest;
import no.nav.data.polly.search.dto.FindCodeUsageResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@CrossOrigin
@Api(value = "Data Catalog FindCodeUsage", description = "REST API for finding usage of codes in the Data Catalog", tags = {"Codelist"})
@RequestMapping("findcodeusage")
public class FindCodeUsageController {

    private final FindCodeUsageService service;

    public FindCodeUsageController(FindCodeUsageService service) {
        this.service = service;
    }

    @ApiOperation(value = "Get all information about where the provided code is used")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Fetch all data related to one codelist", response = FindCodeUsageResponse.class),
            @ApiResponse(code = 404, message = "Code or listName not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/{list}/{code}")
    public ResponseEntity<FindCodeUsageResponse> findByListNameAndCode(@PathVariable String list, @PathVariable String code) {
        log.info("Received request to fetch all usage of code {} in list {}", code, list);
        service.validateRequests(list, code);

        FindCodeUsageResponse response = service.findCodeUsageByListNameAndCode(list, code);
        if (response.isEmpty()) {
            log.info("Cannot find data related to code {} in list {}", code, list);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        log.info("Returned data for code {} in list {}", code, list);
        return ResponseEntity.ok(response);
    }

    @ApiOperation(value = "Get information about where the provided list of codes is used")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Fetch data related to list of codelists", response = FindCodeUsageResponse.class, responseContainer = "List"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping
    public List<FindCodeUsageResponse> findByRequests(@RequestBody List<FindCodeUsageRequest> requests) {
        log.info("Received request to fetch usage of codelists");
        requests = StreamUtils.nullToEmptyList(requests);
        service.validateRequests(requests);

        return service.findCodeUsageByRequests(requests);
    }
}
