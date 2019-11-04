package no.nav.data.polly.codelist;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.codelist.domain.Codelist;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodelistRequest;
import no.nav.data.polly.codelist.dto.CodelistResponse;
import no.nav.data.polly.common.utils.StreamUtils;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import javax.validation.Valid;

@Slf4j
@RestController
@CrossOrigin
@RequestMapping("/codelist")
@Api(value = "Codelist", description = "REST API for common list of values", tags = {"Codelist"})
public class CodelistController {

    private final CodelistService service;

    public CodelistController(CodelistService service) {
        this.service = service;
    }

    @ApiOperation(value = "Get the entire Codelist", tags = {"Codelist"})
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Entire Codelist fetched", response = Map.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping
    public Map<ListName, Map<String, String>> findAll() {
        log.info("Received a request for and returned the entire Codelist");
        //TODO: Deprecated -- getCodelist()
        return CodelistCache.getAllAsMap();
    }

    @ApiOperation(value = "Get codes and descriptions for listName", tags = {"Codelist"})
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Fetched codes with description for listName", response = Map.class),
            @ApiResponse(code = 404, message = "ListName not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/{listName}")
    public Map<String, String> getCodelistByListName(@PathVariable String listName) {
        log.info("Received a request for the codelist with listName={}", listName);
        service.validateListNameExists(listName);
        //TODO: Deprecated -- getCodelistsByListName(String listName)
        return CodelistCache.getAsMap(ListName.valueOf(listName.toUpperCase()));
    }

    @ApiOperation(value = "Get description for code in listName", tags = {"Codelist"})
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Description fetched", response = String.class),
            @ApiResponse(code = 404, message = "Code or listName not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/{listName}/{code}")
    public String getDescriptionByListNameAndCode(@PathVariable String listName, @PathVariable String code) {
        log.info("Received a request for the description of code={} in list={}", code, listName);
        service.validateListNameAndCodeExists(listName, code);
        return Objects.requireNonNull(CodelistService.getCodeResponseForCodelistItem(ListName.valueOf(listName.toUpperCase()), code)).getDescription();
    }

    @ApiOperation(value = "Create Codelist", tags = {"Codelist"})
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "Codelist successfully created", response = Codelist.class, responseContainer = "List"),
            @ApiResponse(code = 400, message = "Illegal arguments"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public List<CodelistResponse> save(@Valid @RequestBody List<CodelistRequest> requests) {
        log.info("Received a requests to create codelists");
        requests = StreamUtils.nullToEmptyList(requests);
        service.validateRequest(requests, false);

        return service.save(requests).stream().map(Codelist::convertToResponse).collect(Collectors.toList());
    }

    @ApiOperation(value = "Update Codelist", tags = {"Codelist"})
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Codelist updated", response = Codelist.class, responseContainer = "List"),
            @ApiResponse(code = 400, message = "Illegal arguments"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @PutMapping
    public List<CodelistResponse> update(@Valid @RequestBody List<CodelistRequest> requests) {
        log.info("Received a request to update codelists");
        requests = StreamUtils.nullToEmptyList(requests);
        service.validateRequest(requests, false);

        return service.update(requests).stream().map(Codelist::convertToResponse).collect(Collectors.toList());
    }

    @ApiOperation(value = "Delete Codelist", tags = {"Codelist"})
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Codelist deleted"),
            @ApiResponse(code = 400, message = "Illegal arguments"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @DeleteMapping("/{listName}/{code}")
    @Transactional
    public void delete(@PathVariable String listName, @PathVariable String code) {
        listName = listName.toUpperCase().trim();
        code = code.toUpperCase().trim();
        log.info("Received a request to delete code={} in the list={}", code, listName);
        service.validateListNameAndCodeExists(listName, code);
        service.delete(ListName.valueOf(listName), code);
        log.info("Deleted code={} in the list={}", code, listName);
    }

    @ApiOperation(value = "Refresh Codelist", tags = {"Codelist"})
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Codelist refreshed"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/refresh")
    public void refresh() {
        log.info("Refreshed the codelists");
        service.refreshCache();
    }
}
