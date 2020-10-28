package no.nav.data.polly.term;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.exceptions.ValidationException;
import no.nav.data.common.rest.RestResponsePage;
import no.nav.data.polly.informationtype.InformationTypeRepository;
import no.nav.data.polly.informationtype.domain.TermCount;
import no.nav.data.polly.term.domain.PollyTerm;
import no.nav.data.polly.term.dto.TermCountResponse;
import no.nav.data.polly.term.dto.TermResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;

import static java.util.Comparator.comparing;
import static java.util.stream.Collectors.toMap;
import static no.nav.data.common.utils.StartsWithComparator.startsWith;
import static no.nav.data.common.utils.StreamUtils.convert;

@Slf4j
@RestController
@RequestMapping("/term")
@Tag(name = "Term", description = "REST API for Term")
public class TermController {

    private final InformationTypeRepository informationTypeRepository;
    private final TermService termService;

    public TermController(InformationTypeRepository informationTypeRepository, TermService termService) {
        this.informationTypeRepository = informationTypeRepository;
        this.termService = termService;
    }

    @Operation(summary = "Get Term")
    @ApiResponse(description = "Term fetched")
    @GetMapping("/{id}")
    public ResponseEntity<TermResponse> findForId(@PathVariable String id) {
        log.info("Received request for Term with the id={}", id);
        Optional<TermResponse> termResponse = termService.getTerm(id).map(PollyTerm::convertToResponse);
        if (termResponse.isEmpty()) {
            log.info("Cannot find the Term with id={}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        log.info("Returned Term");
        return new ResponseEntity<>(termResponse.get(), HttpStatus.OK);
    }

    @Operation(summary = "Search Terms")
    @ApiResponse(description = "Terms fetched")
    @GetMapping("/search/{searchString}")
    public ResponseEntity<RestResponsePage<TermResponse>> searchTermByName(@PathVariable String searchString) {
        log.info("Received request for Term with name/description like {}", searchString);
        if (searchString.length() < 3) {
            throw new ValidationException("Search term must be at least 3 characters");
        }
        List<PollyTerm> terms = termService.searchTerms(searchString);
        terms.sort(comparing(t -> t.getName() + t.getDescription(), startsWith(searchString)));
        log.info("Returned {} terms", terms.size());
        return new ResponseEntity<>(new RestResponsePage<>(convert(terms, PollyTerm::convertToResponse)), HttpStatus.OK);
    }

    @Operation(summary = "Count by InformationType")
    @ApiResponse(description = "Terms fetched")
    @GetMapping("/count/informationtype")
    public ResponseEntity<TermCountResponse> getInformationTypeCount() {
        log.info("Get term count by InformationType");
        List<TermCount> termCounts = informationTypeRepository.countByTerm();
        Map<String, Long> counts = termCounts.stream()
                .map(c -> Map.entry(c.getTerm(), c.getCount()))
                .collect(toMap(Entry::getKey, Entry::getValue));
        log.info("Got {} terms with InformationTypes", counts.size());
        return ResponseEntity.ok(new TermCountResponse(counts));
    }

    static final class TermPage extends RestResponsePage<TermResponse> {

    }

}
