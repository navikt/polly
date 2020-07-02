package no.nav.data.polly.alert;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.alert.AlertController.EventPage.AlertSort;
import no.nav.data.polly.alert.AlertController.EventPage.SortDir;
import no.nav.data.polly.alert.domain.AlertEvent;
import no.nav.data.polly.alert.domain.AlertEventLevel;
import no.nav.data.polly.alert.domain.AlertEventType;
import no.nav.data.polly.alert.dto.AlertEventResponse;
import no.nav.data.polly.alert.dto.AlertEventResponse.AlertEventResponseBuilder;
import no.nav.data.polly.alert.dto.InformationTypeAlert;
import no.nav.data.polly.alert.dto.ProcessAlert;
import no.nav.data.polly.common.rest.PageParameters;
import no.nav.data.polly.common.rest.RestResponsePage;
import no.nav.data.polly.process.DomainCache;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;
import java.util.UUID;

@Slf4j
@RestController
@CrossOrigin
@RequestMapping("/alert")
@Api(value = "Alerts", tags = {"Alert"})
public class AlertController {

    private final AlertService alertService;
    private final DomainCache domainCache;

    public AlertController(AlertService alertService, DomainCache domainCache) {
        this.alertService = alertService;
        this.domainCache = domainCache;
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
    @GetMapping("/informationtype/{informationTypeId}")
    public ResponseEntity<InformationTypeAlert> alertsForInformationType(@PathVariable UUID informationTypeId) {
        var alerts = alertService.checkAlertsForInformationType(informationTypeId);
        return ResponseEntity.ok(alerts);
    }

    @ApiOperation(value = "Get Alerts events")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Alert events fetched", response = EventPage.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/events")
    public ResponseEntity<RestResponsePage<AlertEventResponse>> alertsEvents(PageParameters parameters,
            @RequestParam(value = "processId", required = false) UUID processId,
            @RequestParam(value = "informationTypeId", required = false) UUID informationTypeId,
            @RequestParam(value = "type", required = false) AlertEventType type,
            @RequestParam(value = "level", required = false) AlertEventLevel level,
            @RequestParam(value = "sort", required = false) AlertSort sort,
            @RequestParam(value = "dir", required = false) SortDir dir
    ) {
        var events = alertService.getEvents(parameters, processId, informationTypeId, type, level,sort,dir).map(this::convertEventResponse);
        return ResponseEntity.ok(new RestResponsePage<>(events));
    }

    @SuppressWarnings("ConstantConditions")
    private AlertEventResponse convertEventResponse(AlertEvent event) {
        AlertEventResponseBuilder builder = AlertEventResponse.builder()
                .id(event.getId())
                .type(event.getType())
                .level(event.getLevel())
                .changeStamp(event.convertChangeStampResponse());

        Optional.ofNullable(event.getProcessId())
                .flatMap(domainCache::getProcess)
                .ifPresent(p -> builder.process(p.convertToShortResponse()));

        Optional.ofNullable(event.getInformationTypeId())
                .flatMap(domainCache::getInfoType)
                .ifPresent(it -> builder.informationType(it.convertToShortResponse()));

        return builder.build();
    }

    public static class EventPage extends RestResponsePage<AlertEventResponse> {

        public enum AlertSort {
            PROCESS, INFORMATION_TYPE, TYPE, LEVEL, TIME, USER
        }

        public enum SortDir {
            ASC, DESC
        }
    }

}
