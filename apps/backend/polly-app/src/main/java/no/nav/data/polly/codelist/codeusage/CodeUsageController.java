package no.nav.data.polly.codelist.codeusage;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodeUsageResponse;
import no.nav.data.polly.codelist.dto.CodelistUsageResponse;
import no.nav.data.polly.codelist.dto.ReplaceCodelistRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@Tag(name = "CodeUsage", description = "REST API for usage of codes in the Data Catalog")
@RequestMapping("/codelist/usage")
public class CodeUsageController {

    private final CodeUsageService service;

    public CodeUsageController(CodeUsageService service) {
        this.service = service;
    }

    @Operation(summary = "Get all usage of the provided listName")
    @ApiResponse(description = "Fetch all usage of the provided listName")
    @GetMapping("/find/{list}")
    public ResponseEntity<CodelistUsageResponse> findAllCodeUsageOfListname(@PathVariable String list) {
        log.info("Received request to fetch all usage of the list {}", list);
        service.validateListName(list);

        List<CodeUsageResponse> codeUsages = service.findCodeUsageOfList(ListName.valueOf(list));
        var response = new CodelistUsageResponse(ListName.valueOf(list), codeUsages);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get all information about where the provided code is used")
    @ApiResponse(description = "Fetch all data related to one codelist")
    @GetMapping("/find/{list}/{code}")
    public ResponseEntity<CodeUsageResponse> findCodeUsageByListNameAndCode(@PathVariable String list, @PathVariable String code) {
        log.info("Received request to fetch all usage of code {} in list {}", code, list);
        service.validateRequests(list, code);

        CodeUsageResponse codeUsage = service.findCodeUsage(ListName.valueOf(list), code);
        return ResponseEntity.ok(codeUsage);
    }

    @Operation(summary = "Batch replace codelist value")
    @ApiResponse(description = "All usages replaced")
    @PostMapping("/replace")
    public ResponseEntity<CodeUsageResponse> replaceAllCodelistUsage(@RequestBody ReplaceCodelistRequest request) {
        log.info("Received request to replace all usage of code {} with code {} in list {}", request.getOldCode(), request.getNewCode(), request.getList());
        request.formatAndValidate();

        CodeUsageResponse codeUsage = service.replaceUsage(request.getListAsListName(), request.getOldCode(), request.getNewCode(), request.getNewCodeName());
        log.info("The code {} in list {} is used in: {}", request.getOldCode(), request.getListAsListName(), codeUsage);
        return ResponseEntity.ok(codeUsage);
    }

}
