package no.nav.data.polly.export;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.exceptions.NotFoundException;
import no.nav.data.common.exceptions.ValidationException;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.repo.ProcessRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;
import java.util.UUID;
import javax.servlet.http.HttpServletResponse;

@Slf4j
@RestController
@RequestMapping("/export")
@Tag(name = "Export", description = "REST API for exports")
public class ExportController {

    private static final String WORDPROCESSINGML_DOCUMENT = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    private final ProcessRepository processRepository;
    private final CodelistService codelistService;
    private final ProcessToDocx processToDocx;

    public ExportController(ProcessRepository processRepository, CodelistService codelistService, ProcessToDocx processToDocx) {
        this.processRepository = processRepository;
        this.codelistService = codelistService;
        this.processToDocx = processToDocx;
    }

    @Operation(summary = "Get export for process")
    @ApiResponse(description = "Doc fetched", content = @Content(schema = @Schema(implementation = byte[].class)))
    @Transactional(readOnly = true)
    @SneakyThrows
    @GetMapping(value = "/process", produces = WORDPROCESSINGML_DOCUMENT)
    public void getExport(
            HttpServletResponse response,
            @RequestParam(name = "processId", required = false) UUID processId,
            @RequestParam(name = "department", required = false) String department,
            @RequestParam(name = "subDepartment", required = false) String subDepartment,
            @RequestParam(name = "system", required = false) String system,
            @RequestParam(name = "purpose", required = false) String purpose
    ) {
        byte[] doc;
        String filename;
        if (processId != null) {
            Optional<Process> process = processRepository.findById(processId);
            if (process.isEmpty()) {
                throw new NotFoundException("Couldn't find process " + processId);
            }
            Process p = process.get();
            doc = processToDocx.generateDocForProcess(p);
            filename = "behandling_" + String.join(".", p.getData().getPurposes()) + "-" + p.getData().getName().replaceAll("[^a-zA-Z\\d]", "-") + "_" + p.getId() + ".docx";
        } else {
            ListName list;
            String code;
            if (department != null) {
                list = ListName.DEPARTMENT;
                code = department;
            } else if (subDepartment != null) {
                list = ListName.SUB_DEPARTMENT;
                code = subDepartment;
            } else if (purpose != null) {
                list = ListName.PURPOSE;
                code = purpose;
            } else if (system != null) {
                list = ListName.SYSTEM;
                code = system;
            } else {
                throw new ValidationException("No paramater given");
            }
            codelistService.validateListNameAndCode(list.name(), code);
            doc = processToDocx.generateDocFor(list, code);
            String depNameClean = cleanCodelistName(list, code);
            filename = "behandling_" + list.name().toLowerCase() + "_" + depNameClean + ".docx";

        }
        response.setContentType(WORDPROCESSINGML_DOCUMENT);
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename);
        StreamUtils.copy(doc, response.getOutputStream());
        response.flushBuffer();
    }

    private String cleanCodelistName(ListName listName, String codelist) {
        return CodelistService.getCodelist(listName, codelist).getShortName().replaceAll("[^a-zA-Z\\d]", "-");
    }

}
