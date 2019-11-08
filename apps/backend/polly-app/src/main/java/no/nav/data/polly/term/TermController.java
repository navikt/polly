package no.nav.data.polly.term;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.common.exceptions.ValidationException;
import no.nav.data.polly.common.rest.PageParameters;
import no.nav.data.polly.common.rest.RestResponsePage;
import no.nav.data.polly.common.utils.StreamUtils;
import no.nav.data.polly.informationtype.InformationTypeRepository;
import no.nav.data.polly.informationtype.domain.TermCount;
import no.nav.data.polly.term.domain.Term;
import no.nav.data.polly.term.domain.TermRepository;
import no.nav.data.polly.term.domain.TermSlim;
import no.nav.data.polly.term.dto.TermCountResponse;
import no.nav.data.polly.term.dto.TermRequest;
import no.nav.data.polly.term.dto.TermResponse;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.validation.Valid;

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

    private final TermRepository repository;
    private final InformationTypeRepository informationTypeRepository;
    private final TermService service;

    public TermController(TermRepository repository, InformationTypeRepository informationTypeRepository, TermService service) {
        this.repository = repository;
        this.informationTypeRepository = informationTypeRepository;
        this.service = service;
    }

    @ApiOperation(value = "Get Term")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Term fetched", response = TermResponse.class),
            @ApiResponse(code = 404, message = "Term not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/{id}")
    public ResponseEntity<TermResponse> findForId(@PathVariable UUID id) {
        log.info("Received request for Term with the id={}", id);
        Optional<TermResponse> termResponse = repository.findById(id).map(Term::convertToResponse);
        if (termResponse.isEmpty()) {
            log.info("Cannot find the Term with id={}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        log.info("Returned Term");
        return new ResponseEntity<>(termResponse.get(), HttpStatus.OK);
    }

    @ApiOperation(value = "Get Term")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Term fetched", response = TermResponse.class),
            @ApiResponse(code = 404, message = "Term not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/name/{name}")
    public ResponseEntity<TermResponse> getTermByName(@PathVariable String name) {
        log.info("Received request for Term with the name={}", name);
        Optional<Term> term = repository.findByName(name);
        if (term.isEmpty()) {
            log.info("Cannot find the Term with name={}", name);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        log.info("Returned Term");
        return new ResponseEntity<>(term.get().convertToResponse(), HttpStatus.OK);
    }

    @ApiOperation(value = "Search Terms", notes = "Does not include data")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Terms fetched", response = TermPage.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/search/{name}")
    public ResponseEntity<RestResponsePage<TermResponse>> searchTermByName(@PathVariable String name) {
        log.info("Received request for Term with the name like {}", name);
        if (name.length() < 3) {
            throw new ValidationException("Search term must be at least 3 characters");
        }
        List<TermSlim> terms = repository.findByNameContainingIgnoreCase(name);
        terms.sort(comparing(TermSlim::getName, startsWith(name)));
        log.info("Returned {} terms", terms.size());
        return new ResponseEntity<>(new RestResponsePage<>(convert(terms, TermSlim::convertToResponse)), HttpStatus.OK);
    }

    @ApiOperation(value = "Get All Terms")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Terms fetched", response = TermPage.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/")
    public ResponseEntity<RestResponsePage<TermResponse>> findAll(PageParameters page) {
        log.info("Received request for all Terms");
        Page<TermResponse> terms = repository.findAll(page.createIdSortedPage()).map(Term::convertToResponse);
        log.info("Returned {} Terms", terms.getContent().size());
        return ResponseEntity.ok(new RestResponsePage<>(terms));
    }

    @ApiOperation(value = "Count all Terms")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Count of Terms fetched", response = Long.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/count")
    public Long countAllTerms() {
        log.info("Received request for count all Terms");
        return repository.count();
    }

    @ApiOperation(value = "Count by InformationType")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Terms fetched", response = TermCountResponse.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/count/informationtype")
    public ResponseEntity<TermCountResponse> getInformationTypeCount() {
        log.info("Get term count by InformationType");
        List<TermCount> purposeCounts = informationTypeRepository.countByTerm();
        Map<String, Long> counts = purposeCounts.stream()
                .map(c -> Map.entry(c.getTerm(), c.getCount()))
                .collect(toMap(Entry::getKey, Entry::getValue));
        log.info("Got {} terms with InformationTypes", counts.size());
        return ResponseEntity.ok(new TermCountResponse(counts));
    }

    @ApiOperation(value = "Create Terms")
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "Terms to be created successfully accepted", response = TermPage.class),
            @ApiResponse(code = 400, message = "Illegal arguments"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @PostMapping
    public ResponseEntity<RestResponsePage<TermResponse>> createTerms(@RequestBody List<TermRequest> requests) {
        log.info("Received requests to create Terms");
        requests = StreamUtils.nullToEmptyList(requests);
        service.validateRequest(requests, false);
        List<Term> terms = convert(requests, Term::convertFromNewRequest);

        return new ResponseEntity<>(new RestResponsePage<>(repository.saveAll(terms).stream().map(Term::convertToResponse).collect(Collectors.toList())), HttpStatus.CREATED);
    }

    @ApiOperation(value = "Update Term")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Term to be updated successfully accepted", response = TermPage.class),
            @ApiResponse(code = 400, message = "Illegal arguments"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @PutMapping
    public ResponseEntity<RestResponsePage<TermResponse>> updateTerms(@RequestBody List<TermRequest> requestsIn) {
        log.info("Received requests to update Terms");
        var requests = StreamUtils.nullToEmptyList(requestsIn);
        service.validateRequest(requests, true);
        List<Term> all = repository.findAllById(convert(requests, TermRequest::getIdAsUUID));
        all.forEach(term -> term.convertFromRequest(requests.stream().filter(r -> r.getIdAsUUID().equals(term.getId())).findFirst().orElseThrow()));

        return ResponseEntity.ok(new RestResponsePage<>(repository.saveAll(all).stream().map(Term::convertToResponse).collect(Collectors.toList())));
    }

    @ApiOperation(value = "Update Term")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Accepted one Term to be updated", response = TermResponse.class),
            @ApiResponse(code = 400, message = "Illegal arguments"),
            @ApiResponse(code = 404, message = "Term not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @PutMapping("/{id}")
    public ResponseEntity<TermResponse> updateOneTermById(@PathVariable UUID id, @Valid @RequestBody TermRequest request) {
        log.info("Received a request to update Term with id={}", id);
        if (!id.equals(request.getIdAsUUID())) {
            throw new ValidationException(String.format("Mismatch between path and request id, id=%s request id=%s", id, request.getId()));
        }
        Optional<Term> byId = repository.findById(id);
        if (byId.isEmpty()) {
            log.info("Cannot find Term with id={}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        service.validateRequest(List.of(request), true);

        Term term = byId.get().convertFromRequest(request);

        log.info("Updated the Term");
        return new ResponseEntity<>(repository.save(term).convertToResponse(), HttpStatus.OK);
    }

    @ApiOperation(value = "Delete Term")
    @ApiResponses(value = {
            @ApiResponse(code = 202, message = "Term deleted", response = TermResponse.class),
            @ApiResponse(code = 404, message = "Term not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @DeleteMapping("/{id}")
    public ResponseEntity<TermResponse> deleteTermById(@PathVariable UUID id) {
        log.info("Received a request to delete Term with id={}", id);
        Optional<Term> fromRepository = repository.findById(id);
        if (fromRepository.isEmpty()) {
            log.info("Cannot find Term with id={}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        repository.deleteById(id);
        log.info("Term with id={} deleted", id);
        return new ResponseEntity<>(fromRepository.get().convertToResponse(), HttpStatus.OK);
    }

    static final class TermPage extends RestResponsePage<TermResponse> {

    }

}
