package no.nav.data.polly.common.auditing;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.common.auditing.dto.AuditLogResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static no.nav.data.polly.common.utils.StreamUtils.convert;

@Slf4j
@RestController
@CrossOrigin
@RequestMapping("/audit")
@Api(value = "Audit", description = "REST API for Audit", tags = {"Audit"})
public class AuditController {

    private final AuditVersionRepository repository;

    public AuditController(AuditVersionRepository repository) {
        this.repository = repository;
    }

    @ApiOperation(value = "Get Audit log for object")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Audit log fetched", response = AuditLogResponse.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/log/{id}")
    public ResponseEntity<AuditLogResponse> findForId(@PathVariable String id) {
        log.info("Received request for Disclosure with the id={}", id);
        List<AuditVersion> log = repository.findByTableIdOOrderByTimeDesc(id);
        return new ResponseEntity<>(new AuditLogResponse(id, convert(log, AuditVersion::convertToResponse)), HttpStatus.OK);
    }

}
