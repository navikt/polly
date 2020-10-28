package no.nav.data.common.auditing.event;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.auditing.domain.Action;
import no.nav.data.common.auditing.domain.AuditVersion;
import no.nav.data.common.auditing.domain.AuditVersion.Fields;
import no.nav.data.common.auditing.domain.AuditVersionRepository;
import no.nav.data.common.exceptions.ValidationException;
import no.nav.data.common.rest.PageParameters;
import no.nav.data.common.rest.RestResponsePage;
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

import static no.nav.data.common.auditing.domain.AuditVersionRepository.exampleFrom;
import static no.nav.data.common.utils.StreamUtils.convert;

@Slf4j
@RestController
@RequestMapping("/event")
@Tag(name = "Event", description = "Domain object events")
public class EventController {

    private final AuditVersionRepository repository;
    private final List<String> allowedTables = convert(
            List.of(InformationType.class, Process.class, Policy.class, Disclosure.class, Document.class),
            AuditVersion::tableName);

    public EventController(AuditVersionRepository repository) {
        this.repository = repository;
    }

    @Operation(summary = "Get events")
    @ApiResponse(description = "Events fetched")
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
