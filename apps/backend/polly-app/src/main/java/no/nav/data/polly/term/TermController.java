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
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.validation.Valid;

import static no.nav.data.polly.common.utils.StreamUtils.convert;

@Slf4j
@RestController
@CrossOrigin
@RequestMapping("/term")
@Api(value = "Term", description = "REST API for Term", tags = {"Term"})
public class TermController {

    private final TermRepository repository;

    public TermController(TermRepository repository) {
        this.repository = repository;
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

    @ApiOperation(value = "Get All Terms")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Terms fetched", response = TermPage.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/")
    public ResponseEntity<RestResponsePage<TermResponse>> findAll(PageParameters page) {
        log.info("Received request for all Terms");
        Page<TermResponse> terms = repository.findAll(page.createIdSortedPage()).map(Term::convertToResponse);
        log.info("Returned {} Terms", terms.getContent().size());
        return ResponseEntity.ok(new RestResponsePage<>(terms.getContent(), terms.getPageable(), terms.getTotalElements()));
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

    @ApiOperation(value = "Create Terms")
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "Terms to be created successfully accepted", response = TermResponse.class, responseContainer = "List"),
            @ApiResponse(code = 400, message = "Illegal arguments"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @PostMapping
    public ResponseEntity<List<TermResponse>> createTerms(@RequestBody List<TermRequest> requests) {
        log.info("Received requests to create Terms");
        requests = StreamUtils.nullToEmptyList(requests);
        TermRequest.initiateRequests(requests, false);
//        service.validateRequest(requests); TODO
        List<Term> terms = convert(requests, Term::convertFromNewRequest);

        return new ResponseEntity<>(repository.saveAll(terms).stream().map(Term::convertToResponse).collect(Collectors.toList()), HttpStatus.CREATED);
    }

    @ApiOperation(value = "Update Term")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Term to be updated successfully accepted", response = TermResponse.class, responseContainer = "List"),
            @ApiResponse(code = 400, message = "Illegal arguments"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @PutMapping
    public ResponseEntity<List<TermResponse>> updateTerms(@RequestBody List<TermRequest> requestsIn) {
        log.info("Received requests to update Terms");
        var requests = StreamUtils.nullToEmptyList(requestsIn);
        TermRequest.initiateRequests(requests, true);
//        service.validateRequest(requests); TODO
        List<Term> all = repository.findAllByNameIn(convert(requests, TermRequest::getName));
        all.forEach(term -> term.convertFromRequest(requests.stream().filter(r -> r.getName().equals(term.getName())).findFirst().orElseThrow()));

        return ResponseEntity.ok(repository.saveAll(all).stream().map(Term::convertToResponse).collect(Collectors.toList()));
    }

    @ApiOperation(value = "Update Term")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Accepted one Term to be updated", response = Term.class),
            @ApiResponse(code = 400, message = "Illegal arguments"),
            @ApiResponse(code = 404, message = "Term not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @PutMapping("/{id}")
    public ResponseEntity<TermResponse> updateOneTermById(@PathVariable UUID id, @Valid @RequestBody TermRequest request) {
        log.info("Received a request to update Term with id={}", id);
        Optional<Term> byId = repository.findById(id);
        if (byId.isEmpty()) {
            log.info("Cannot find Term with id={}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        String existingName = byId.get().getName();
        if (!existingName.equals(request.getName())) {
            throw new ValidationException(String.format("Cannot change name of term in update, id=%s has name=%s", id, existingName));
        }
        TermRequest.initiateRequests(List.of(request), true);
//        service.validateRequest(List.of(request)); TODO

        Term term = byId.get().convertFromRequest(request);

        log.info("Updated the Term");
        return new ResponseEntity<>(repository.save(term).convertToResponse(), HttpStatus.OK);
    }

    @ApiOperation(value = "Delete Term")
    @ApiResponses(value = {
            @ApiResponse(code = 202, message = "Term deleted"),
            @ApiResponse(code = 404, message = "Term not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @DeleteMapping("/{id}")
    public ResponseEntity deleteTermById(@PathVariable UUID id) {
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

    private static final class TermPage extends RestResponsePage<TermResponse> {

    }

}
