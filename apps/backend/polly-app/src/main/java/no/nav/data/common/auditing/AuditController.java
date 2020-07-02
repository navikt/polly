package no.nav.data.common.auditing;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.auditing.domain.AuditVersion;
import no.nav.data.common.auditing.domain.AuditVersionRepository;
import no.nav.data.common.auditing.dto.AuditLogResponse;
import no.nav.data.common.auditing.dto.AuditResponse;
import no.nav.data.common.rest.PageParameters;
import no.nav.data.common.rest.RestResponsePage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static no.nav.data.common.auditing.domain.AuditVersionRepository.exampleFrom;
import static no.nav.data.common.utils.StreamUtils.convert;

@Slf4j
@RestController
@RequestMapping("/audit")
@Api(value = "Audit", tags = {"Audit"})
public class AuditController {

    private final AuditVersionRepository repository;

    public AuditController(AuditVersionRepository repository) {
        this.repository = repository;
    }

    @ApiOperation(value = "Get Audit log")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Audit log fetched", response = AuditLogPage.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping
    public ResponseEntity<RestResponsePage<AuditResponse>> getAll(PageParameters paging, @RequestParam(required = false) String table) {
        log.info("Received request for Audit {} table {}", paging, table);
        Pageable pageable = paging.createSortedPageByFieldDescending(AuditVersion.Fields.time);
        Page<AuditResponse> page;
        if (table != null) {
            page = repository.findAll(exampleFrom(AuditVersion.builder().table(table).build()), pageable).map(AuditVersion::convertToResponse);
        } else {
            page = repository.findAll(pageable).map(AuditVersion::convertToResponse);
        }
        return new ResponseEntity<>(new RestResponsePage<>(page), HttpStatus.OK);
    }

    @ApiOperation(value = "Get Audit log for object")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Audit log fetched", response = AuditLogResponse.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/log/{id}")
    public ResponseEntity<AuditLogResponse> findForId(@PathVariable String id) {
        log.info("Received request for Audit with the id={}", id);
        List<AuditVersion> log = repository.findByTableIdOrderByTimeDesc(id);
        return new ResponseEntity<>(new AuditLogResponse(id, convert(log, AuditVersion::convertToResponse)), HttpStatus.OK);
    }

    static class AuditLogPage extends RestResponsePage<AuditResponse> {

    }

}
