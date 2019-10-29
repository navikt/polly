package no.nav.data.polly.purpose;


import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.process.ProcessService;
import no.nav.data.polly.purpose.dto.PurposeResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@CrossOrigin
@Api(value = "Data Catalog Purpose", description = "REST API for Purpose", tags = {"Purpose"})
@RequestMapping("/purpose")
public class PurposeController {

    private final ProcessService processService;

    public PurposeController(ProcessService processService) {
        this.processService = processService;
    }

    @ApiOperation(value = "Get InformationTypes for Purpose")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "All Behandlingsgrunnlag fetched", response = PurposeResponse.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/{purpose}")
    public ResponseEntity<PurposeResponse> getPurpose(@PathVariable String purpose) {
        var processes = processService.findForPurpose(purpose);
        return ResponseEntity.ok(new PurposeResponse(purpose, processes));
    }
}
