package no.nav.data.polly.export;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.common.exceptions.PollyNotFoundException;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessRepository;
import org.docx4j.openpackaging.contenttype.ContentTypes;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;
import java.util.UUID;

@Slf4j
@RestController
@CrossOrigin
@RequestMapping("/export")
@Api(value = "Export", description = "REST API for exports", tags = {"Export"})
public class ExportController {

    private final ProcessRepository processRepository;
    private final ProcessToDocx processToDocx;

    public ExportController(ProcessRepository processRepository, ProcessToDocx processToDocx) {
        this.processRepository = processRepository;
        this.processToDocx = processToDocx;
    }

    @ApiOperation(value = "Get export for process")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Doc fetched", response = byte[].class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping(value = "/process/{processId}", produces = ContentTypes.WORDPROCESSINGML_DOCUMENT)
    public ResponseEntity<byte[]> getTeamByName(@PathVariable UUID processId) {
        log.info("Received request for export of process with id {}", processId);
        Optional<Process> process = processRepository.findById(processId);
        if (process.isEmpty()) {
            throw new PollyNotFoundException("Couldn't find process " + processId);
        }
        return new ResponseEntity<>(processToDocx.generateDocForProcess(process.get()), HttpStatus.OK);
    }

}
