package no.nav.data.polly.common.auditing.event;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.common.auditing.domain.Action;
import no.nav.data.polly.common.auditing.domain.AuditVersion;
import no.nav.data.polly.common.auditing.domain.AuditVersion.Fields;
import no.nav.data.polly.common.auditing.domain.AuditVersionRepository;
import no.nav.data.polly.common.exceptions.ValidationException;
import no.nav.data.polly.common.rest.PageParameters;
import no.nav.data.polly.common.rest.RestResponsePage;
import no.nav.data.polly.disclosure.domain.Disclosure;
import no.nav.data.polly.document.domain.Document;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.process.domain.Process;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static no.nav.data.polly.common.auditing.domain.AuditVersionRepository.exampleFrom;
import static no.nav.data.polly.common.utils.StreamUtils.convert;

@Slf4j
@RestController
@RequestMapping("/event")
@Api(value = "Domain object events", tags = {"Event"})
public class EventController {

    private final AuditVersionRepository repository;
    private final List<String> allowedTables = convert(
            List.of(InformationType.class, Process.class, Policy.class, Disclosure.class, Document.class),
            AuditVersion::tableName);

    public EventController(AuditVersionRepository repository) {
        this.repository = repository;
    }

    @ApiOperation(value = "Get events")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Events fetched", response = EventPage.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping
    public ResponseEntity<RestResponsePage<EventResponse>> getAll(PageParameters paging,
            @RequestParam String table,
            @RequestParam(required = false) String tableId,
            @RequestParam(required = false) Action action
    ) {
        log.info("Received request for Events {} table {}", paging, table);
        Pageable pageable = paging.createSortedPageByFieldDescending(Fields.time);
        validateTable(table);
        var example = AuditVersion.builder().table(table).tableId(tableId).action(action).build();
        Page<EventResponse> page = repository.findAll(exampleFrom(example), pageable).map(AuditVersion::convertToEventResponse);
        return new ResponseEntity<>(new RestResponsePage<>(page), HttpStatus.OK);
    }

    private void validateTable(String table) {
        if (!allowedTables.contains(table)) {
            throw new ValidationException("Table " + table + " does not exist or is not allowed");
        }
    }

    static class EventPage extends RestResponsePage<EventResponse> {

    }

}
