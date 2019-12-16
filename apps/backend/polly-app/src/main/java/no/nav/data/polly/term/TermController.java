package no.nav.data.polly.term;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.common.exceptions.ValidationException;
import no.nav.data.polly.common.rest.RestResponsePage;
import no.nav.data.polly.informationtype.InformationTypeRepository;
import no.nav.data.polly.informationtype.domain.TermCount;
import no.nav.data.polly.term.catalog.TermCatalogClient;
import no.nav.data.polly.term.domain.PollyTerm;
import no.nav.data.polly.term.dto.TermCountResponse;
import no.nav.data.polly.term.dto.TermResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
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
import static no.nav.data.polly.common.utils.StartsWithComparator.startsWith;
import static no.nav.data.polly.common.utils.StreamUtils.convert;

@Slf4j
@RestController
@CrossOrigin
@RequestMapping("/term")
@Api(value = "Term", description = "REST API for Term", tags = {"Term"})
public class TermController {

    private final InformationTypeRepository informationTypeRepository;
    private final TermCatalogClient termCatalogClient;

    public TermController(InformationTypeRepository informationTypeRepository, TermCatalogClient termCatalogClient) {
        this.informationTypeRepository = informationTypeRepository;
        this.termCatalogClient = termCatalogClient;
    }

    @ApiOperation(value = "Get Term")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Term fetched", response = TermResponse.class),
            @ApiResponse(code = 404, message = "Term not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/{id}")
    public ResponseEntity<TermResponse> findForId(@PathVariable String id) {
        log.info("Received request for Term with the id={}", id);
        Optional<TermResponse> termResponse = termCatalogClient.getTerm(id).map(PollyTerm::convertToResponse);
        if (termResponse.isEmpty()) {
            log.info("Cannot find the Term with id={}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        log.info("Returned Term");
        return new ResponseEntity<>(termResponse.get(), HttpStatus.OK);
    }

    @ApiOperation(value = "Search Terms")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Terms fetched", response = TermPage.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/search/{searchString}")
    public ResponseEntity<RestResponsePage<TermResponse>> searchTermByName(@PathVariable String searchString) {
        log.info("Received request for Term with name/description like {}", searchString);
        if (searchString.length() < 3) {
            throw new ValidationException("Search term must be at least 3 characters");
        }
        List<PollyTerm> terms = termCatalogClient.searchTerms(searchString);
        terms.sort(comparing(t -> t.getName() + t.getDescription(), startsWith(searchString)));
        log.info("Returned {} terms", terms.size());
        return new ResponseEntity<>(new RestResponsePage<>(convert(terms, PollyTerm::convertToResponse)), HttpStatus.OK);
    }

    @ApiOperation(value = "Count by InformationType")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Terms fetched", response = TermCountResponse.class),
            @ApiResponse(code = 500, message = "Internal server error")})
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
