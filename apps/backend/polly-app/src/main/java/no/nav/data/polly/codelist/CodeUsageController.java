package no.nav.data.polly.codelist;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.codelist.dto.CodeUsageResponse;
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
@Api(value = "Data Catalog CodeUsage", description = "REST API for usage of codes in the Data Catalog", tags = {"Codelist"})
@RequestMapping("codeusage")
public class CodeUsageController {

    private final CodeUsageService service;

    public CodeUsageController(CodeUsageService service) {
        this.service = service;
    }

    @ApiOperation(value = "Get all information about where the provided code is used")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Fetch all data related to one codelist", response = CodeUsageResponse.class),
            @ApiResponse(code = 404, message = "Code or listName not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/find/{list}/{code}")
    public ResponseEntity<CodeUsageResponse> findByListNameAndCode(@PathVariable String list, @PathVariable String code) {
        log.info("Received request to fetch all usage of code {} in list {}", code, list);
        service.validateRequests(list, code);

        CodeUsageResponse response = service.findCodeUsage(list, code);
        if (response.codelistIsInUse()) {
            log.info("The code {} in list {} is used in: {}", code, list, response.toString());
            return ResponseEntity.ok(response);
        }
        log.info("The code {} in list {} is never used", code, list);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
