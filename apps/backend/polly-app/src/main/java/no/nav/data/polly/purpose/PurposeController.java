package no.nav.data.polly.purpose;


import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessRepository;
import no.nav.data.polly.purpose.dto.PurposeResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.transaction.Transactional;

import static java.util.stream.Collectors.toList;

@Slf4j
@RestController
@CrossOrigin
@Api(value = "Data Catalog Purpose", description = "REST API for Purpose", tags = {"Purpose"})
@RequestMapping("/purpose")
public class PurposeController {

    private final ProcessRepository processRepository;

    public PurposeController(ProcessRepository processRepository) {
        this.processRepository = processRepository;
    }

    @ApiOperation(value = "Get InformationTypes for Purpose")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Purpose fetched", response = PurposeResponse.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/{purpose}")
    @Transactional
    public ResponseEntity<PurposeResponse> getPurpose(@PathVariable String purpose) {
        var processes = processRepository.findByPurposeCode(purpose).stream().map(Process::convertToResponseWithInformationTypes).collect(toList());
        return ResponseEntity.ok(new PurposeResponse(purpose, processes));
    }
}
