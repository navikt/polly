package no.nav.data.polly.export;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import no.nav.data.common.exceptions.NotFoundException;
import no.nav.data.common.exceptions.ValidationException;
import no.nav.data.polly.codelist.CodelistStaticService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodelistRequestValidator;
import no.nav.data.polly.export.domain.DocumentAccess;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessStatus;
import no.nav.data.polly.process.domain.repo.ProcessRepository;
import no.nav.data.polly.teams.TeamService;
import no.nav.data.polly.teams.domain.Team;
import org.springframework.http.HttpHeaders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StreamUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static no.nav.data.common.utils.StreamUtils.convert;

@RestController
@RequestMapping("/export")
@Tag(name = "Export", description = "REST API for exports")
@RequiredArgsConstructor
public class ExportController {

    // TODO: Implementerer ikke controller → service → DB. Flytt all forretningslogikk, *Repository-aksess og @Transactional til tjenestelaget.
    
    private static final String WORDPROCESSINGML_DOCUMENT = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    private final ProcessRepository processRepository;
    private final CodelistRequestValidator codelistRequestValidator;
    private final ProcessToDocx processToDocx;
    private final TeamService teamService;

    @Operation(summary = "Get export for process")
    @ApiResponse(description = "Doc fetched", content = @Content(schema = @Schema(implementation = byte[].class)))
    @Transactional(readOnly = true) // TODO: Flytt dette inn til tjenestelaget
    @SneakyThrows
    @GetMapping(value = "/process", produces = WORDPROCESSINGML_DOCUMENT)
    public void getExport(
            HttpServletResponse response,
            @RequestParam(name = "processId", required = false) UUID processId,
            @RequestParam(name = "department", required = false) String department,
            @RequestParam(name = "subDepartment", required = false) String subDepartment,
            @RequestParam(name = "system", required = false) String system,
            @RequestParam(name = "purpose", required = false) String purpose,
            @RequestParam(name = "productArea", required = false) String productArea,
            @RequestParam(name = "productTeam", required = false) String productTeam,
            @RequestParam(name = "documentAccess", required = false, defaultValue = "INTERNAL") DocumentAccess documentAccess
    ) {
        byte[] doc;
        String filename;
        if (processId != null) {
            Optional<Process> process = processRepository.findById(processId);
            if (process.isEmpty()) {
                throw new NotFoundException("Couldn't find process " + processId);
            }
            Process p;
            if (documentAccess == DocumentAccess.INTERNAL || (documentAccess == DocumentAccess.EXTERNAL
                    && process.get().getData().getStatus() == ProcessStatus.COMPLETED)) {
                p = process.get();
            } else {
                throw new NotFoundException("The process is not completed therefore it can not be exported");
            }
            doc = processToDocx.generateDocForProcess(p, documentAccess);
            filename = "behandling_" + String.join(".", p.getData().getPurposes()) + "-" + p.getData().getName().replaceAll("[^a-zA-Z\\d]", "-") + "_" + p.getId() + ".docx";
        } else if (productArea != null) {
            var teams = teamService.getTeamsForProductArea(productArea);
            var productAreaData = teamService.getProductArea(productArea);
            String productAreaName = productAreaData.isPresent() ? productAreaData.get().getName() : "";

            List<Process> processes = processRepository.findByProductTeams(convert(teams, Team::getId));
            doc = processToDocx.generateDocForProcessList(processes, "Produktområde: " + StringUtils.capitalize(productAreaName), documentAccess);
            filename = "behandling_produktområde_" + productArea + ".docx";
        } else if (productTeam != null) {
            List<Process> processes = processRepository.findByProductTeam(productTeam);
            var productTeamData = teamService.getTeam(productTeam);
            String productTeamName = productTeamData.isPresent() ? productTeamData.get().getName() : "";

            doc = processToDocx.generateDocForProcessList(processes, "Team: " + StringUtils.capitalize(productTeamName), documentAccess);
            filename = "behandling_team_" + productTeam + ".docx";
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
            codelistRequestValidator.validateListNameAndCode(list.name(), code);
            doc = processToDocx.generateDocFor(list, code, documentAccess);
            String depNameClean = cleanCodelistName(list, code);
            filename = "behandling_" + list.name().toLowerCase() + "_" + depNameClean + ".docx";

        }
        response.setContentType(WORDPROCESSINGML_DOCUMENT);
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename);
        StreamUtils.copy(doc, response.getOutputStream());
        response.flushBuffer();
    }

    private String cleanCodelistName(ListName listName, String codelist) {
        return CodelistStaticService.getCodelist(listName, codelist).getShortName().replaceAll("[^a-zA-Z\\d]", "-");
    }

}
