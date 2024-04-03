package no.nav.data.polly.alert;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import no.nav.data.common.rest.PageParameters;
import no.nav.data.common.rest.RestResponsePage;
import no.nav.data.polly.alert.AlertController.EventPage.AlertSort;
import no.nav.data.polly.alert.AlertController.EventPage.SortDir;
import no.nav.data.polly.alert.domain.AlertEvent;
import no.nav.data.polly.alert.domain.AlertEventLevel;
import no.nav.data.polly.alert.domain.AlertEventType;
import no.nav.data.polly.alert.domain.AlertRepositoryImpl.AlertEventRequest;
import no.nav.data.polly.alert.dto.AlertEventResponse;
import no.nav.data.polly.alert.dto.AlertEventResponse.AlertEventResponseBuilder;
import no.nav.data.polly.alert.dto.DisclosureAlert;
import no.nav.data.polly.alert.dto.InformationTypeAlert;
import no.nav.data.polly.alert.dto.ProcessAlert;
import no.nav.data.polly.process.DomainCache;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/alert")
@Tag(name = "Alerts")
public class AlertController {

    private final AlertService alertService;
    private final DomainCache domainCache;

    public AlertController(AlertService alertService, DomainCache domainCache) {
        this.alertService = alertService;
        this.domainCache = domainCache;
    }

    @Operation(summary = "Get Alerts for process")
    @ApiResponse(description = "Alerts fetched")
    @GetMapping("/process/{processId}")
    public ResponseEntity<ProcessAlert> alertsForProcess(@PathVariable UUID processId) {
        var alerts = alertService.checkAlertsForProcess(processId);
        return ResponseEntity.ok(alerts);
    }

    @Operation(summary = "Get Alerts for information type")
    @ApiResponse(description = "Alerts fetched")
    @GetMapping("/informationtype/{informationTypeId}")
    public ResponseEntity<InformationTypeAlert> alertsForInformationType(@PathVariable UUID informationTypeId) {
        var alerts = alertService.checkAlertsForInformationType(informationTypeId);
        return ResponseEntity.ok(alerts);
    }

    @Operation(summary = "Get Alerts for disclosure")
    @ApiResponse(description = "Alerts fetched")
    @GetMapping("/disclosure/{disclosureId}")
    public ResponseEntity<DisclosureAlert> alertsForDisclosure(@PathVariable UUID disclosureId) {
        var alerts = alertService.checkAlertsForDisclosure(disclosureId);
        return ResponseEntity.ok(alerts);
    }

    @Operation(summary = "Get Alerts events")
    @ApiResponse(description = "Alert events fetched")
    @GetMapping("/events")
    public ResponseEntity<RestResponsePage<AlertEventResponse>> alertsEvents(PageParameters parameters,
            @RequestParam(value = "processId", required = false) UUID processId,
            @RequestParam(value = "informationTypeId", required = false) UUID informationTypeId,
            @RequestParam(value = "disclosureId", required = false) UUID disclosureId,
            @RequestParam(value = "type", required = false) AlertEventType type,
            @RequestParam(value = "level", required = false) AlertEventLevel level,
            @RequestParam(value = "sort", required = false) AlertSort sort,
            @RequestParam(value = "dir", required = false) SortDir dir
    ) {
        parameters.validate();
        var request = new AlertEventRequest(processId, informationTypeId, disclosureId, type, level, parameters.getPageNumber(), parameters.getPageSize(), sort, dir);
        var events = alertService.getEvents(request).map(this::convertEventResponse);
        return ResponseEntity.ok(new RestResponsePage<>(events));
    }

    @Operation(summary = "mail test")
    @ApiResponses(value = {@ApiResponse(description = "mail")})
    @GetMapping(value = "/mail", produces = "text/html")
    public ResponseEntity<String> mail() {
        alertService.testMail();
        return ResponseEntity.ok("ok");
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

        Optional.ofNullable(event.getDisclosureId())
                .flatMap(domainCache::getDisclosure)
                .ifPresent(it -> builder.disclosure(it.convertToResponse()));

        return builder.build();
    }

    public static class EventPage extends RestResponsePage<AlertEventResponse> {

        public enum AlertSort {
            PROCESS, INFORMATION_TYPE, DISCLOSURE, TYPE, LEVEL, TIME, USER
        }

        public enum SortDir {
            ASC, DESC
        }
    }

}
