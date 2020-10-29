package no.nav.data.polly.process;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.rest.RestResponsePage;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.Codelist;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.repo.ProcessRepository;
import no.nav.data.polly.process.dto.ProcessResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static java.util.stream.Collectors.toList;

@Slf4j
@RestController
@Tag(name = "Process", description = "REST API for Process")
@RequestMapping("/process")
public class PurposeController {

    private final ProcessRepository processRepository;

    public PurposeController(ProcessRepository processRepository) {
        this.processRepository = processRepository;
    }

    @Operation(summary = "Get Processes for Purpose")
    @ApiResponse(description = "Processes fetched")
    @GetMapping("/purpose/{purpose}")
    @Transactional
    public ResponseEntity<RestResponsePage<ProcessResponse>> getPurpose(@PathVariable String purpose) {
        log.info("Get processes for purpose={}", purpose);
        Codelist codelist = CodelistService.getCodelist(ListName.PURPOSE, purpose);
        if (codelist == null) {
            return ResponseEntity.notFound().build();
        }
        String code = codelist.getCode();
        var processes = processRepository.findByPurpose(code).stream().map(Process::convertToResponse).collect(toList());
        log.info("Got {} processes", processes.size());
        return ResponseEntity.ok(new RestResponsePage<>(processes));
    }
}
