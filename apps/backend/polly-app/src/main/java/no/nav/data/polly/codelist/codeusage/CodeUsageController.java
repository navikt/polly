package no.nav.data.polly.codelist.codeusage;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodeUsageResponse;
import no.nav.data.polly.common.utils.StreamUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

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

    @ApiOperation(value = "Get all usage of the provided listName")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Fetch all usage of the provided listName", response = CodeUsageResponse.class, responseContainer = "List"),
            @ApiResponse(code = 404, message = "Code or listName not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/find/{list}")
    public ResponseEntity<List<CodeUsageResponse>> findAllCodeUsageOfListname(@PathVariable String list) {
        log.info("Received request to fetch all usage of the list {}", list);
        service.validateListName(list);

        List<CodeUsage> codeUsages = service.findCodeUsageOfList(ListName.valueOf(list));
        if (codeUsages.isEmpty()) {
            log.info("The listName {} is never used", list);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        List<CodeUsageResponse> response = createResponse(codeUsages);
        log.info("Usage of listName {} : {}", list, response.toString());
        return ResponseEntity.ok(response);
    }

    @ApiOperation(value = "Get all information about where the provided code is used")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Fetch all data related to one codelist", response = CodeUsageResponse.class),
            @ApiResponse(code = 404, message = "Code or listName not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/find/{list}/{code}")
    public ResponseEntity<CodeUsageResponse> findCodeUsageByListNameAndCode(@PathVariable String list, @PathVariable String code) {
        log.info("Received request to fetch all usage of code {} in list {}", code, list);
        service.validateRequests(list, code);

        CodeUsage codeUsage = service.findCodeUsage(ListName.valueOf(list), code);
        if (!codeUsage.isInUse()) {
            log.info("The code {} in list {} is never used", code, list);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        CodeUsageResponse response = new CodeUsageResponse(codeUsage);
        log.info("The code {} in list {} is used in: {}", code, list, response);
        return ResponseEntity.ok(response);
    }

    private List<CodeUsageResponse> createResponse(List<CodeUsage> codeUsages) {
        List<CodeUsageResponse> responses = new ArrayList<>();
        StreamUtils.safeStream(codeUsages).forEach(codeUsage -> {
            if (responseForListNameExists(responses, codeUsage.getListName())) {
                StreamUtils.find(responses, codeUsageResponse -> codeUsageResponse.getListName().equals(codeUsage.getListName())).addCodeUsage(codeUsage);
            } else {
                responses.add(new CodeUsageResponse(codeUsage));
            }
        });
        return responses;
    }

    private boolean responseForListNameExists(List<CodeUsageResponse> responses, String listName) {
        for (CodeUsageResponse response : responses) {
            if (response.getListName().equals(listName)) {
                return true;
            }
        }
        return false;
    }
}
