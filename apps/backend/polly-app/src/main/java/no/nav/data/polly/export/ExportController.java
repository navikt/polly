package no.nav.data.polly.export;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.common.exceptions.PollyNotFoundException;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessRepository;
import org.docx4j.openpackaging.contenttype.ContentTypes;
import org.springframework.http.HttpHeaders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;
import java.util.UUID;
import javax.servlet.http.HttpServletResponse;

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
    @Transactional(readOnly = true)
    @SneakyThrows
    @GetMapping(value = "/process/{processId}", produces = ContentTypes.WORDPROCESSINGML_DOCUMENT)
    public void getTeamByName(@PathVariable UUID processId, HttpServletResponse response) {
        log.info("Received request for export of process with id {}", processId);
        Optional<Process> process = processRepository.findById(processId);
        if (process.isEmpty()) {
            throw new PollyNotFoundException("Couldn't find process " + processId);
        }
        Process p = process.get();
        var doc = processToDocx.generateDocForProcess(p);
        response.setContentType(ContentTypes.WORDPROCESSINGML_DOCUMENT);
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=behandling_" +
                p.getPurposeCode() + "-" + p.getName().replaceAll("[^a-zA-Z\\d]", "-") + "_" + p.getId() + ".docx");
        StreamUtils.copy(doc, response.getOutputStream());
        response.flushBuffer();
    }

}
