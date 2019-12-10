package no.nav.data.polly.codelist;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.codelist.dto.FindCodeUsageResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

        FindCodeUsageResponse response = service.findCodeUsage(list, code);
        if (response.codelistIsInUse()) {
            log.info("The code {} in list {} is used in: {}", code, list, response.toString());
            return ResponseEntity.ok(response);
        }
        log.info("The code {} in list {} is never used", code, list);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
