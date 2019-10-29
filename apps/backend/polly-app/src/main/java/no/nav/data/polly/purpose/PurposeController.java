package no.nav.data.polly.purpose;


import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.purpose.domain.PurposeResponse;
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

    private final PurposeService purposeService;

    public PurposeController(PurposeService purposeService) {
        this.purposeService = purposeService;
    }

    @ApiOperation(value = "Get InformationTypes for Purpose")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "All Behandlingsgrunnlag fetched", response = PurposeResponse.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/{purpose}")
    public ResponseEntity<PurposeResponse> getPurpose(@PathVariable String purpose) {
        var informationTypes = purposeService.findPurpose(purpose);
        return ResponseEntity.ok(new PurposeResponse(purpose, informationTypes));
    }
}
