package no.nav.data.polly.alert;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.alert.dto.InformationTypeAlert;
import no.nav.data.polly.alert.dto.ProcessAlert;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@Slf4j
@RestController
@CrossOrigin
@RequestMapping("/alert")
@Api(value = "Alerts", tags = {"Alert"})
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @ApiOperation(value = "Get Alerts for process")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Alerts fetched", response = ProcessAlert.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/process/{processId}")
    public ResponseEntity<ProcessAlert> alertsForProcess(@PathVariable UUID processId) {
        var alerts = alertService.checkAlertsForProcess(processId);
        return ResponseEntity.ok(alerts);
    }

    @ApiOperation(value = "Get Alerts for information type")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Alerts fetched", response = InformationTypeAlert.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/informationType/{informationTypeId}")
    public ResponseEntity<InformationTypeAlert> alertsForInformationType(@PathVariable UUID informationTypeId) {
        var alerts = alertService.checkAlertsForInformationType(informationTypeId);
        return ResponseEntity.ok(alerts);
    }

}
